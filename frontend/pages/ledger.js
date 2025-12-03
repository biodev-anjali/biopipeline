import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import LedgerTable from "@/components/LedgerTable";
import { getLedger, downloadLedgerUrl } from "@/lib/api";

export default function LedgerPage() {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("");

  const refreshLedger = async () => {
    try {
      const resp = await getLedger();
      setEntries(resp.ledger);
      setStatus(`Synced ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      setStatus(error.message);
    }
  };

  useEffect(() => {
    refreshLedger();
    const interval = setInterval(refreshLedger, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="aurora" />
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Module 03</p>
            <h1 className="text-3xl font-bold">Ledger Observatory</h1>
            <p className="text-slate-400">
              Auto-ingested FASTA files materialize here as chained blocks with SHA-256 fingerprints.
            </p>
            {status && <p className="text-sm text-slate-500">{status}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={refreshLedger}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm hover:border-neon"
            >
              Manual Sync
            </button>
            <a
              href={downloadLedgerUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-slate-700 px-4 py-2 text-sm hover:border-neon"
            >
              Download JSON
            </a>
          </div>
        </div>
        <LedgerTable entries={entries} />
      </main>
    </div>
  );
}

