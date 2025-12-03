"""Shared backend utility helpers."""

from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests
from fastapi import HTTPException

from biopipeline.bio.fasta_qc import load_fasta  # type: ignore
from biopipeline.blockchain.hash import get_file_hash  # type: ignore

STORAGE_DIR = Path(__file__).resolve().parents[1] / "storage"
UPLOAD_DIR = STORAGE_DIR / "uploads"
LEDGER_FILE = STORAGE_DIR / "ledger.json"

PREDEFINED_FASTA_SOURCES = [
    {
        "id": "covid_spike",
        "name": "SARS-CoV-2 Spike Protein",
        "url": "https://raw.githubusercontent.com/biopython/biopython/master/Doc/examples/ls_orchid.fasta",
        "description": "Reference spike sequence (demo dataset).",
    },
    {
        "id": "human_mtDNA",
        "name": "Human Mitochondrial DNA",
        "url": "https://raw.githubusercontent.com/plotly/datasets/master/fasta/sample.fasta",
        "description": "Mitochondrial genome reference sample.",
    },
    {
        "id": "arabidopsis",
        "name": "Arabidopsis Chloroplast",
        "url": "https://raw.githubusercontent.com/NCBI-Codeathons/Using-BLAST/master/example_data/arabidopsis.fasta",
        "description": "Plant chloroplast FASTA sample.",
    },
]


def ensure_storage() -> None:
    """Make sure all storage directories and files exist."""
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    LEDGER_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not LEDGER_FILE.exists():
        LEDGER_FILE.write_text("[]", encoding="utf-8")


def get_upload_path(filename: str) -> Path:
    """Return the absolute path for a stored upload."""
    ensure_storage()
    sanitized = filename.replace("..", "").replace("/", "_").replace("\\", "_")
    return UPLOAD_DIR / sanitized


def analyze_fasta(filename: str) -> dict[str, Any]:
    """Compute sequence statistics for the provided FASTA file."""
    path = get_upload_path(filename)
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"{filename} not found")

    records = load_fasta(str(path))
    if not records:
        raise HTTPException(status_code=400, detail="No sequences detected in FASTA")

    total_length = 0
    total_gc_percent = 0.0
    informative_records = 0
    for rec in records:
        seq = str(rec.seq).upper()
        if not seq:
            continue
        length = len(seq)
        gc = (seq.count("G") + seq.count("C")) / length * 100
        total_length += length
        total_gc_percent += gc
        informative_records += 1

    if informative_records == 0:
        raise HTTPException(status_code=400, detail="Sequences contain no informative bases")

    avg_gc = round(total_gc_percent / informative_records, 2)
    first_seq = str(records[0].seq)
    preview = first_seq[:120] + ("..." if len(first_seq) > 120 else "")

    return {
        "filename": filename,
        "length": total_length,
        "gc_percent": avg_gc,
        "sequence_preview": preview,
    }


def calculate_file_hash(filename: str) -> str:
    """Return the SHA-256 hash for a stored upload."""
    path = get_upload_path(filename)
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"{filename} not found")
    return get_file_hash(str(path))


def load_ledger() -> list[dict[str, Any]]:
    """Read the current ledger from disk."""
    ensure_storage()
    try:
        return json.loads(LEDGER_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail="Ledger file corrupted") from exc


def save_ledger(entries: list[dict[str, Any]]) -> None:
    """Persist the ledger entries to disk."""
    LEDGER_FILE.write_text(json.dumps(entries, indent=2), encoding="utf-8")


def append_ledger_block(filename: str, file_hash: str | None = None) -> list[dict[str, Any]]:
    """Create a new ledger block referencing the previous entry."""
    ledger = load_ledger()
    next_index = len(ledger) + 1
    prev_hash = ledger[-1]["hash"] if ledger else "GENESIS"
    block_hash = file_hash or calculate_file_hash(filename)

    block = {
        "index": next_index,
        "filename": filename,
        "hash": block_hash,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "prev_hash": prev_hash,
    }

    ledger.append(block)
    save_ledger(ledger)
    return ledger


def record_file_ingest(filename: str, file_hash: str | None = None) -> dict[str, Any]:
    """Append a ledger block for a newly stored FASTA file and return the block."""
    ledger = append_ledger_block(filename, file_hash)
    return ledger[-1]


def available_fasta_sources() -> list[dict[str, str]]:
    """Return curated FASTA datasets."""
    return PREDEFINED_FASTA_SOURCES


def fetch_remote_fasta(source_url: str, filename: str | None = None) -> tuple[str, dict[str, Any]]:
    """Download a FASTA from a remote source, save it locally, and ledger the event."""
    ensure_storage()
    try:
        response = requests.get(source_url, timeout=20)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(status_code=400, detail="Unable to retrieve FASTA from the provided URL") from exc

    derived_name = filename or Path(urlparse(source_url).path).name or f"remote_{int(time.time())}.fasta"
    if not derived_name.lower().endswith((".fa", ".fasta")):
        derived_name += ".fasta"
    payload = response.text.strip()
    if ">" not in payload:
        raise HTTPException(status_code=400, detail="Remote response does not look like a FASTA file")

    destination = get_upload_path(derived_name)
    destination.write_text(response.text, encoding="utf-8")

    file_hash = calculate_file_hash(destination.name)
    block = record_file_ingest(destination.name, file_hash)
    return destination.name, block

