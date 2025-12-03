import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import UploadBox from "@/components/UploadBox";
import FetchBox from "@/components/FetchBox";

export default function UploadPage() {
  const [lastFilename, setLastFilename] = useState("");

  return (
    <div className="relative">
      <div className="aurora" />
      <Navbar />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <section className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Module 01</p>
          <h1 className="text-4xl font-bold">Sequence Intake Lab</h1>
          <p className="text-slate-400">
            Upload local FASTA artifacts or fetch curated datasets from the interstellar network.
            Every intake automatically hashes and records a new blockchain block.
          </p>
        </section>
        <div className="grid gap-6 md:grid-cols-2">
          <UploadBox onUploadComplete={setLastFilename} />
          <FetchBox onComplete={setLastFilename} />
        </div>
        {lastFilename && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
            Latest ingest: <span className="font-semibold text-neon">{lastFilename}</span>. Head to{" "}
            <Link href="/analyze" className="text-neon underline">
              Analyzer
            </Link>{" "}
            or{" "}
            <Link href="/ledger" className="text-neon underline">
              Ledger
            </Link>{" "}
            to continue.
          </div>
        )}
      </main>
    </div>
  );
}

