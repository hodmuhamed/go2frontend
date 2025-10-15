"use client";

import { useQuery } from "@apollo/client";
import client from "../lib/apolloClient";
import { GET_POSTS } from "../lib/queries/postsQuery";
import Link from "next/link";

type WPPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage?: { node?: { sourceUrl?: string } };
};

function Card({ post, layout = "default" }: { post: WPPost; layout?: "hero" | "featured" | "default" }) {
  const img = post.featuredImage?.node?.sourceUrl;
  const href = `https://go2njemacka.de/${post.slug}`;

  const base =
    "group relative overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5";
  const imgClass =
    layout === "hero"
      ? "h-[360px] md:h-[420px] w-full object-cover"
      : layout === "featured"
      ? "h-56 w-full object-cover"
      : "h-44 w-full object-cover";

  return (
    <Link href={href} target="_blank" className={base}>
      <div className="relative">
        {img ? (
          <img src={img} alt={post.title} className={`${imgClass} transition-transform duration-500 group-hover:scale-105`} />
        ) : (
          <div className={`${imgClass} bg-gradient-to-br from-gray-100 to-gray-200`} />
        )}
        {layout === "hero" && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        )}
      </div>

      <div
        className={
          layout === "hero"
            ? "absolute inset-x-0 bottom-0 p-6 md:p-8 text-white"
            : "p-5"
        }
      >
        <h3
          className={
            layout === "hero"
              ? "text-2xl md:text-3xl font-extrabold leading-snug drop-shadow"
              : layout === "featured"
              ? "text-lg font-semibold text-gray-900"
              : "text-base font-semibold text-gray-900"
          }
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <div
          className={
            layout === "hero"
              ? "mt-3 hidden md:block text-white/90"
              : "mt-2 line-clamp-3 text-gray-600 text-sm"
          }
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <span
          className={
            layout === "hero"
              ? "mt-4 inline-flex items-center gap-1 text-emerald-300 font-semibold"
              : "mt-3 inline-flex items-center gap-1 text-emerald-700 font-semibold"
          }
        >
          Čitaj više →
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTS, { client });

  if (loading)
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-gray-500 text-lg animate-pulse">Učitavam sadržaj…</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-red-600 text-lg">Greška: {error.message}</p>
      </div>
    );

  const posts: WPPost[] = data?.posts?.nodes ?? [];
  if (posts.length === 0) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-gray-500">Nema objava.</p>
      </div>
    );
  }

  const [hero, ...rest] = posts;
  const featured = rest.slice(0, 4);
  const latest = rest.slice(4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-emerald-700 font-extrabold text-xl">
            Go2Njemačka Blog
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            <a href="/" className="hover:text-emerald-700">Početna</a>
            <a href="https://go2njemacka.de" target="_blank" className="hover:text-emerald-700">Posjeti sajt</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 space-y-12">
        <section>
          <Card post={hero} layout="hero" />
        </section>

        {featured.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Izdvojeno</h2>
              <a
                href="https://go2njemacka.de"
                target="_blank"
                className="text-emerald-700 hover:underline font-medium"
              >
                Sve objave →
              </a>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <Card key={p.id} post={p} layout="featured" />
              ))}
            </div>
          </section>
        )}

        {latest.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Najnovije</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((p) => (
                <Card key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-12 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Go2Njemačka.de — Sva prava zadržana.</p>
          <div className="flex items-center gap-5">
            <a href="https://go2njemacka.de/kontakt" target="_blank" className="hover:text-gray-700">Kontakt</a>
            <a href="https://go2njemacka.de/o-nama" target="_blank" className="hover:text-gray-700">O nama</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

