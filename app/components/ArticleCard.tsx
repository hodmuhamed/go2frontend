"use client";

import Image from "next/image";
import Link from "next/link";

export type ArticleCardPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string | null;
  categoryName?: string | null;
  featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
};

export type ArticleCardProps = {
  post: ArticleCardPost;
  layout?: "vertical" | "horizontal";
  showExcerpt?: boolean;
  className?: string;
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("bs-BA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function ArticleCard({ post, layout = "vertical", showExcerpt = false, className = "" }: ArticleCardProps) {
  const href = `/${post.slug}`;
  const img = post.featuredImage?.node?.sourceUrl ?? null;
  const isHorizontal = layout === "horizontal";

  return (
    <Link
      href={href}
      className={`group flex h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-[2px] hover:shadow-lg ${
        isHorizontal ? "flex-row" : "flex-col"
      } ${className}`}
    >
      <div
        className={`relative overflow-hidden bg-[#F0F2F8] ${
          isHorizontal ? "h-full w-32 flex-none sm:w-40" : "h-44 w-full"
        }`}
      >
        {img ? (
          <Image
            src={img}
            alt={post.title}
            fill
            sizes={isHorizontal ? "(min-width: 1024px) 10vw, (min-width: 640px) 18vw, 40vw" : "(min-width: 1024px) 20vw, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : null}
      </div>
      <div
        className={`flex flex-1 flex-col gap-3 bg-white p-5 ${
          isHorizontal ? "sm:p-6" : ""
        }`}
      >
        {post.categoryName ? (
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#FF3B3B]">
            {post.categoryName}
          </span>
        ) : null}
        <h3
          className={`font-heading text-slate-900 transition-colors group-hover:text-[#007BFF] ${
            isHorizontal ? "text-base font-semibold line-clamp-2" : "text-lg font-semibold leading-snug line-clamp-3"
          }`}
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        {showExcerpt && post.excerpt ? (
          <p className="line-clamp-3 text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        ) : null}
        <span className="mt-auto text-xs font-medium uppercase tracking-[0.25em] text-slate-500">{formatDate(post.date)}</span>
      </div>
    </Link>
  );
}
