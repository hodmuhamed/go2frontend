"use client";

import { useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";

import CategorySection from "./components/CategorySection";
import client from "../lib/apolloClient";
import { GET_POSTS } from "../lib/queries/postsQuery";

type WPPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  customLabel?: string | null;
  featuredImage?: { node?: { sourceUrl?: string } };
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

function HeroPost({ post }: { post: WPPost }) {
  const img = post.featuredImage?.node?.sourceUrl;
  const href = `https://go2njemacka.de/${post.slug}`;

  return (
    <Link
      href={href}
      target="_blank"
      className="group relative flex h-full min-h-[420px] overflow-hidden rounded-[32px] bg-slate-900 text-white shadow-2xl"
    >
      {img ? (
        <Image
          src={img}
          alt={post.title}
          fill
          priority
          sizes="(min-width: 1024px) 65vw, 100vw"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.9] transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

      <div className="relative z-10 mt-auto flex flex-col gap-5 p-8 md:p-12">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200 backdrop-blur">
          Istaknuta priča
        </span>
        <h1
          className="text-3xl font-semibold leading-tight text-white drop-shadow-sm md:text-4xl"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <p
          className="max-w-2xl text-base text-white/80 md:text-lg"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
          <span>{formatDate(post.date)}</span>
          <span className="hidden h-1 w-1 rounded-full bg-white/50 md:inline-block" />
          <span className="inline-flex items-center gap-2 text-emerald-200">
            Čitaj priču <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ post, emphasis = "default" }: { post: WPPost; emphasis?: "default" | "compact" }) {
  const img = post.featuredImage?.node?.sourceUrl;
  const href = `https://go2njemacka.de/${post.slug}`;
  const isCompact = emphasis === "compact";

  return (
    <Link
      href={href}
      target="_blank"
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isCompact ? "md:flex-row md:items-stretch" : ""
      }`}
    >
      <div className={`overflow-hidden ${isCompact ? "md:w-40 md:flex-shrink-0" : "w-full"}`}>
        {img ? (
          <Image
            src={img}
            alt={post.title}
            width={640}
            height={360}
            sizes={isCompact ? "(min-width: 768px) 10rem, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className={`h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isCompact ? "md:h-full" : ""
            }`}
          />
        ) : (
          <div className="h-40 w-full bg-gradient-to-br from-slate-100 via-slate-50 to-white" />
        )}
      </div>
      <div className={`flex flex-col gap-3 ${isCompact ? "flex-1 p-5 md:p-6" : "p-6"}`}>
        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600/80">Go2Njemačka Blog</span>
        <h3
          className={`text-slate-900 transition-colors group-hover:text-emerald-700 ${
            isCompact ? "text-lg font-semibold" : "text-xl font-semibold"
          }`}
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        {!isCompact && (
          <p
            className="line-clamp-3 text-sm text-slate-600"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}
        <span className="mt-auto text-xs font-medium text-slate-500">{formatDate(post.date)}</span>
      </div>
    </Link>
  );
}

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTS, { client });

  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <p className="text-lg text-slate-500">Učitavam sadržaj…</p>
      </div>
    );

  if (error)
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <p className="text-lg text-red-600">Greška: {error.message}</p>
      </div>
    );

  const posts: WPPost[] = data?.posts?.nodes ?? [];
  if (posts.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <p className="text-slate-500">Nema objava.</p>
      </div>
    );
  }

  const [hero, ...rest] = posts;
  const highlights = rest.slice(0, 3);
  const gallery = rest.slice(3);

  return (
    <div className="scroll-smooth bg-[#f3f6fb] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900">
            Go2Njemačka Blog
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 md:flex">
            <a href="#home" className="transition hover:text-emerald-600">
              Početna
            </a>
            <a href="#dolazak" className="transition hover:text-emerald-600">
              Blog
            </a>
            <a href="#about" className="transition hover:text-emerald-600">
              O nama
            </a>
            <a href="#contact" className="transition hover:text-emerald-600">
              Kontakt
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-12 px-4 pb-16 pt-12 sm:px-6">
        <section id="home" className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <HeroPost post={hero} />

          {highlights.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold uppercase tracking-[0.25em] text-slate-700">U fokusu</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600/80">Najčitanije</span>
              </div>
              <div className="flex flex-col gap-4">
                {highlights.map((post) => (
                  <ArticleCard key={post.id} post={post} emphasis="compact" />
                ))}
              </div>
            </div>
          )}
        </section>

        <CategorySection title="Dolazak u Njemačku" slug="dolazak-u-njemacku" sectionId="dolazak" />

        <CategorySection title="Savjeti" slug="savjeti" sectionId="savjeti" accentColor="bg-sky-500" />

        {gallery.length > 0 && (
          <section id="blog" className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Najnovije priče</h2>
                <p className="text-sm text-slate-600">
                  Aktualne informacije i savjeti za život i rad u Njemačkoj.
                </p>
              </div>
              <a
                href="https://go2njemacka.de"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                Sve objave
                <span aria-hidden>→</span>
              </a>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        <section
          id="about"
          className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 shadow-md md:p-12"
        >
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                O nama
              </span>
              <h2 className="text-3xl font-semibold text-slate-900">Priče, iskustva i savjeti iz prve ruke</h2>
              <p className="text-base text-slate-600">
                Go2Njemačka Blog okuplja stručnjake, mentore i zajednicu koja dijeli stvarne priče o preseljenju,
                zapošljavanju i životu u Njemačkoj. Naš cilj je da vam ponudimo provjerene informacije i inspiraciju za
                naredni korak.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-white to-emerald-50 p-6">
              <div className="space-y-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">Šta možete očekivati?</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Vodiče i checkliste za birokratske procese.</li>
                  <li>Intervjue sa našom zajednicom i stručnjacima.</li>
                  <li>Aktualne vijesti i trendove sa njemačkog tržišta rada.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="rounded-[28px] border border-emerald-100 bg-gradient-to-r from-emerald-600 to-emerald-500 p-8 text-white shadow-xl md:p-12"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <h2 className="text-3xl font-semibold">Povežimo se</h2>
              <p className="text-sm text-emerald-50">
                Treba vam personalizirana podrška ili imate priču koju želite podijeliti? Javite nam se i postanite dio
                zajednice Go2Njemačka.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://go2njemacka.de/kontakt"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-md transition hover:shadow-lg"
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
      </main>

      <footer className="border-t border-slate-200 bg-white/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Go2Njemačka.de — Sva prava zadržana.</p>
          <div className="flex items-center gap-5">
            <a href="https://go2njemacka.de/o-nama" target="_blank" className="transition hover:text-slate-700">
              O nama
            </a>
            <a href="https://go2njemacka.de/kontakt" target="_blank" className="transition hover:text-slate-700">
              Kontakt
            </a>
            <a href="https://go2njemacka.de" target="_blank" className="transition hover:text-slate-700">
              Posjeti Go2Njemačka
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
