"use client";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Go2Njemačka.de — Sva prava zadržana.</p>
        <div className="flex flex-wrap items-center gap-5">
          <a href="https://go2njemacka.de/o-nama" target="_blank" rel="noreferrer" className="transition hover:text-[#007BFF]">
            O nama
          </a>
          <a href="https://go2njemacka.de/posao" target="_blank" rel="noreferrer" className="transition hover:text-[#007BFF]">
            Posao
          </a>
          <a href="https://go2njemacka.de/kontakt" target="_blank" rel="noreferrer" className="transition hover:text-[#007BFF]">
            Kontakt
          </a>
        </div>
      </div>
    </footer>
  );
}
