# 🚀 Bio-Pipeline Lab Portal

_"Analyze, visualize, and immortalize FASTA sequences with a web sci-fi genomics lab and blockchain ledger."_

---

<img src="https://user-images.githubusercontent.com/20589912/223609650-futuristic-lab.gif" alt="sci-fi lab hero" width="100%"/>

## 🪐 What is Bio-Pipeline?

Bio-Pipeline is a showpiece web application where you (or any explorer!) can:

- Beam up public FASTA datasets _from across the web_ or upload your own.
- Instantly compute sequence QC (GC%, length, preview) with Biopython.
- Hash every sequence with SHA-256 (crypto-level) to guarantee provenance.
- Every sequence event writes a new **block** to an immutable ledger (blockchain style).
- See all blocks and sequence stats in a sci-fi, magical, animated interface.
- [Easy deployment to Render, Vercel, Docker, or local](#deploy-to-cloud-or-docker).

_Tech for biohackers, students, and portfolio astronauts!_

## ✨ Features
- 🔬 **Sequence Intake Lab**: upload or fetch (remote) FASTA, auto-ingested and blockchained
- 🧪 **QC Analyzer**: Biopython-powered GC content and length, with live chart
- ⛓️ **Ledger Observatory**: browse/download full blockchain ledger, real-time updates
- 🪄 **Magical UX**: animated, glowing, “deep space” sci-fi vibe (built with Tailwind & Framer Motion)
- 🦸 **Showcase Ready**: set your name/pic/bio via environment variables for portfolio/demo

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

## 🚀 Deploy to Cloud or Docker

### Backend (FastAPI)
- **Render.com:**
  - Connect repo, set root to `backend/`, build: `pip install -r requirements.txt && pip install -e .`, start: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
  - Add persistent disk for `/app/app/storage` for uploads/ledger.
- **Docker:**
  - `docker build -t bio-backend ./backend`
  - `docker run -p 8000:8000 bio-backend`

### Frontend (Next.js)
- **Vercel:**
  - Connect repo, set root to `frontend/`.
  - Set: `NEXT_PUBLIC_API_BASE_URL` to your Render backend URL.
- **Docker:**
  - `docker build -t bio-frontend ./frontend`
  - `docker run -p 3000:3000 bio-frontend`

---

## 🧑‍🚀 Personalize for Portfolio

Set these in `frontend/.env.local`:
```env
NEXT_PUBLIC_PROFILE_NAME=Nova Stellar
NEXT_PUBLIC_PROFILE_TITLE=Lead Bioinformatics Engineer
NEXT_PUBLIC_PROFILE_BIO=Explorer of genomic constellations...
NEXT_PUBLIC_PROFILE_CONTACT=contact@example.com
NEXT_PUBLIC_PROFILE_LINKEDIN=https://linkedin.com/in/yourprofile
NEXT_PUBLIC_PROFILE_GITHUB=https://github.com/yourhandle
NEXT_PUBLIC_API_BASE_URL=https://your-fastapi-backend.onrender.com
```
You can safely commit `.env.example` but not your real secrets!

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

## 📜 API Endpoints (Backend)
| Endpoint                | Method | Description                          |
|------------------------|--------|--------------------------------------|
| /upload-fasta          | POST   | Upload local FASTA file              |
| /fetch-fasta           | POST   | Fetch & record remote FASTA (URL/canned) |
| /analyze/{filename}    | GET    | Parse and analyze uploaded file      |
| /ledger                | GET    | Get the blockchain ledger            |
| /ledger/add            | POST   | (Legacy) Add block manually          |
| /fasta-sources         | GET    | List pre-curated remote datasets     |

---

## 🪐 Screenshots

*(Insert animated screenshots/GIF demo here)*

---

## 📣 Extensibility/Tips
- Add more FASTA sources to `backend/app/core/utils.py -> PREDEFINED_FASTA_SOURCES`.
- Add lab modules by making new pages/components in `frontend/pages/` and wiring in new endpoints.
- Replace all dummy profile ENV values for your portfolio.

**Good luck on your cosmic genomics journey!**
