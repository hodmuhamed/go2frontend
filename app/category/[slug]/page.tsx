import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar, { SidebarPost } from "../../components/Sidebar";
import client from "../../../lib/apolloClient";
import { GET_CATEGORY_ARCHIVE } from "../../../lib/queries/categoryArchiveQuery";
import { GET_POSTS } from "../../../lib/queries/postsQuery";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ after?: string }>;
}

type CategoryPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
};

type CategoryData = {
  category: { id: string; name: string; description?: string | null } | null;
  posts: {
    nodes: CategoryPost[];
    pageInfo: { endCursor?: string | null; hasNextPage: boolean };
  } | null;
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

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearch = searchParams ? await searchParams : {};
  const after = typeof resolvedSearch.after === "string" ? resolvedSearch.after : undefined;

  const [{ data }, popular] = await Promise.all([
    client.query<CategoryData>({
      query: GET_CATEGORY_ARCHIVE,
      variables: { slug, after },
      fetchPolicy: "no-cache",
    }),
    client.query({ query: GET_POSTS, fetchPolicy: "no-cache" }),
  ]);

  if (!data?.category) {
    notFound();
  }

  const posts = data.posts?.nodes ?? [];
  const pageInfo = data.posts?.pageInfo;

  const sidebarSource = (popular.data?.posts?.nodes ?? []) as SidebarPost[];
  const sortedSidebar = [...sidebarSource].sort((a, b) => (b.commentCount ?? 0) - (a.commentCount ?? 0));
  const sidebarPosts = (() => {
    const top = sortedSidebar.slice(0, 5);
    if ((top[0]?.commentCount ?? 0) > 0) {
      return top;
    }
    return [...sidebarSource]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  })();

  return (
    <div className="bg-[#F8F9FB] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-10">
          <header className="rounded-[32px] bg-white p-6 shadow-md sm:p-10">
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5C5C]">Kategorija</span>
            <h1 className="mt-3 text-4xl font-semibold font-heading text-slate-900">{data.category.name}</h1>
            <div className="mt-4 h-1 w-24 rounded-full bg-[#007BFF]" />
            {data.category.description ? (
              <p className="mt-4 max-w-3xl text-sm text-slate-600 sm:text-base" dangerouslySetInnerHTML={{ __html: data.category.description }} />
            ) : null}
          </header>

          <section className="rounded-[32px] bg-white p-6 shadow-md sm:p-10">
            {posts.length === 0 ? (
              <p className="text-slate-500">Još nema objava u ovoj kategoriji.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {posts.map((post) => (
                  <CategoryCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {pageInfo?.hasNextPage && pageInfo.endCursor ? (
              <div className="mt-8 flex justify-center">
                <Link
                  href={`?after=${encodeURIComponent(pageInfo.endCursor)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#007BFF]/20 px-5 py-2.5 text-sm font-semibold text-[#007BFF] transition hover:border-[#007BFF]/40 hover:bg-[#007BFF]/10"
                >
                  Učitaj još
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ) : null}
          </section>
        </div>

        <Sidebar posts={sidebarPosts} />
      </div>
    </div>
  );
}

type CardProps = {
  post: CategoryPost;
};

function CategoryCard({ post }: CardProps) {
  const href = `/${post.slug}`;
  const img = post.featuredImage?.node?.sourceUrl ?? null;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden">
        {img ? (
          <Image
            src={img}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-slate-100" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3
          className="line-clamp-2 text-lg font-semibold text-slate-800 transition-colors group-hover:text-[#007BFF]"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <span className="mt-auto text-xs font-medium uppercase tracking-[0.25em] text-slate-500">{formatDate(post.date)}</span>
      </div>
    </Link>
  );
}
