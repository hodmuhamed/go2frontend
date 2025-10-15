"use client";

import { useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";

import client from "../../lib/apolloClient";
import { GET_CATEGORY_POSTS } from "../../lib/queries/categoryPostsQuery";

type CategorySectionProps = {
  title: string;
  slug: string;
  accentColor?: string;
  sectionId?: string;
};

const formatRelativeTime = (value: string) => {
  const target = new Date(value);
  const now = Date.now();
  const diff = now - target.getTime();

  if (Number.isNaN(target.getTime())) {
    return value;
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  const safeDiff = diff < 0 ? 0 : diff;

  if (safeDiff < minute) {
    const seconds = Math.max(1, Math.round(safeDiff / 1000));
    return `${seconds}s`;
  }
  if (safeDiff < hour) {
    return `${Math.round(safeDiff / minute)}min`;
  }
  if (safeDiff < day) {
    return `${Math.round(safeDiff / hour)}h`;
  }
  if (safeDiff < week) {
    return `${Math.round(safeDiff / day)}d`;
  }
  if (safeDiff < month) {
    return `${Math.round(safeDiff / week)}sed`;
  }
  if (safeDiff < year) {
    return `${Math.round(safeDiff / month)}mj`;
  }
  return `${Math.round(safeDiff / year)}g`;
};

const buildHref = (slug: string) => `https://go2njemacka.de/${slug}`;

export default function CategorySection({ title, slug, accentColor = "bg-red-500", sectionId }: CategorySectionProps) {
  const { loading, error, data } = useQuery(GET_CATEGORY_POSTS, {
    client,
    variables: { slug, first: 5 },
  });

  const posts = (data?.posts?.nodes ?? []) as Array<{
    id: string;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    customLabel?: string | null;
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
  }>;

  const [hero, ...rest] = posts;

  return (
    <section id={sectionId} className="space-y-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.3em] text-slate-700">
          <span className={`h-2.5 w-2.5 rounded-sm ${accentColor}`} />
          {title}
        </span>
        <Link
          href={`https://go2njemacka.de/kategorija/${slug}`}
          target="_blank"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 transition hover:text-slate-600"
        >
          Sve iz sekcije
        </Link>
      </div>

      {loading && (
        <div className="grid min-h-[180px] place-items-center text-sm text-slate-400">Učitavanje sadržaja…</div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          Greška pri učitavanju sekcije: {error.message}
        </div>
      )}

      {!loading && !error && hero && (
        <div className="grid gap-6 lg:grid-cols-3">
          <CategoryHeroCard post={hero} accentColor={accentColor} className="lg:col-span-2" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {rest.map((post) => (
              <CategoryMiniCard key={post.id} post={post} accentColor={accentColor} />
            ))}
          </div>
        </div>
      )}

      {!loading && !error && !hero && (
        <div className="text-sm text-slate-500">Još nema objava u ovoj kategoriji.</div>
      )}
    </section>
  );
}

type CardProps = {
  post: {
    id: string;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    customLabel?: string | null;
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
  };
  accentColor: string;
  className?: string;
};

function CategoryHeroCard({ post, accentColor, className = "" }: CardProps & { className?: string }) {
  const img = post.featuredImage?.node?.sourceUrl ?? null;
  const href = buildHref(post.slug);
  const label = post.customLabel || "";

  return (
    <Link
      href={href}
      target="_blank"
      className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      <div className="relative h-64 w-full overflow-hidden sm:h-72">
        {img ? (
          <Image
            src={img}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-100 via-slate-50 to-white" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        {label ? (
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-red-500">{label}</span>
        ) : null}
        <h3
          className="text-2xl font-semibold leading-snug text-slate-900 transition-colors group-hover:text-slate-700"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <p
          className="line-clamp-3 text-sm text-slate-600"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <span className="mt-auto inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          <span className={`h-1.5 w-1.5 rounded-full ${accentColor}`} />
          {formatRelativeTime(post.date)}
        </span>
      </div>
    </Link>
  );
}

function CategoryMiniCard({ post, accentColor }: CardProps) {
  const img = post.featuredImage?.node?.sourceUrl ?? null;
  const href = buildHref(post.slug);
  const label = post.customLabel || "";

  return (
    <Link
      href={href}
      target="_blank"
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-40 w-full overflow-hidden">
        {img ? (
          <Image
            src={img}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 20vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-100 via-slate-50 to-white" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {label ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-red-500">{label}</span>
        ) : null}
        <h4
          className="text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-slate-700"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <p className="line-clamp-2 text-xs text-slate-600" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
          <span className={`h-1.5 w-1.5 rounded-full ${accentColor}`} />
          {formatRelativeTime(post.date)}
        </span>
      </div>
    </Link>
  );
}
