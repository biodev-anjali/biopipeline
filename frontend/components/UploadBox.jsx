import { useState } from "react";
import { uploadFasta } from "@/lib/api";

export default function UploadBox({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [hash, setHash] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage("Please select a FASTA file first.");
      return;
    }

    setIsUploading(true);
    setMessage("");
    setHash("");
    try {
      const resp = await uploadFasta(file);
      setMessage(`Uploaded ${resp.filename} · Block #${resp.ledger_block.index}`);
      setHash(resp.hash);
      onUploadComplete?.(resp.filename);
      setFile(null);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur"
    >
      <div>
        <label className="block text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
          Upload FASTA
        </label>
        <input
          type="file"
          accept=".fa,.fasta"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-2 w-full rounded border border-dashed border-slate-700 bg-slate-950/80 px-4 py-3 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isUploading}
        className="w-full rounded-full bg-gradient-to-r from-neon to-bioGreen px-4 py-3 font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUploading ? "Uploading..." : "Upload & Ledger"}
      </button>
      {message && (
        <p className="text-sm text-slate-300" role="status">
          {message}
        </p>
      )}
      {hash && (
        <p className="break-all rounded border border-slate-800 bg-slate-950/70 p-3 font-mono text-xs text-slate-400">
          SHA-256: {hash}
        </p>
      )}
    </form>
  );
}

