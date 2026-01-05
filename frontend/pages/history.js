import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import AnalysisHistory from "@/components/AnalysisHistory";
import { getAnalysisHistory } from "@/lib/api";

export default function HistoryPage() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("");
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshHistory = async () => {
    try {
      setIsLoading(true);
      const resp = await getAnalysisHistory();
      setEntries(resp.history || []);
      setStatus(`Loaded ${new Date().toLocaleTimeString()}`);

      // Calculate statistics
      if (resp.history?.length > 0) {
        const totalAnalyses = resp.history.length;
        const totalLength = resp.history.reduce(
          (sum, entry) => sum + (entry.analysis?.length || 0),
          0
        );
        const avgGC =
          resp.history.reduce(
            (sum, entry) => sum + (entry.analysis?.gc_percent || 0),
            0
          ) / totalAnalyses;
        const uniqueFiles = new Set(
          resp.history.map((entry) => entry.filename)
        ).size;

        setStats({
          totalAnalyses,
          uniqueFiles,
          avgGC: avgGC.toFixed(2),
          totalLength: totalLength.toLocaleString(),
        });
      }
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshHistory();
    const interval = setInterval(refreshHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleReanalyze = (filename) => {
    router.push(`/analyze?filename=${encodeURIComponent(filename)}`);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analysis_history_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Filename", "Length", "GC %", "Timestamp", "File Hash"];
    const rows = entries.map((entry) => [
      entry.id,
      entry.filename,
      entry.analysis?.length || "",
      entry.analysis?.gc_percent || "",
      entry.timestamp,
      entry.file_hash,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const dataBlob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analysis_history_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <div className="aurora" />
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
              Analysis History
            </p>
            <h1 className="text-3xl font-bold">History Repository</h1>
            <p className="text-slate-400">
              View and manage all past sequence analyses. Every analysis is
              permanently saved for future reference.
            </p>
            {status && <p className="text-sm text-slate-500">{status}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={refreshHistory}
              disabled={isLoading}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm hover:border-neon disabled:opacity-60"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
            {entries.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm hover:border-neon"
                >
                  Export JSON
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm hover:border-neon"
                >
                  Export CSV
                </button>
              </>
            )}
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total Analyses
              </p>
              <p className="mt-2 text-2xl font-bold text-bioGreen">
                {stats.totalAnalyses}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Unique Files
              </p>
              <p className="mt-2 text-2xl font-bold text-neon">
                {stats.uniqueFiles}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Avg GC %
              </p>
              <p className="mt-2 text-2xl font-bold text-neon">
                {stats.avgGC}%
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total Length
              </p>
              <p className="mt-2 text-2xl font-bold text-bioGreen">
                {stats.totalLength}
              </p>
            </div>
          </div>
        )}

        {/* History Table */}
        <AnalysisHistory entries={entries} onReanalyze={handleReanalyze} />
      </main>
    </div>
  );
}

