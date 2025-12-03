"""Pydantic models shared across routers."""

from __future__ import annotations

from pydantic import BaseModel, Field, HttpUrl, model_validator


class LedgerBlock(BaseModel):
    index: int
    filename: str
    hash: str
    timestamp: str
    prev_hash: str


class UploadResponse(BaseModel):
    filename: str
    hash: str
    ledger_block: LedgerBlock
    message: str = "Upload successful"


class AnalysisResponse(BaseModel):
    filename: str
    length: int = Field(..., ge=0)
    gc_percent: float = Field(..., ge=0, le=100)
    sequence_preview: str


class HashResponse(BaseModel):
    filename: str
    hash: str


class LedgerResponse(BaseModel):
    ledger: list[LedgerBlock]


class LedgerAddRequest(BaseModel):
    filename: str
    file_hash: str | None = None


class FastaSource(BaseModel):
    id: str
    name: str
    url: str
    description: str


class FastaSourceList(BaseModel):
    sources: list[FastaSource]


class FetchRequest(BaseModel):
    source_id: str | None = None
    url: HttpUrl | None = None
    filename: str | None = None

    @model_validator(mode="after")
    def validate_payload(self) -> "FetchRequest":
        if not self.source_id and not self.url:
            raise ValueError("Either source_id or url must be provided")
        return self


class FetchResponse(BaseModel):
    filename: str
    hash: str
    ledger_block: LedgerBlock
    source: str

