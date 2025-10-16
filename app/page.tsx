"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";

import ArticleCard from "./components/ArticleCard";
import CategorySection from "./components/CategorySection";
import FeaturedSection from "./components/FeaturedSection";
import Footer from "./components/Footer";
import Sidebar, { SidebarPost } from "./components/Sidebar";
import client from "../lib/apolloClient";
import { GET_POSTS } from "../lib/queries/postsQuery";

export type WPPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  commentCount?: number | null;
  categories?: { nodes?: Array<{ name?: string | null } | null> | null } | null;
  featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
};

type SectionConfig = {
  title: string;
  slug: string;
  accentColor?: string;
};

const CATEGORY_SECTIONS: SectionConfig[] = [
  { title: "Savjeti", slug: "savjeti", accentColor: "bg-[#FF5C5C]" },
  { title: "Dokumenti", slug: "dokumenti", accentColor: "bg-[#007BFF]" },
  { title: "Porodica i život", slug: "porodica-i-zivot", accentColor: "bg-[#20a4f3]" },
];

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTS, { client });
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [categoryRegistry, setCategoryRegistry] = useState<Record<string, string[]>>({});

  const posts = useMemo(
    () => ((data?.posts?.nodes ?? []) as WPPost[]),
    [data?.posts?.nodes]
  );
  const hero = posts[0] ?? null;
  const highlights = posts.slice(1, 5);

  const baseUsed = useMemo(() => new Set<string>(featuredIds), [featuredIds]);

  const registerCategoryPosts = (slug: string, ids: string[]) => {
    setCategoryRegistry((prev) => {
      const previous = prev[slug] ?? [];
      if (previous.length === ids.length && previous.every((id, index) => id === ids[index])) {
        return prev;
      }

      return { ...prev, [slug]: ids };
    });
  };

  const usedAcrossSections = useMemo(() => {
    const ids = new Set<string>(baseUsed);
    Object.values(categoryRegistry).forEach((list) => list.forEach((id) => ids.add(id)));
    return ids;
  }, [baseUsed, categoryRegistry]);

  const latestPosts = useMemo(() => {
    const pool = posts.filter((post) => !usedAcrossSections.has(post.id));
    return pool.slice(0, 6);
  }, [posts, usedAcrossSections]);

  const usedWithLatest = useMemo(() => {
    const ids = new Set<string>(usedAcrossSections);
    latestPosts.forEach((post) => ids.add(post.id));
    return ids;
  }, [latestPosts, usedAcrossSections]);

  const popularPosts = useMemo(() => {
    const pool = posts.filter((post) => !usedWithLatest.has(post.id));
    const sortedByComments = [...pool].sort((a, b) => (b.commentCount ?? 0) - (a.commentCount ?? 0));
    const topCommentCount = sortedByComments[0]?.commentCount ?? 0;

    if (!topCommentCount) {
      return [...pool]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6);
    }

    return sortedByComments.slice(0, 6);
  }, [posts, usedWithLatest]);

  const getExcludeIds = (slug: string) => {
    const ids = new Set<string>(baseUsed);
    latestPosts.forEach((post) => ids.add(post.id));
    popularPosts.forEach((post) => ids.add(post.id));
    Object.entries(categoryRegistry).forEach(([key, value]) => {
      if (key !== slug) {
        value.forEach((id) => ids.add(id));
      }
    });
    return Array.from(ids);
  };

  const sidebarPosts: SidebarPost[] = useMemo(() => {
    const sorted = [...posts].sort((a, b) => (b.commentCount ?? 0) - (a.commentCount ?? 0));
    const highest = sorted[0]?.commentCount ?? 0;

    if (highest === 0) {
      return [...posts]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    }

    return sorted.slice(0, 5);
  }, [posts]);

  if (loading) {
    return <div className="grid min-h-[60vh] place-items-center text-lg text-slate-500">Učitavam sadržaj…</div>;
  }

  if (error) {
    return <div className="grid min-h-[60vh] place-items-center text-lg text-red-600">Greška: {error.message}</div>;
  }

  if (!hero) {
    return <div className="grid min-h-[60vh] place-items-center text-slate-500">Nema objava.</div>;
  }

  return (
    <div className="bg-[#F8F9FB]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-10">
            <FeaturedSection
              hero={hero}
              highlights={highlights}
              onPostsUsed={setFeaturedIds}
            />

            <SectionBlock title="Najnovije" description="Šta se trenutno dešava u zajednici Go2Njemačka.">
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {latestPosts.map((post) => (
                  <ArticleCard
                    key={post.id}
                    post={{
                      ...post,
                      categoryName: post.categories?.nodes?.[0]?.name ?? undefined,
                    }}
                  />
                ))}
              </div>
            </SectionBlock>

            {popularPosts.length > 0 && (
              <SectionBlock title="Popularno" description="Teme koje najviše privlače pažnju naših čitatelja.">
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {popularPosts.map((post) => (
                    <ArticleCard
                      key={post.id}
                      post={{
                        ...post,
                        categoryName: post.categories?.nodes?.[0]?.name ?? undefined,
                      }}
                    />
                  ))}
                </div>
              </SectionBlock>
            )}

            {CATEGORY_SECTIONS.map((section) => (
              <CategorySection
                key={section.slug}
                title={section.title}
                slug={section.slug}
                sectionId={section.slug}
                accentColor={section.accentColor}
                excludeIds={getExcludeIds(section.slug)}
                onPostsFetched={(ids) => registerCategoryPosts(section.slug, ids)}
              />
            ))}
          </div>

          <Sidebar posts={sidebarPosts} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

type SectionBlockProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

function SectionBlock({ title, description, children }: SectionBlockProps) {
  return (
    <section className="scroll-mt-28 space-y-6 rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-md sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#FF3B3B]">Go2Njemačka</span>
          <h2 className="text-2xl font-heading font-semibold text-slate-900">{title}</h2>
          {description ? <p className="text-sm text-slate-600">{description}</p> : null}
        </div>
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#FF3B3B] via-[#007BFF] to-[#0056b3]" />
      </div>
      {children}
    </section>
  );
}
