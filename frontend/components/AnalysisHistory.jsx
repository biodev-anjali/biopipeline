import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AnalysisHistory({ entries, onReanalyze }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);

  if (!entries?.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400">
        No analysis history found. Analyze a FASTA file to create history entries.
      </div>
    );
  }

  const filteredEntries = entries.filter((entry) =>
    entry.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-4">
      {/* Search Filter */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by filename..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-neon focus:outline-none"
        />
        <span className="text-xs text-slate-500">
          {filteredEntries.length} of {entries.length} entries
        </span>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Filename</th>
              <th className="px-4 py-3">Length</th>
              <th className="px-4 py-3">GC %</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, idx) => (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-t border-slate-800 hover:bg-slate-900/40"
              >
                <td className="px-4 py-3 font-semibold">{entry.filename}</td>
                <td className="px-4 py-3 text-bioGreen">
                  {entry.analysis?.length?.toLocaleString() || "N/A"}
                </td>
                <td className="px-4 py-3 text-neon">
                  {entry.analysis?.gc_percent?.toFixed(2) || "N/A"}%
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {formatDate(entry.timestamp)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedEntry(
                          selectedEntry?.id === entry.id ? null : entry
                        )
                      }
                      className="rounded border border-slate-700 px-2 py-1 text-xs hover:border-neon"
                    >
                      {selectedEntry?.id === entry.id ? "Hide" : "Details"}
                    </button>
                    {onReanalyze && (
                      <button
                        type="button"
                        onClick={() => onReanalyze(entry.filename)}
                        className="rounded bg-neon/20 px-2 py-1 text-xs text-neon hover:bg-neon/30"
                      >
                        Re-analyze
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail View */}
      {selectedEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Analysis Details: {selectedEntry.filename}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedEntry(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Sequence Length
              </p>
              <p className="mt-1 text-2xl font-bold text-bioGreen">
                {selectedEntry.analysis?.length?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                GC Content
              </p>
              <p className="mt-1 text-2xl font-bold text-neon">
                {selectedEntry.analysis?.gc_percent?.toFixed(2) || "N/A"}%
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Sequence Preview
              </p>
              <p className="mt-2 font-mono text-xs text-slate-300">
                {selectedEntry.analysis?.sequence_preview || "N/A"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                File Hash
              </p>
              <p className="mt-1 break-all font-mono text-xs text-slate-400">
                {selectedEntry.file_hash}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Analyzed At
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {formatDate(selectedEntry.timestamp)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href={`/analyze?filename=${encodeURIComponent(
                selectedEntry.filename
              )}`}
              className="inline-flex items-center rounded bg-neon/20 px-4 py-2 text-sm text-neon hover:bg-neon/30"
            >
              Analyze Again →
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

