"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";

import CategorySection from "./components/CategorySection";
import Sidebar, { SidebarPost } from "./components/Sidebar";
import client from "../lib/apolloClient";
import { GET_POSTS } from "../lib/queries/postsQuery";

type WPPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  commentCount?: number | null;
  featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
};

const formatDate = (date: string) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("bs-BA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTS, { client });
  const [categoryRegistry, setCategoryRegistry] = useState<Record<string, string[]>>({});

  if (loading)
    return (
      <div className="grid min-h-[60vh] place-items-center text-lg text-slate-500">Učitavam sadržaj…</div>
    );

  if (error)
    return (
      <div className="grid min-h-[60vh] place-items-center text-lg text-red-600">Greška: {error.message}</div>
    );

  const posts: WPPost[] = (data?.posts?.nodes ?? []) as WPPost[];
  const hero = posts[0] ?? null;

  if (!hero) {
    return <div className="grid min-h-[60vh] place-items-center text-slate-500">Nema objava.</div>;
  }

  const highlights = posts.slice(1, 4);

  const baseUsedIds = [
    hero.id,
    ...highlights.map((post) => post.id),
  ];

  const registerCategoryPosts = (slug: string, ids: string[]) => {
    setCategoryRegistry((prev) => {
      const previous = prev[slug] ?? [];
      if (previous.length === ids.length && previous.every((id, index) => id === ids[index])) {
        return prev;
      }

      return { ...prev, [slug]: ids };
    });
  };

  const excludeForSection = (slug: string) => {
    const ids = new Set<string>(baseUsedIds);
    Object.entries(categoryRegistry).forEach(([key, value]) => {
      if (key !== slug) {
        value.forEach((id) => ids.add(id));
      }
    });
    return Array.from(ids);
  };

  const allUsedIds = (() => {
    const ids = new Set<string>(baseUsedIds);
    Object.values(categoryRegistry).forEach((list) => list.forEach((id) => ids.add(id)));
    return ids;
  })();

  const latestPosts = posts.filter((post) => !allUsedIds.has(post.id));

  const sidebarPosts: SidebarPost[] = (() => {
    const sorted = [...posts].sort((a, b) => (b.commentCount ?? 0) - (a.commentCount ?? 0));
    const highest = sorted[0]?.commentCount ?? 0;

    if (highest === 0) {
      return [...posts]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    }

    return sorted.slice(0, 5);
  })();

  return (
    <div className="bg-[#F8F9FB]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2.25fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-10">
            <section id="home" className="grid gap-8 rounded-[32px] bg-white p-6 shadow-md sm:p-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <HeroPost post={hero} />
              <div className="flex flex-col gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">U fokusu</h2>
                <div className="flex flex-col gap-3">
                  {highlights.map((post) => (
                    <HighlightCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </section>

            <CategorySection
              title="Dolazak u Njemačku"
              slug="dolazak-u-njemacku"
              sectionId="dolazak"
              accentColor="bg-[#FF5C5C]"
              excludeIds={excludeForSection("dolazak-u-njemacku")}
              onPostsFetched={(ids) => registerCategoryPosts("dolazak-u-njemacku", ids)}
            />

            <CategorySection
              title="Savjeti"
              slug="savjeti"
              sectionId="savjeti"
              accentColor="bg-[#007BFF]"
              excludeIds={excludeForSection("savjeti")}
              onPostsFetched={(ids) => registerCategoryPosts("savjeti", ids)}
            />

            {latestPosts.length > 0 && (
              <section id="blog" className="scroll-mt-28 space-y-6 rounded-[32px] bg-white p-6 shadow-md sm:p-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold uppercase tracking-[0.3em] text-slate-700">Najnovije priče</h2>
                    <p className="text-sm text-slate-500">Aktualne informacije i savjeti za život i rad u Njemačkoj.</p>
                  </div>
                  <a
                    href="https://go2njemacka.de"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#007BFF]/20 px-4 py-2 text-sm font-semibold text-[#007BFF] transition hover:border-[#007BFF]/40 hover:bg-[#007BFF]/10"
                  >
                    Sve objave
                    <span aria-hidden>→</span>
                  </a>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {latestPosts.map((post) => (
                    <LatestCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            <AboutSection />
            <ContactSection />
          </div>

          <Sidebar posts={sidebarPosts} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

type PostCardProps = {
  post: WPPost;
};

function HeroPost({ post }: PostCardProps) {
  const img = post.featuredImage?.node?.sourceUrl;
  const href = `/${post.slug}`;

  return (
    <Link
      href={href}
      className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-[28px] sm:min-h-[280px] lg:min-h-[300px]"
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
      ) : (
        <div className="absolute inset-0 rounded-[28px] bg-slate-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent" />

      <div className="relative z-10 mt-auto flex flex-col gap-2 p-6 text-white sm:p-8">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#FF5C5C] backdrop-blur">
          Istaknuta priča
        </span>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1
              className="inline text-3xl font-semibold leading-snug font-heading sm:text-4xl"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
            <span className="text-sm text-white/70">{formatDate(post.date)}</span>
          </div>
          <p
            className="max-w-2xl text-sm text-white/80 sm:text-base lg:line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        </div>
      </div>
    </Link>
  );
}

function HighlightCard({ post }: PostCardProps) {
  const img = post.featuredImage?.node?.sourceUrl;
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
          className="line-clamp-3 text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#007BFF]"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <span className="text-xs text-slate-500">{formatDate(post.date)}</span>
      </div>
    </Link>
  );
}

function LatestCard({ post }: PostCardProps) {
  const img = post.featuredImage?.node?.sourceUrl;
  const href = `/${post.slug}`;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {img ? (
          <Image
            src={img}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-slate-100" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3
          className="line-clamp-3 text-lg font-semibold text-slate-800 transition-colors group-hover:text-[#007BFF]"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <div className="mt-auto text-xs font-medium uppercase tracking-[0.25em] text-slate-500">{formatDate(post.date)}</div>
      </div>
    </Link>
  );
}

function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-28 rounded-[32px] border border-slate-200 bg-white p-8 shadow-md sm:p-10"
    >
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <span className="inline-flex w-fit items-center rounded-full bg-[#007BFF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#007BFF]">
            O nama
          </span>
          <h2 className="text-3xl font-semibold text-slate-900 font-heading">Priče, iskustva i savjeti iz prve ruke</h2>
          <p className="text-sm text-slate-600 sm:text-base">
            Go2Njemačka Blog okuplja stručnjake, mentore i zajednicu koja dijeli stvarne priče o preseljenju, zapošljavanju i životu u Njemačkoj.
            Naš cilj je da vam ponudimo provjerene informacije i inspiraciju za naredni korak.
          </p>
        </div>
        <div className="space-y-4 rounded-[28px] bg-[#F8F9FB] p-6 shadow-inner">
          <p className="text-sm font-semibold text-slate-800">Šta možete očekivati?</p>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#007BFF]" />
              Vodiče i checkliste za birokratske procese.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#FF5C5C]" />
              Intervjue sa našom zajednicom i stručnjacima.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Aktualne vijesti i trendove sa njemačkog tržišta rada.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-28 rounded-[32px] bg-gradient-to-r from-[#007BFF] to-[#0056b3] p-8 text-white shadow-lg sm:p-10"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-3">
          <h2 className="text-3xl font-semibold font-heading">Povežimo se</h2>
          <p className="text-sm text-white/80">
            Treba vam personalizirana podrška ili imate priču koju želite podijeliti? Javite nam se i postanite dio zajednice Go2Njemačka.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://go2njemacka.de/kontakt"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#007BFF] shadow-md transition hover:-translate-y-[1px] hover:shadow-lg"
          >
            Kontaktiraj tim
          </a>
          <a
            href="mailto:info@go2njemacka.de"
            className="inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            info@go2njemacka.de
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Go2Njemačka.de — Sva prava zadržana.</p>
        <div className="flex items-center gap-5">
          <a href="https://go2njemacka.de/o-nama" target="_blank" rel="noreferrer" className="transition hover:text-[#007BFF]">
            O nama
          </a>
          <a href="https://go2njemacka.de/kontakt" target="_blank" rel="noreferrer" className="transition hover:text-[#007BFF]">
            Kontakt
          </a>
          <a href="https://go2njemacka.de" target="_blank" rel="noreferrer" className="transition hover:text-[#007BFF]">
            Posjeti Go2Njemačka
          </a>
        </div>
      </div>
    </footer>
  );
}
