import type { Metadata } from "next";
import { AnimateOnScroll, Header, Footer } from "../components";
import { getPosts } from "../lib/wordpress";
import NewsGrid from "./NewsGrid";

export const metadata: Metadata = {
  title: "News & Campaign Updates",
  description:
    "Latest news, announcements, and updates from the Power to the People Milwaukee campaign for a publicly owned utility.",
  alternates: { canonical: "/news" },
  openGraph: {
    url: "/news",
    type: "website",
    title: "News & Updates | Power to the People MKE",
    description:
      "Latest news from the campaign for public power in Milwaukee.",
    images: ["/opengraph-image"],
  },
};

export default async function NewsPage() {
  const { posts } = await getPosts(20);

  return (
    <>
      <Header />

      <main id="main-content" className="bg-cream min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <AnimateOnScroll animation="fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-spectral font-bold text-navy text-center mb-4">
              News & Updates
            </h1>
            <p className="text-center text-navy/70 max-w-2xl mx-auto mb-12">
              Stay informed about our campaign for public power in Milwaukee.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={100}>
            <NewsGrid posts={posts} />
          </AnimateOnScroll>
        </div>
      </main>

      <Footer />
    </>
  );
}
