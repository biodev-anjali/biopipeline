"""Endpoints for handling FASTA uploads and analyses."""

from __future__ import annotations

import shutil
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from ..core import models, utils

router = APIRouter(prefix="", tags=["analysis"])


def _validate_extension(filename: str) -> None:
    if not filename.lower().endswith((".fa", ".fasta")):
        raise HTTPException(status_code=400, detail="Only .fa/.fasta files are supported")


@router.post("/upload-fasta", response_model=models.UploadResponse)
async def upload_fasta(file: UploadFile = File(...)) -> models.UploadResponse:
    """Persist an uploaded FASTA file to local storage."""
    _validate_extension(file.filename)
    destination = utils.get_upload_path(file.filename)
    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    file_hash = utils.calculate_file_hash(destination.name)
    ledger_block = utils.record_file_ingest(destination.name, file_hash)
    return models.UploadResponse(
        filename=Path(destination).name,
        hash=file_hash,
        ledger_block=models.LedgerBlock(**ledger_block),
        message="Upload ingested and ledgered",
    )


@router.get("/analyze/{filename}", response_model=models.AnalysisResponse)
async def analyze_fasta(filename: str) -> models.AnalysisResponse:
    """Run QC analysis on the requested FASTA and save to history."""
    stats = utils.analyze_fasta(filename)
    
    # Auto-save to history
    try:
        file_hash = utils.calculate_file_hash(filename)
        utils.append_analysis_history(filename, stats, file_hash)
    except Exception:
        # Don't fail the analysis if history save fails
        pass
    
    return models.AnalysisResponse(**stats)


@router.get("/fasta-sources", response_model=models.FastaSourceList)
async def list_fasta_sources() -> models.FastaSourceList:
    """Return curated FASTA datasets that can be fetched remotely."""
    return models.FastaSourceList(sources=utils.available_fasta_sources())


@router.post("/fetch-fasta", response_model=models.FetchResponse)
async def fetch_fasta(payload: models.FetchRequest) -> models.FetchResponse:
    """Fetch a FASTA from a remote source and record it in the ledger."""
    source = None
    if payload.source_id:
        source = next((item for item in utils.available_fasta_sources() if item["id"] == payload.source_id), None)
        if not source:
            raise HTTPException(status_code=404, detail="Source not found")
        fetch_url = source["url"]
        source_label = source["name"]
    else:
        fetch_url = str(payload.url)
        source_label = fetch_url

    stored_name, block = utils.fetch_remote_fasta(fetch_url, payload.filename)
    return models.FetchResponse(
        filename=stored_name,
        hash=block["hash"],
        ledger_block=models.LedgerBlock(**block),
        source=source_label,
    )


@router.get("/analysis-history", response_model=models.HistoryResponse)
async def get_analysis_history(
    filename: str | None = None,
    limit: int | None = None,
) -> models.HistoryResponse:
    """Retrieve analysis history with optional filtering by filename and limit."""
    history_entries = utils.get_analysis_history(filename=filename, limit=limit)
    
    # Convert to models
    entries = [models.AnalysisHistoryEntry(**entry) for entry in history_entries]
    
    return models.HistoryResponse(history=entries, total=len(entries))


@router.get("/analysis-history/{filename}", response_model=models.HistoryResponse)
async def get_analysis_history_by_filename(
    filename: str,
    limit: int | None = None,
) -> models.HistoryResponse:
    """Retrieve analysis history for a specific filename."""
    history_entries = utils.get_analysis_history(filename=filename, limit=limit)
    
    # Convert to models
    entries = [models.AnalysisHistoryEntry(**entry) for entry in history_entries]
    
    return models.HistoryResponse(history=entries, total=len(entries))

