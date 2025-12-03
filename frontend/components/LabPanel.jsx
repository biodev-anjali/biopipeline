import { motion } from "framer-motion";
import Link from "next/link";

const defaultActions = [
  {
    title: "Sequence Ingestion",
    description: "Upload or beam in FASTA data and auto-hash it on the blockchain ledger.",
    href: "/upload",
  },
  {
    title: "Genomic Analyzer",
    description: "Visualize GC bias, sequence length, and previews for every upload.",
    href: "/analyze",
  },
  {
    title: "Ledger Observatory",
    description: "Audit blocks, timestamps, and immutable hashes in real time.",
    href: "/ledger",
  },
];

export default function LabPanel({ items = defaultActions }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((item, idx) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Lab {idx + 1}</p>
          <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          <Link
            href={item.href}
            className="mt-6 inline-flex items-center text-sm font-semibold text-neon hover:text-cyan-200"
          >
            Enter Module →
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

