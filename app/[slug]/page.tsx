import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar, { SidebarPost } from "../components/Sidebar";
import client from "../../lib/apolloClient";
import { GET_POST_BY_SLUG } from "../../lib/queries/postBySlugQuery";
import { GET_RELATED_POSTS } from "../../lib/queries/relatedPostsQuery";
import { GET_POSTS } from "../../lib/queries/postsQuery";
import { GET_CATEGORY_ARCHIVE } from "../../lib/queries/categoryArchiveQuery";

type PageProps = {
  params: { slug: string };
  searchParams?: { after?: string };
};

type PostData = {
  post: {
    id: string;
    title: string;
    slug: string;
    date: string;
    content: string;
    excerpt: string;
    commentCount?: number | null;
    author?: { node?: { name?: string | null } | null } | null;
    categories?: { nodes?: Array<{ id: string; name: string; slug: string }> };
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
  } | null;
};

type RelatedData = {
  posts: {
    nodes: Array<{
      id: string;
      title: string;
      slug: string;
      date: string;
      excerpt: string;
      featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    }>;
  } | null;
};

type CategoryArchiveData = {
  category: { id: string; name: string; description?: string | null } | null;
  posts: {
    nodes: Array<{
      id: string;
      title: string;
      slug: string;
      date: string;
      excerpt: string;
      featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    }>;
    pageInfo: { endCursor?: string | null; hasNextPage: boolean };
  } | null;
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

export default async function PostPage({ params, searchParams }: PageProps) {
  const slug = params.slug;
  const after = typeof searchParams?.after === "string" ? searchParams.after : undefined;
  const [{ data }, popular] = await Promise.all([
    client.query<PostData>({
      query: GET_POST_BY_SLUG,
      variables: { slug },
      fetchPolicy: "no-cache",
    }),
    client.query({ query: GET_POSTS, fetchPolicy: "no-cache" }),
  ]);

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

  if (!data.post) {
    const { data: categoryData } = await client.query<CategoryArchiveData>({
      query: GET_CATEGORY_ARCHIVE,
      variables: { slug, after },
      fetchPolicy: "no-cache",
    });

    if (!categoryData.category) {
      notFound();
    }

    const posts = categoryData.posts?.nodes ?? [];
    const pageInfo = categoryData.posts?.pageInfo;

    return (
      <div className="bg-[#F8F9FB] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-10">
            <header className="rounded-[32px] bg-white p-6 shadow-md sm:p-10">
              <span className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5C5C]">Kategorija</span>
              <h1 className="mt-3 text-4xl font-semibold font-heading text-slate-900">{categoryData.category.name}</h1>
              <div className="mt-4 h-1 w-24 rounded-full bg-[#007BFF]" />
              {categoryData.category.description ? (
                <p
                  className="mt-4 max-w-3xl text-sm text-slate-600 sm:text-base"
                  dangerouslySetInnerHTML={{ __html: categoryData.category.description }}
                />
              ) : null}
            </header>

            <section className="rounded-[32px] bg-white p-6 shadow-md sm:p-10">
              {posts.length === 0 ? (
                <p className="text-slate-500">Još nema objava u ovoj kategoriji.</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {posts.map((postItem) => (
                    <ArchiveCard key={postItem.id} post={postItem} />
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

  const post = data.post;
  const canonicalUrl = `https://go2njemacka.de/${post.slug}`;
  const primaryCategory = post.categories?.nodes?.[0];

  const related = primaryCategory
    ? await client
        .query<RelatedData>({
          query: GET_RELATED_POSTS,
          variables: { slug: primaryCategory.slug, exclude: [post.id], first: 3 },
          fetchPolicy: "no-cache",
        })
        .then((response) => response.data.posts?.nodes ?? [])
    : [];

  return (
    <div className="bg-[#F8F9FB] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <article className="flex flex-col gap-10">
          <header className="rounded-[32px] bg-white p-6 shadow-md sm:p-10">
            <Link
              href={primaryCategory ? `/category/${primaryCategory.slug}` : "/"}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF5C5C]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#FF5C5C] transition hover:bg-[#FF5C5C]/20"
            >
              {primaryCategory ? primaryCategory.name : "Blog"}
            </Link>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 font-heading" dangerouslySetInnerHTML={{ __html: post.title }} />
            <div className="mt-4 h-1 w-24 rounded-full bg-[#007BFF]" />
            <div className="mt-4 text-sm text-slate-500">
              {post.author?.node?.name ? <span className="font-medium text-slate-700">{post.author.node.name}</span> : null}
              {post.author?.node?.name ? <span className="mx-2 text-slate-400">•</span> : null}
              <span>{formatDate(post.date)}</span>
            </div>
          </header>

          {post.featuredImage?.node?.sourceUrl ? (
            <div className="overflow-hidden rounded-[32px] bg-white shadow-md">
              <div className="relative h-80 w-full sm:h-[420px]">
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="rounded-[32px] object-cover"
                />
              </div>
            </div>
          ) : null}

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-md sm:p-10">
            <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.content }} />

            <ShareSection url={canonicalUrl} title={post.title} />
          </div>

          {related.length > 0 && (
            <section className="rounded-[32px] bg-white p-6 shadow-md sm:p-10">
              <h2 className="text-2xl font-semibold uppercase tracking-[0.3em] text-slate-700">Povezane priče</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {related.map((relatedPost) => (
                  <RelatedCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </section>
          )}
        </article>

        <Sidebar posts={sidebarPosts} />
      </div>
    </div>
  );
}

type ArchiveCardProps = {
  post: {
    id: string;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
  };
};

function ArchiveCard({ post }: ArchiveCardProps) {
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

type ShareSectionProps = {
  url: string;
  title: string;
};

function ShareSection({ url, title }: ShareSectionProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title.replace(/<[^>]+>/g, ""));

  const links = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M13.5 22v-8.5h2.8l.4-3.3h-3.2V8.2c0-.9.2-1.5 1.5-1.5h1.6V3.8c-.3 0-1.2-.1-2.2-.1-2.1 0-3.6 1.3-3.6 3.8v2.1H8.9v3.3h2.9V22h1.7z" />
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 2a9.9 9.9 0 0 0-8.6 14.8L2 22l5.4-1.4A9.9 9.9 0 1 0 12 2zm5.7 14.1c-.2.6-1.1 1.1-1.6 1.2-.4.1-.9.2-1.5.1-.3 0-.8.1-2.8-.6-2.3-.9-3.8-3.2-3.9-3.3-.1-.1-.9-1.2-.9-2.3s.6-1.6.8-1.9c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.5.2.6.8 2 1 2.2.1.2.1.4 0 .6-.1.2-.2.4-.4.6-.2.2-.3.3-.1.6.2.3.9 1.6 2.1 2.6 1.4 1.2 2.6 1.6 3 .1.3-.5.5-.8.8-.7.3 0 1.6.8 1.9 1 .1.1.2.1.2.3a3.7 3.7 0 0 1-.4 1.1z" />
        </svg>
      ),
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M20.9 3H17l-4.1 5.7L9 3H3.2l6.4 9.3L3 21h4l4.5-6.3L16 21h5l-6.6-9.5L20.9 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mt-10 border-t border-slate-200 pt-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Podijeli članak</h3>
      <div className="mt-4 flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target="_blank"
            aria-label={`Podijeli na ${link.label}`}
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 transition hover:border-[#007BFF] hover:text-[#007BFF]"
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

type RelatedCardProps = {
  post: {
    id: string;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
  };
};

function RelatedCard({ post }: RelatedCardProps) {
  const href = `/${post.slug}`;
  const img = post.featuredImage?.node?.sourceUrl ?? null;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-40 w-full overflow-hidden">
        {img ? (
          <Image
            src={img}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 18vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-slate-100" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3
          className="text-base font-semibold text-slate-800 transition-colors group-hover:text-[#007BFF]"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <p className="line-clamp-3 text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        <span className="mt-auto text-xs font-medium uppercase tracking-[0.25em] text-slate-500">{formatDate(post.date)}</span>
      </div>
    </Link>
  );
}
