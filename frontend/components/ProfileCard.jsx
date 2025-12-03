import { motion } from "framer-motion";
import profile from "@/lib/profile";

export default function ProfileCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 blur-3xl" />
      <div className="relative flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Mission Lead</p>
        <h2 className="text-4xl font-black text-white">{profile.name}</h2>
        <p className="text-lg text-neon">{profile.title}</p>
        <p className="text-slate-300">{profile.bio}</p>
        <div className="text-sm text-slate-400">
          <p>{profile.location}</p>
          <p>{profile.contact}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {profile.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-wider text-slate-200 hover:border-neon"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

