"""FASTA quality-control helpers reused by the FastAPI backend."""

from __future__ import annotations

from pathlib import Path
from typing import Iterable, List

from Bio import SeqIO
import csv


def load_fasta(path: str | Path) -> List[SeqIO.SeqRecord]:
    """Parse a FASTA file and return all sequence records."""
    source = Path(path)
    if not source.exists():
        raise FileNotFoundError(f"FASTA file not found: {source}")
    return list(SeqIO.parse(str(source), "fasta"))


def compute_qc(records: Iterable[SeqIO.SeqRecord]) -> list[dict[str, float | int | str]]:
    """Compute length, GC percentage, and invalid nucleotide counts per record."""
    rows: list[dict[str, float | int | str]] = []
    for rec in records:
        seq = str(rec.seq).upper()
        length = len(seq)
        gc_percent = round(((seq.count("G") + seq.count("C")) / length) * 100, 2) if length else 0.0
        invalid = sum(1 for base in seq if base not in "ATGC")
        rows.append(
            {
                "id": rec.id,
                "length": length,
                "gc_percent": gc_percent,
                "invalid_count": invalid,
            }
        )
    return rows


def save_csv(rows: list[dict[str, float | int | str]], path: str | Path) -> None:
    """Persist QC results."""
    if not rows:
        Path(path).write_text("")
        return
    with Path(path).open("w", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


def filter_sequences(
    rows: list[dict[str, float | int | str]], min_len: int = 10, max_invalid: int = 1
) -> list[dict[str, float | int | str]]:
    """Filter QC rows based on minimum length and invalid base thresholds."""
    return [
        row
        for row in rows
        if int(row["length"]) >= min_len and int(row["invalid_count"]) <= max_invalid
    ]

