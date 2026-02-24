import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "../../components";
import { getPostBySlug, getAllPostSlugs } from "../../lib/wordpress";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();

  // Next.js bug: returning [] with output:'export' throws
  // "missing generateStaticParams()" — return a placeholder slug
  // that the page component handles via notFound()
  if (slugs.length === 0) {
    return [{ slug: "_" }];
  }

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const excerpt = post.excerpt.replace(/<[^>]*>/g, "").trim();

  return {
    title: post.title,
    description: excerpt || `Read "${post.title}" on Power to the People MKE.`,
    openGraph: {
      title: `${post.title} | Power to the People MKE`,
      description: excerpt || `Read "${post.title}" on Power to the People MKE.`,
      ...(post.featuredImage && {
        images: [{ url: post.featuredImage.node.sourceUrl }],
      }),
    },
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />

      <main id="main-content" className="bg-cream min-h-screen">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <header className="mb-12 text-center">
            <time
              className="text-sm text-navy/70 uppercase tracking-wide font-bold"
              dateTime={post.date}
            >
              {formatDate(post.date)}
            </time>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-spectral font-bold text-navy leading-tight">
              {post.title}
            </h1>
          </header>

          {post.featuredImage && (
            <div className="mb-12 -mx-4 sm:mx-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || post.title}
                className="w-full rounded-lg"
              />
            </div>
          )}

          <div
            className="prose prose-lg prose-navy max-w-none
              prose-headings:font-spectral prose-headings:text-navy
              prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-p:text-navy/80 prose-p:leading-relaxed
              prose-li:text-navy/80
              prose-strong:text-navy prose-strong:font-semibold
              prose-a:text-navy prose-a:underline prose-a:decoration-coral hover:prose-a:text-coral
              prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <nav className="mt-16 pt-8 border-t border-navy/10" aria-label="Back to news">
            <Link
              href="/news"
              className="inline-flex items-center text-navy font-bold hover:text-coral transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to News
            </Link>
          </nav>
        </article>
      </main>

      <Footer />
    </>
  );
}
