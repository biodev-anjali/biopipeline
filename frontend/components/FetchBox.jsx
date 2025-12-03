import { useEffect, useState } from "react";
import { fetchRemoteFasta, listFastaSources } from "@/lib/api";
import { motion } from "framer-motion";

export default function FetchBox({ onComplete }) {
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    listFastaSources()
      .then((data) => setSources(data.sources))
      .catch(() => setSources([]));
  }, []);

  const handleFetch = async (event) => {
    event.preventDefault();
    if (!selectedSource && !customUrl) {
      setStatus("Select a curated dataset or provide a URL.");
      return;
    }
    setIsLoading(true);
    setStatus("Fetching sequence from the ether...");
    try {
      const payload = {
        source_id: selectedSource || undefined,
        url: customUrl || undefined,
        filename: filename || undefined,
      };
      const resp = await fetchRemoteFasta(payload);
      setStatus(`Ingested ${resp.filename} • Hash ${resp.hash.slice(0, 12)}...`);
      onComplete?.(resp.filename);
      setFilename("");
      setCustomUrl("");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleFetch}
      className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/50 p-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Beam In FASTA
        </label>
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="rounded border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm"
        >
          <option value="">Choose a curated dataset</option>
          {sources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
        {selectedSource && (
          <p className="text-xs text-slate-400">
            {sources.find((s) => s.id === selectedSource)?.description}
          </p>
        )}
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.3em] text-slate-500">or paste URL</label>
        <input
          type="url"
          placeholder="https://example.com/sequence.fasta"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          className="mt-2 w-full rounded border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Override filename</label>
        <input
          type="text"
          placeholder="Optional alias e.g. nova_sequence.fasta"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="mt-2 w-full rounded border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-gradient-to-r from-neon to-bioGreen px-6 py-3 font-semibold text-slate-950 shadow-lg disabled:opacity-60"
      >
        {isLoading ? "Fetching..." : "Fetch FASTA"}
      </button>

      {status && <p className="text-sm text-slate-300">{status}</p>}
    </motion.form>
  );
}

