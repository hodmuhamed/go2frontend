"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Početna" },
  { href: "#dolazak", label: "Kategorije", isAnchor: true },
  { href: "#contact", label: "Kontakt", isAnchor: true },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${
        isScrolled ? "bg-white/95 shadow-md backdrop-blur" : "bg-white/90"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold font-heading text-slate-900">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#007BFF] text-white">G2</span>
          Go2Njemačka Blog
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
          {NAV_LINKS.map((link) => (
            link.isAnchor ? (
              <a
                key={link.label}
                href={link.href}
                className="uppercase tracking-[0.25em] transition hover:text-[#007BFF]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="uppercase tracking-[0.25em] transition hover:text-[#007BFF]"
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-[#007BFF]/40 hover:text-[#007BFF] lg:flex"
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

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-[#007BFF]/40 hover:text-[#007BFF] lg:hidden"
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

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-72 max-w-full transform bg-white shadow-xl transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
        <span className="text-base font-semibold uppercase tracking-[0.3em] text-slate-700">Meni</span>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-[#007BFF]/40 hover:text-[#007BFF]"
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
      <nav className="flex flex-col gap-4 px-4 py-6">
        {NAV_LINKS.map((link) => (
          link.isAnchor ? (
            <a
              key={link.label}
              href={link.href}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-600 transition hover:border-[#007BFF] hover:bg-[#007BFF]/5 hover:text-[#007BFF]"
              onClick={onClose}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-600 transition hover:border-[#007BFF] hover:bg-[#007BFF]/5 hover:text-[#007BFF]"
              onClick={onClose}
            >
              {link.label}
            </Link>
          )
        ))}
      </nav>
    </div>
  );
}
