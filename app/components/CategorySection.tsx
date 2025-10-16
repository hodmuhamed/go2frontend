"use client";

import { useEffect } from "react";
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
  excludeIds?: string[];
  onPostsFetched?: (ids: string[]) => void;
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

const buildHref = (slug: string) => `/${slug}`;

type CategoryPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  commentCount?: number | null;
  customLabel?: string | null;
  featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
};

export default function CategorySection({
  title,
  slug,
  accentColor = "bg-[#FF5C5C]",
  sectionId,
  excludeIds = [],
  onPostsFetched,
}: CategorySectionProps) {
  const { loading, error, data } = useQuery(GET_CATEGORY_POSTS, {
    client,
    variables: { slug, first: 5 },
  });

  const excludeSet = new Set(excludeIds);
  const posts = ((data?.posts?.nodes ?? []) as CategoryPost[]).filter((post) => !excludeSet.has(post.id));

  useEffect(() => {
    if (onPostsFetched && posts.length > 0) {
      onPostsFetched(posts.map((post) => post.id));
    }
  }, [onPostsFetched, posts]);

  const [hero, ...rest] = posts;

  let content: JSX.Element;

  if (loading) {
    content = (
      <div className="grid min-h-[180px] place-items-center text-sm text-slate-400">Učitavanje sadržaja…</div>
    );
  } else if (error) {
    content = (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        Greška pri učitavanju sekcije: {error.message}
      </div>
    );
  } else if (!hero) {
    content = <div className="text-sm text-slate-500">Još nema objava u ovoj kategoriji.</div>;
  } else {
    const hasSupporting = rest.length > 0;

    content = (
      <div
        className={`grid gap-6 lg:gap-8 ${
          hasSupporting ? "lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]" : ""
        }`}
      >
        <CategoryHeroCard post={hero} accentColor={accentColor} />
        {hasSupporting ? (
          <div className="flex h-full flex-col divide-y divide-slate-200/70 overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur">
            {rest.map((post, index) => (
              <CategoryListCard
                key={post.id}
                post={post}
                accentColor={accentColor}
                isFirst={index === 0}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <section
      id={sectionId}
      className="scroll-mt-28 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_24px_48px_-24px_rgba(15,23,42,0.25)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 pb-4 pt-6 sm:px-8">
        <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-slate-700">
          <span className={`h-2.5 w-2.5 rounded-sm ${accentColor}`} />
          {title}
        </span>
        <Link
          href={`/category/${slug}`}
          className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 transition hover:text-slate-600"
        >
          Sve iz sekcije
        </Link>
      </div>
      <div className="h-px bg-gradient-to-r from-slate-200 via-slate-200/60 to-transparent" />
      <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8">{content}</div>
    </section>
  );
}

type CardProps = {
  post: CategoryPost;
  accentColor: string;
  isFirst?: boolean;
};

function CategoryHeroCard({ post, accentColor }: CardProps) {
  const img = post.featuredImage?.node?.sourceUrl ?? null;
  const href = buildHref(post.slug);
  const label = post.customLabel ?? "";

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eef2ff]">
        {img ? (
          <>
            <Image
              src={img}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white via-[#F8F9FB] to-[#e0e7ff] text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
            Go2Njemačka
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
        {label ? (
          <span className="inline-flex w-fit items-center rounded-full bg-[#FF5C5C]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#FF5C5C]">
            {label}
          </span>
        ) : null}
        <h3
          className="text-xl font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#007BFF] sm:text-2xl"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <p
          className="line-clamp-3 text-sm text-slate-600"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <div className="mt-auto flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-slate-500">
          <span className={`h-1.5 w-1.5 rounded-full ${accentColor}`} />
          {formatRelativeTime(post.date)}
        </div>
      </div>
    </Link>
  );
}

function CategoryListCard({ post, accentColor, isFirst = false }: CardProps) {
  const img = post.featuredImage?.node?.sourceUrl ?? null;
  const href = buildHref(post.slug);
  const label = post.customLabel ?? "";

  return (
    <Link
      href={href}
      className={`group flex gap-3 px-4 py-4 transition-all duration-200 hover:bg-white/70 hover:shadow-sm sm:gap-4 sm:px-5 sm:py-5 ${
        isFirst ? "rounded-t-[24px]" : ""
      }`}
    >
      <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-28">
        {img ? (
          <Image
            src={img}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 18vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {label ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-red-500">{label}</span>
        ) : null}
        <h4
          className="text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#007BFF] sm:text-base"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <p
          className="hidden text-xs text-slate-600 md:block md:line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <div className="mt-auto flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500">
          <span className={`h-1.5 w-1.5 rounded-full ${accentColor}`} />
          {formatRelativeTime(post.date)}
        </div>
      </div>
    </Link>
  );
}
