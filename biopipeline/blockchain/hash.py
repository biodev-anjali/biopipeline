"""Hashing utilities shared across the pipeline."""

from __future__ import annotations

import hashlib
from pathlib import Path


def get_file_hash(path: str | Path, chunk_size: int = 8192) -> str:
    """Compute the SHA-256 hash of the supplied file."""
    sha = hashlib.sha256()
    with Path(path).open("rb") as infile:
        while True:
            chunk = infile.read(chunk_size)
            if not chunk:
                break
            sha.update(chunk)
    return sha.hexdigest()

