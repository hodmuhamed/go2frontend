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
  accentColor = "bg-[#FF3B3B]",
  sectionId,
  excludeIds = [],
  onPostsFetched,
}: CategorySectionProps) {
  const { loading, error, data } = useQuery(GET_CATEGORY_POSTS, {
    client,
    variables: { slug, first: 6 },
  });

  const excludeSet = new Set(excludeIds);
  const posts = ((data?.posts?.nodes ?? []) as CategoryPost[]).filter((post) => !excludeSet.has(post.id));

  useEffect(() => {
    if (onPostsFetched && posts.length > 0) {
      onPostsFetched(posts.map((post) => post.id));
    }
  }, [onPostsFetched, posts]);

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
  } else if (posts.length === 0) {
    content = <div className="text-sm text-slate-500">Još nema objava u ovoj kategoriji.</div>;
  } else {
    content = (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {posts.map((post) => (
          <CategoryGridCard key={post.id} post={post} sectionTitle={title} />
        ))}
      </div>
    );
  }

  return (
    <section
      id={sectionId}
      className="scroll-mt-28 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_24px_48px_-24px_rgba(15,23,42,0.18)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 pb-5 pt-6 sm:px-8">
        <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-slate-700">
          <span className={`h-2.5 w-2.5 rounded-sm ${accentColor}`} />
          {title}
        </span>
        <Link
          href={`/category/${slug}`}
          className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 transition hover:text-slate-700"
        >
          Sve iz sekcije
        </Link>
      </div>
      <div className="h-px bg-gradient-to-r from-slate-200 via-slate-200/60 to-transparent" />
      <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8">{content}</div>
    </section>
  );
}

type GridCardProps = {
  post: CategoryPost;
  sectionTitle: string;
};

const calculateMockCounts = (id: string) => {
  const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const comments = (hash % 35) + 3;
  const views = ((hash * 13) % 1600) + 250;
  return { comments, views };
};

function CategoryGridCard({ post, sectionTitle }: GridCardProps) {
  const img = post.featuredImage?.node?.sourceUrl ?? null;
  const href = buildHref(post.slug);
  const label = post.customLabel?.trim() || sectionTitle;
  const { comments, views } = calculateMockCounts(post.id);

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-15px_rgba(0,123,255,0.35)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8F9FB]">
        {img ? (
          <Image
            src={img}
            alt={post.title}
            fill
            sizes="(min-width: 1536px) 16vw, (min-width: 1280px) 20vw, (min-width: 1024px) 28vw, (min-width: 640px) 44vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Go2Njemačka
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#FF3B3B]">{label}</span>
        <h3
          className="line-clamp-3 text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#007BFF]"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <div className="mt-auto flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
          <span>{formatRelativeTime(post.date)}</span>
          <span className="flex items-center gap-1">
            <span aria-hidden>💬</span>
            {comments}
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden>👁️</span>
            {views}
          </span>
        </div>
      </div>
    </Link>
  );
}
