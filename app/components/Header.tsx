"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
  isAnchor?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Početna" },
  { href: "/#dolazak", label: "Kategorije", isAnchor: true },
  { href: "/#contact", label: "Kontakt", isAnchor: true },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const resolvedLinks = useMemo(() => NAV_LINKS, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-white/60 transition duration-300 ${
        isScrolled ? "bg-white/95 shadow-lg shadow-slate-900/5 backdrop-blur" : "bg-white/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex flex-none items-center gap-3 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1.5 text-slate-800 shadow-sm transition hover:bg-white"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#007BFF] to-[#0056b3] text-sm font-semibold text-white">
            G2
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Go2Njemačka</span>
            <span className="text-base font-heading font-semibold text-slate-900">Blog</span>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {resolvedLinks.map((link) => {
            const isActive = !link.isAnchor ? pathname === link.href : pathname === "/";
            return <DesktopNavLink key={link.label} link={link} isActive={isActive} />;
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#007BFF]/40 hover:text-[#007BFF] hover:shadow-md lg:flex"
            aria-label="Pretraga"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link
            href="/#newsletter"
            className="hidden items-center gap-2 rounded-full border border-[#007BFF] bg-[#007BFF] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md lg:inline-flex"
          >
            Newsletter
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>

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
        links={resolvedLinks}
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

function MobileMenu({ isOpen, onClose, links }: { isOpen: boolean; onClose: () => void; links: NavLink[] }) {
  return (
    <aside
      className={`fixed inset-y-0 right-0 z-50 w-80 max-w-full transform rounded-l-3xl bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
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
      <nav className="flex flex-col gap-3 px-5 py-6">
        {links.map((link) => (
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
      <div className="mt-auto space-y-4 border-t border-slate-200 px-5 py-6 text-sm text-slate-600">
        <p className="font-semibold uppercase tracking-[0.3em] text-slate-500">Pratite nas</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="https://www.instagram.com/go2njemacka"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 transition hover:border-[#007BFF] hover:text-[#007BFF]"
          >
            Instagram
          </Link>
          <Link
            href="https://www.facebook.com/go2njemacka"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 transition hover:border-[#007BFF] hover:text-[#007BFF]"
          >
            Facebook
          </Link>
          <Link
            href="https://www.youtube.com/@go2njemacka"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 transition hover:border-[#007BFF] hover:text-[#007BFF]"
          >
            YouTube
          </Link>
        </div>
      </div>
    </aside>
  );
}
