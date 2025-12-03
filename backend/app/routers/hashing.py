"""Endpoints for SHA-256 hashing operations."""

from __future__ import annotations

from fastapi import APIRouter

from ..core import models, utils

router = APIRouter(prefix="", tags=["hashing"])


@router.post("/hash/{filename}", response_model=models.HashResponse)
async def hash_file(filename: str) -> models.HashResponse:
    """Return the SHA-256 digest for a stored FASTA."""
    digest = utils.calculate_file_hash(filename)
    return models.HashResponse(filename=filename, hash=digest)

