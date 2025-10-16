"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import SearchBar from "./SearchBar";

type NavLink = {
  href: string;
  label: string;
};

const PRIMARY_LINKS: NavLink[] = [
  { href: "/", label: "Početna" },
  { href: "/posao", label: "Posao" },
  { href: "/zivot-u-njemackoj", label: "Život u Njemačkoj" },
  { href: "/savjeti", label: "Savjeti" },
  { href: "/dokumenti", label: "Dokumenti" },
  { href: "/kontakt", label: "Kontakt" },
];

const CATEGORY_LINKS: NavLink[] = [
  { href: "/kategorija/dolazak-u-njemacku", label: "Dolazak u Njemačku" },
  { href: "/kategorija/posao", label: "Posao" },
  { href: "/kategorija/zivot", label: "Život" },
  { href: "/kategorija/porodica", label: "Porodica" },
  { href: "/kategorija/dokumenti", label: "Dokumenti" },
  { href: "/kategorija/pravna-pitanja", label: "Prava" },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (isMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }

    return undefined;
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const resolvedLinks = useMemo(() => PRIMARY_LINKS, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-[#007BFF]/40 bg-white/85 backdrop-blur transition duration-300 ${
        isScrolled ? "shadow-[0_12px_30px_-20px_rgba(15,23,42,0.5)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex flex-none items-center gap-3 rounded-full border border-[#007BFF]/10 bg-white/80 px-3 py-1.5 text-slate-800 shadow-sm transition hover:bg-white"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#007BFF] to-[#0056b3] text-sm font-semibold text-white">
            G2
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Go2Njemačka</span>
            <span className="text-base font-heading font-semibold text-slate-900">Portal</span>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {resolvedLinks
            .filter((link) => link.href === "/")
            .map((link) => <DesktopNavLink key={link.label} link={link} isActive={pathname === link.href} />)}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => setIsCategoriesOpen(false)}
          >
            <button
              type="button"
              className={`group inline-flex items-center gap-1 px-2 text-sm font-semibold uppercase tracking-[0.3em] transition ${
                pathname.includes("/kategorija") ? "text-[#007BFF]" : "text-slate-600 hover:text-[#007BFF]"
              }`}
            >
              Kategorije
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className={`h-4 w-4 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div
              className={`absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl transition duration-200 ${
                isCategoriesOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="grid gap-2">
                {CATEGORY_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#F4F6FB] hover:text-[#007BFF]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {resolvedLinks
            .filter((link) => link.href !== "/")
            .map((link) => <DesktopNavLink key={link.label} link={link} isActive={pathname === link.href} />)}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden w-72 lg:block">
            <SearchBar placeholder="Pretraži portal" />
          </div>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#007BFF]/40 hover:text-[#007BFF] hover:shadow-md lg:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Otvori navigaciju"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-5 w-5"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          aria-label="Zatvori meni"
          onClick={() => setIsMenuOpen(false)}
        />
      ) : null}

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
}

function DesktopNavLink({ link, isActive }: { link: NavLink; isActive: boolean }) {
  return (
    <Link
      href={link.href}
      className={`group relative inline-flex items-center px-2 text-sm font-semibold uppercase tracking-[0.3em] transition ${
        isActive ? "text-[#007BFF]" : "text-slate-600 hover:text-[#007BFF]"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {link.label}
      <span
        className={`pointer-events-none absolute inset-x-0 -bottom-1 h-[2px] origin-center rounded-full bg-gradient-to-r from-transparent via-[#007BFF] to-transparent transition duration-200 ${
          isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
        }`}
      />
    </Link>
  );
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <aside
      className={`fixed inset-0 z-50 w-full transform bg-white transition-transform duration-300 ease-out lg:hidden ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <span className="text-base font-semibold uppercase tracking-[0.3em] text-slate-700">Navigacija</span>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-[#007BFF]/40 hover:text-[#007BFF]"
          onClick={onClose}
          aria-label="Zatvori navigaciju"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>
      </div>
      <div className="space-y-6 px-6 py-6">
        <SearchBar placeholder="Pretraži portal" />
        <nav className="grid gap-3">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-600 transition hover:border-[#007BFF] hover:bg-[#007BFF]/5 hover:text-[#007BFF]"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Kategorije</p>
          <div className="grid gap-2">
            {CATEGORY_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#007BFF] hover:bg-[#007BFF]/5 hover:text-[#007BFF]"
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
