"use client";

import { useState } from "react";

type SearchBarProps = {
  placeholder?: string;
};

export default function SearchBar({ placeholder = "Pretraži Go2Njemačka" }: SearchBarProps) {
  const [value, setValue] = useState("");

  return (
    <form
      role="search"
      className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur transition focus-within:border-[#007BFF]"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5 text-slate-500"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="20" y1="20" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="h-10 flex-1 bg-transparent text-sm text-slate-700 outline-none"
      />
      <button
        type="submit"
        className="hidden rounded-full bg-[#007BFF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0056b3] sm:inline-flex"
      >
        Traži
      </button>
    </form>
  );
}
