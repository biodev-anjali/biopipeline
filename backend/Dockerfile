# Production Dockerfile for FastAPI backend
FROM python:3.10-slim as base

# For build time speedup, separate static requirements install
COPY requirements.txt /tmp/
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r /tmp/requirements.txt

# Copy app and bio-pipeline package
WORKDIR /app
COPY app ./app
COPY biopipeline ./biopipeline
COPY pyproject.toml ./
RUN pip install --no-cache-dir -e .

# Set up command: serve with uvicorn
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
