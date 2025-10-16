"use client";

import Link from "next/link";

export type SidebarPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  commentCount?: number | null;
  featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
};

type SidebarProps = {
  posts: SidebarPost[];
};

export default function Sidebar({ posts }: SidebarProps) {
  const topPosts = posts.slice(0, 5);

  return (
    <aside className="mt-12 w-full space-y-10 lg:mt-0 lg:w-80 lg:shrink-0 lg:sticky lg:top-28">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold uppercase tracking-[0.3em] text-slate-700">Najčitanije</h3>
        <div className="space-y-4">
          {topPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/${post.slug}`}
              className="group flex items-center gap-4 rounded-2xl p-2 transition hover:bg-slate-50"
            >
              <span className="text-sm font-semibold text-[#FF5C5C]">{String(index + 1).padStart(2, "0")}</span>
              <div className="flex-1">
                <h4
                  className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#007BFF]"
                  dangerouslySetInnerHTML={{ __html: post.title }}
                />
                <p className="text-xs text-slate-500">
                  {post.commentCount ? `${post.commentCount} komentara` : new Date(post.date).toLocaleDateString("bs-BA")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold uppercase tracking-[0.3em] text-slate-700">Pratite nas</h3>
        <div className="flex flex-wrap gap-3">
          <SocialLink href="https://www.instagram.com/go2njemacka" label="Instagram" icon="instagram" />
          <SocialLink href="https://www.facebook.com/go2njemacka" label="Facebook" icon="facebook" />
          <SocialLink href="https://www.youtube.com/@go2njemacka" label="YouTube" icon="youtube" />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold uppercase tracking-[0.3em] text-slate-700">Newsletter</h3>
        <p className="mb-4 text-sm text-slate-600">
          Prijavite se i dobijajte najnovije vodiče, priče i prilike direktno u inbox.
        </p>
        <form className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Vaše ime"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#007BFF] focus:bg-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email adresa"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#007BFF] focus:bg-white"
          />
          <button
            type="button"
            className="w-full rounded-2xl bg-[#007BFF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0056b3]"
          >
            Pretplati se
          </button>
        </form>
      </section>
    </aside>
  );
}

type SocialLinkProps = {
  href: string;
  label: string;
  icon: "instagram" | "facebook" | "youtube";
};

function SocialLink({ href, label, icon }: SocialLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#007BFF] hover:text-[#007BFF]"
    >
      <Icon name={icon} />
      {label}
    </Link>
  );
}

function Icon({ name }: { name: "instagram" | "facebook" | "youtube" }) {
  switch (name) {
    case "instagram":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="h-4 w-4"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case "facebook":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M13.5 22v-8.5h2.8l.4-3.3h-3.2V8.2c0-.9.2-1.5 1.5-1.5h1.6V3.8c-.3 0-1.2-.1-2.2-.1-2.1 0-3.6 1.3-3.6 3.8v2.1H8.9v3.3h2.9V22h1.7z" />
        </svg>
      );
    case "youtube":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2 9.1 2 11v2c0 1.9.2 3.8.2 3.8s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.8.2 6.6.2 6.6.2s3.9 0 6.7-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1S22 14.9 22 13v-2c0-1.9-.4-3.8-.4-3.8zM10 15V9l5 3-5 3z" />
        </svg>
      );
    default:
      return null;
  }
}
