export default function LedgerTable({ entries }) {
  if (!entries?.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400">
        Ledger is empty. Add a block after uploading and analyzing a FASTA file.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">Index</th>
            <th className="px-4 py-3">Filename</th>
            <th className="px-4 py-3">Hash</th>
            <th className="px-4 py-3">Prev Hash</th>
            <th className="px-4 py-3">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.index} className="border-t border-slate-800">
              <td className="px-4 py-3 font-semibold text-bioGreen">{entry.index}</td>
              <td className="px-4 py-3">{entry.filename}</td>
              <td className="px-4 py-3 font-mono text-xs">{entry.hash}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">
                {entry.prev_hash}
              </td>
              <td className="px-4 py-3 text-slate-400">
                {new Date(entry.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

