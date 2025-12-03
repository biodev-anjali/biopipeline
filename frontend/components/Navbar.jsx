import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/analyze", label: "Analyze" },
  { href: "/ledger", label: "Ledger" },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/60 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-black text-white">
          Bio<span className="text-neon">Pipeline</span>
        </Link>
        <ul className="flex items-center gap-6 text-sm uppercase tracking-wide">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  "rounded-full px-3 py-1 text-xs transition-colors duration-200",
                  router.pathname === href
                    ? "bg-neon/20 text-neon"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

