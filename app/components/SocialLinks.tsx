"use client";

import Link from "next/link";

type SocialLinksProps = {
  variant?: "row" | "stack";
  className?: string;
};

const SOCIAL_LINKS = [
  { href: "https://www.instagram.com/go2njemacka", label: "Instagram", icon: "instagram" as const },
  { href: "https://www.facebook.com/go2njemacka", label: "Facebook", icon: "facebook" as const },
  { href: "https://www.youtube.com/@go2njemacka", label: "YouTube", icon: "youtube" as const },
];

export default function SocialLinks({ variant = "row", className = "" }: SocialLinksProps) {
  return (
    <div
      className={`${
        variant === "row" ? "flex flex-wrap gap-3" : "grid gap-3"
      } ${className}`}
    >
      {SOCIAL_LINKS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#007BFF] hover:text-[#007BFF]"
        >
          <Icon name={item.icon} />
          {item.label}
        </Link>
      ))}
    </div>
  );
}

type IconName = "instagram" | "facebook" | "youtube";

function Icon({ name }: { name: IconName }) {
  switch (name) {
    case "instagram":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
          <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case "facebook":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M13.5 22v-8.5h2.8l.4-3.3h-3.2V8.2c0-.9.2-1.5 1.5-1.5h1.6V3.8c-.3 0-1.2-.1-2.2-.1-2.1 0-3.6 1.3-3.6 3.8v2.1H8.9v3.3h2.9V22h1.7z" />
        </svg>
      );
    case "youtube":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4s-3.9 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2 9.1 2 11v2c0 1.9.2 3.8.2 3.8s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.8.2 6.6.2 6.6.2s3.9 0 6.7-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1S22 14.9 22 13v-2c0-1.9-.4-3.8-.4-3.8zM10 15V9l5 3-5 3z" />
        </svg>
      );
    default:
      return null;
  }
}
