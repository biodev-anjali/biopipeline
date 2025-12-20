# 🚀 Bio-Pipeline Lab Portal

_"Analyze, visualize, and immortalize FASTA sequences with a web sci-fi genomics lab and blockchain ledger."_

---

<img src="https://user-images.githubusercontent.com/20589912/223609650-futuristic-lab.gif" alt="sci-fi lab hero" width="100%"/>

## 🪐 What is Bio-Pipeline?

Bio-Pipeline is a full-stack web application for genomic sequence analysis and provenance tracking. It provides:

- **FASTA Sequence Processing**: Upload local files or fetch public datasets from remote sources
- **Quality Control Analysis**: Automated QC metrics (GC content, sequence length, previews) using Biopython
- **Cryptographic Hashing**: SHA-256 hashing for sequence integrity and provenance verification
- **Immutable Ledger**: Blockchain-style ledger system that records all sequence events with hash-linked blocks
- **Modern Web Interface**: Responsive, animated UI built with Next.js, Tailwind CSS, and Framer Motion
- **RESTful API**: FastAPI backend with comprehensive endpoints for all operations

## ✨ Features
- 🔬 **Sequence Intake Lab**: Upload local FASTA files or fetch from curated remote datasets
- 🧪 **QC Analyzer**: Biopython-powered sequence analysis with GC content, length metrics, and visualizations
- ⛓️ **Ledger Observatory**: Browse and download the complete blockchain ledger with real-time updates
- 🔐 **Cryptographic Provenance**: SHA-256 hashing ensures data integrity and traceability
- 🪄 **Modern UI**: Responsive, animated interface with real-time data visualization

---

## 🛠️ Tech Stack
- **Backend:** FastAPI (Python 3.10+), Biopython, local filesystem, SHA-256 hashing
- **Frontend:** Next.js (React), Tailwind CSS, Framer Motion, Recharts
- **Ledger:** JSON file, hash-linked blocks
- **Universal Deploy:** Docker, Vercel, Render, or local

---

## 🚦 Quickstart (Local)

**Requirements:** Python 3.10+, Node.js 18+

1. **Clone and install backend:**
    ```bash
    git clone https://github.com/YOUR-USER/bio-pipeline
    cd bio-pipeline
    python -m venv venv
    . venv/bin/activate # or .\venv\Scripts\activate (Windows)
    pip install --upgrade pip
    pip install -r backend/requirements.txt
    pip install -e .
    uvicorn backend.app.main:app --reload --port 8000
    ```
2. **Install and run frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    # Open http://localhost:3000
    ```
   
Or, with Docker Compose (needs Docker Desktop):
   ```bash
   docker-compose up --build
   # Backend on 8000, frontend on 3000
   ```

---


## 🔧 Configuration

Set the API base URL in `frontend/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

For production deployments, update this to your backend URL.

---

## 📡 API Documentation

The FastAPI backend provides the following endpoints:

### Analysis Endpoints

- `POST /upload-fasta` - Upload a FASTA file
  - Request: Multipart form data with file
  - Response: `UploadResponse` with filename, hash, and ledger block

- `GET /analyze/{filename}` - Analyze a stored FASTA file
  - Response: `AnalysisResponse` with length, GC%, and sequence preview

- `GET /fasta-sources` - List available remote FASTA sources
  - Response: `FastaSourceList` with curated dataset information

- `POST /fetch-fasta` - Fetch a FASTA file from a remote source
  - Request: `FetchRequest` with source_id or url
  - Response: `FetchResponse` with filename, hash, and ledger block

### Hashing Endpoints

- `POST /hash/{filename}` - Generate SHA-256 hash for a stored file
  - Response: `HashResponse` with filename and hash

### Ledger Endpoints

- `GET /ledger` - Retrieve the complete blockchain ledger
  - Response: `LedgerResponse` with array of ledger blocks

- `POST /ledger/add` - Manually add a block to the ledger
  - Request: `LedgerAddRequest` with filename and optional hash
  - Response: `LedgerResponse` with updated ledger

### Health Check

- `GET /` - Health check endpoint
  - Response: `{"status": "ok"}`

The API automatically generates interactive documentation at `/docs` (Swagger UI) and `/redoc` when the server is running.

---

## 🏗️ Architecture

### Backend Architecture

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── core/
│   │   ├── models.py        # Pydantic models for request/response validation
│   │   └── utils.py         # Business logic: FASTA analysis, hashing, ledger management
│   └── routers/
│       ├── analysis.py      # FASTA upload, analysis, and fetch endpoints
│       ├── hashing.py       # Cryptographic hashing operations
│       └── ledger.py        # Blockchain ledger management
├── biopipeline/
│   ├── bio/
│   │   └── fasta_qc.py      # Biopython-based sequence analysis
│   └── blockchain/
│       └── hash.py          # SHA-256 hashing utilities
└── storage/
    └── uploads/             # Local file storage for uploaded FASTA files
```

### Frontend Architecture

```
frontend/
├── pages/
│   ├── index.js             # Home page with feature overview
│   ├── upload.js            # Sequence intake interface
│   ├── analyze.js           # QC analysis interface
│   └── ledger.js            # Ledger observatory
├── components/
│   ├── Navbar.jsx           # Navigation component
│   ├── UploadBox.jsx        # File upload interface
│   ├── FetchBox.jsx         # Remote dataset fetcher
│   ├── LabPanel.jsx         # Feature overview cards
│   ├── ResultCard.jsx       # Analysis results display
│   └── LedgerTable.jsx      # Ledger block visualization
└── lib/
    └── api.js               # API client functions
```

### Data Flow

1. **Upload/Fetch**: User uploads or fetches a FASTA file
2. **Storage**: File is saved to `backend/app/storage/uploads/`
3. **Hashing**: SHA-256 hash is calculated for the file
4. **Ledger Entry**: A new block is created and appended to the ledger JSON file
5. **Analysis**: Biopython processes the sequence and calculates QC metrics
6. **Visualization**: Frontend displays results with charts and tables

### Ledger Structure

The ledger uses a blockchain-style structure where each block contains:
- `index`: Sequential block number
- `filename`: Name of the FASTA file
- `hash`: SHA-256 hash of the file
- `timestamp`: ISO 8601 timestamp
- `prev_hash`: Hash of the previous block (creates the chain)

---

## 📂 Project Structure
```
backend/           # FastAPI app and Dockerfile
  app/
    core/
    routers/
    storage/
frontend/          # Next.js and Dockerfile
biopipeline/       # Shared bio + blockchain helpers
pyproject.toml     # Editable install (pip install -e .)
.dockerignore, .gitignore
```

