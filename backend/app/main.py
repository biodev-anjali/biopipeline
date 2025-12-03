"""FastAPI application entry point for the Bio-Pipeline backend."""
from fastapi import FastAPI  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore

from .routers import analysis, hashing, ledger


def create_app() -> FastAPI:
    """Build and configure the FastAPI application instance."""
    app = FastAPI(
        title="Bio-Pipeline API",
        description="Backend services for FASTA analysis and blockchain ledgering.",
        version="1.0.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(analysis.router)
    app.include_router(hashing.router)
    app.include_router(ledger.router)

    @app.get("/", tags=["health"])
    def healthcheck() -> dict[str, str]:
        """Simple heartbeat endpoint."""
        return {"status": "ok"}

    return app


app = create_app()

