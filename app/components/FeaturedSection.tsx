"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export type FeaturedPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
};

type FeaturedSectionProps = {
  hero: FeaturedPost;
  highlights: FeaturedPost[];
  onPostsUsed?: (ids: string[]) => void;
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

export default function FeaturedSection({ hero, highlights, onPostsUsed }: FeaturedSectionProps) {
  useEffect(() => {
    if (onPostsUsed) {
      onPostsUsed([hero.id, ...highlights.map((post) => post.id)]);
    }
  }, [hero.id, highlights, onPostsUsed]);

  return (
    <section className="grid gap-8 rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <FeaturedHero post={hero} />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">U fokusu</h2>
          <Link
            href={`/${hero.slug}`}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-[#007BFF] transition hover:text-[#0056b3]"
          >
            Pogledaj priču
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {highlights.map((post) => (
            <HighlightCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

type PostCardProps = {
  post: FeaturedPost;
};

function FeaturedHero({ post }: PostCardProps) {
  const img = post.featuredImage?.node?.sourceUrl ?? null;
  const href = `/${post.slug}`;

  return (
    <Link
      href={href}
      className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-[28px] bg-slate-900 text-white sm:min-h-[320px]"
    >
      {img ? (
        <Image
          src={img}
          alt={post.title}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover brightness-[0.9] transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />
      <div className="relative z-10 mt-auto flex flex-col gap-3 p-6 sm:p-8">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#FF3B3B] backdrop-blur">
          Istaknuta priča
        </span>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1
              className="inline text-3xl font-semibold leading-snug font-heading sm:text-4xl"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
            <span className="text-sm text-white/80">{formatDate(post.date)}</span>
          </div>
          <p className="max-w-2xl text-sm text-white/80 sm:text-base lg:line-clamp-3" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        </div>
      </div>
    </Link>
  );
}

function HighlightCard({ post }: PostCardProps) {
  const img = post.featuredImage?.node?.sourceUrl ?? null;
  const href = `/${post.slug}`;

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-3 transition duration-200 hover:-translate-y-[2px] hover:shadow-md"
    >
      <div className="relative h-20 w-24 overflow-hidden rounded-xl bg-slate-100">
        {img ? (
          <Image
            src={img}
            alt={post.title}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <h3
          className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#007BFF]"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <span className="text-xs text-slate-500">{formatDate(post.date)}</span>
      </div>
    </Link>
  );
}
