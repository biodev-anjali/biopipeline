const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.detail || data.message || JSON.stringify(data);
    } catch {
      message = await res.text();
    }
    throw new Error(message || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function uploadFasta(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/upload-fasta`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}

export async function analyzeSequence(filename) {
  const res = await fetch(`${API_BASE}/analyze/${encodeURIComponent(filename)}`);
  return handleResponse(res);
}

export async function hashSequence(filename) {
  const res = await fetch(`${API_BASE}/hash/${encodeURIComponent(filename)}`, {
    method: "POST",
  });
  return handleResponse(res);
}

export async function getLedger() {
  const res = await fetch(`${API_BASE}/ledger`);
  return handleResponse(res);
}

export function downloadLedgerUrl() {
  return `${API_BASE}/ledger`;
}

export async function listFastaSources() {
  const res = await fetch(`${API_BASE}/fasta-sources`);
  return handleResponse(res);
}

export async function fetchRemoteFasta(payload) {
  const res = await fetch(`${API_BASE}/fetch-fasta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getAnalysisHistory(filename = null, limit = null) {
  const params = new URLSearchParams();
  if (filename) params.append("filename", filename);
  if (limit) params.append("limit", limit.toString());
  
  const queryString = params.toString();
  const url = `${API_BASE}/analysis-history${queryString ? `?${queryString}` : ""}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function getAnalysisHistoryByFilename(filename, limit = null) {
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit.toString());
  
  const queryString = params.toString();
  const url = `${API_BASE}/analysis-history/${encodeURIComponent(filename)}${queryString ? `?${queryString}` : ""}`;
  const res = await fetch(url);
  return handleResponse(res);
}

