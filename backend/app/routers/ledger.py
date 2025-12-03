"""Ledger management endpoints."""

from __future__ import annotations

from fastapi import APIRouter

from ..core import models, utils

router = APIRouter(prefix="", tags=["ledger"])


@router.get("/ledger", response_model=models.LedgerResponse)
async def get_ledger() -> models.LedgerResponse:
    """Fetch the current blockchain-style ledger."""
    entries = utils.load_ledger()
    return models.LedgerResponse(ledger=entries)


@router.post("/ledger/add", response_model=models.LedgerResponse)
async def add_block(payload: models.LedgerAddRequest) -> models.LedgerResponse:
    """Append a new block to the ledger."""
    entries = utils.append_ledger_block(payload.filename, payload.file_hash)
    return models.LedgerResponse(ledger=entries)

