"use client";

import Link from "next/link";

import NewsletterForm from "./NewsletterForm";
import SocialLinks from "./SocialLinks";

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
    <aside className="mt-12 w-full space-y-8 lg:sticky lg:top-32 lg:mt-0 lg:w-80 lg:shrink-0">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold uppercase tracking-[0.3em] text-slate-700">Najčitanije</h3>
        <div className="space-y-4">
          {topPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/${post.slug}`}
              className="group flex items-center gap-4 rounded-2xl p-2 transition hover:bg-[#F4F6FB]"
            >
              <span className="text-sm font-semibold text-[#FF5C5C]">{String(index + 1).padStart(2, "0")}</span>
              <div className="flex-1">
                <h4
                  className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#007BFF]"
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

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md" id="newsletter">
        <NewsletterForm />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold uppercase tracking-[0.3em] text-slate-700">Pratite nas</h3>
        <SocialLinks variant="row" />
      </section>
    </aside>
  );
}
