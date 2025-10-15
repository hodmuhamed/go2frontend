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

type CategoryPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  customLabel?: string | null;
  featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
};

export default function CategorySection({ title, slug, accentColor = "bg-red-500", sectionId }: CategorySectionProps) {
  const { loading, error, data } = useQuery(GET_CATEGORY_POSTS, {
    client,
    variables: { slug, first: 5 },
  });

  const posts = (data?.posts?.nodes ?? []) as CategoryPost[];

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
    content = (
      <div className="grid gap-6 lg:grid-cols-[1.65fr,1fr]">
        <CategoryHeroCard post={hero} accentColor={accentColor} />
        <div className="flex flex-col divide-y divide-slate-200">
          {rest.map((post) => (
            <CategoryListCard key={post.id} post={post} accentColor={accentColor} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section
      id={sectionId}
      className="scroll-mt-28 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
        <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-800">
          <span className={`h-2.5 w-2.5 rounded-sm ${accentColor}`} />
          {title}
        </span>
        <Link
          href={`https://go2njemacka.de/kategorija/${slug}`}
          target="_blank"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 transition hover:text-slate-600"
        >
          Sve iz sekcije
        </Link>
      </div>
      <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
        {content}
      </div>
    </section>
  );
}

type CardProps = {
  post: CategoryPost;
  accentColor: string;
};

function CategoryHeroCard({ post, accentColor }: CardProps) {
  const img = post.featuredImage?.node?.sourceUrl ?? null;
  const href = buildHref(post.slug);
  const label = post.customLabel ?? "";

  return (
    <Link
      href={href}
      target="_blank"
      className="group flex flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {img ? (
          <Image
            src={img}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
        {label ? (
          <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-red-500">{label}</span>
        ) : null}
        <h3
          className="text-2xl font-semibold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <p
          className="line-clamp-3 text-sm text-slate-600"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <div className="mt-auto flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
          <span className={`h-1.5 w-1.5 rounded-full ${accentColor}`} />
          {formatRelativeTime(post.date)}
        </div>
      </div>
    </Link>
  );
}

function CategoryListCard({ post, accentColor }: CardProps) {
  const img = post.featuredImage?.node?.sourceUrl ?? null;
  const href = buildHref(post.slug);
  const label = post.customLabel ?? "";

  return (
    <Link
      href={href}
      target="_blank"
      className="group flex flex-col gap-4 py-5 first:pt-0 last:pb-0 lg:flex-row lg:items-center"
    >
      <div className="relative h-24 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-28 lg:h-24 lg:w-32">
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
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-500">{label}</span>
        ) : null}
        <h4
          className="text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600 sm:text-lg"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <p
          className="hidden text-sm text-slate-600 md:line-clamp-2 md:block"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <div className="mt-auto flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500">
          <span className={`h-1.5 w-1.5 rounded-full ${accentColor}`} />
          {formatRelativeTime(post.date)}
        </div>
      </div>
    </Link>
  );
}
