import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import LabPanel from "@/components/LabPanel";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora" />
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <section>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-4xl"
          >
            <p className="inline-flex items-center rounded-full border border-slate-800 px-4 py-1 text-xs uppercase tracking-[0.4em] text-slate-400">
              Bio-Pipeline · Deep Space Lab
            </p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
              Sci-fi genomics lab that ingests FASTA, runs QC, and engraves hashes on an
              immutable ledger—automatically.
            </h1>
            <p className="text-lg text-slate-300">
              Beam in sequences from curated cosmic datasets or upload your own.
              Each file is parsed with Biopython, visualized, hashed, and written to a blockchain-style ledger in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/upload"
                className="rounded-full bg-gradient-to-r from-neon to-bioGreen px-6 py-3 font-semibold text-slate-950 shadow-lg"
              >
                Enter the Lab
              </Link>
              <Link
                href="/ledger"
                className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-slate-100 hover:border-neon"
              >
                Ledger Observatory
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Lab Work</p>
              <h2 className="text-2xl font-bold text-white">Modules Online</h2>
            </div>
            <Link href="/upload" className="text-sm font-semibold text-neon">
              Expand capabilities →
            </Link>
          </div>
          <LabPanel />
        </section>
      </main>
    </div>
  );
}

