import type { Metadata } from "next";
import { Header, Footer } from "../components";
import { getPosts } from "../lib/wordpress";
import NewsGrid from "./NewsGrid";

export const metadata: Metadata = {
  title: "News",
  description:
    "Latest news and updates from the Power to the People Milwaukee campaign for public power.",
  openGraph: {
    title: "News | Power to the People MKE",
    description:
      "Latest news from the campaign for public power in Milwaukee.",
  },
};

export default async function NewsPage() {
  const { posts } = await getPosts(20);

  return (
    <>
      <Header />

      <main id="main-content" className="bg-cream min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-spectral font-bold text-navy text-center mb-4">
            News & Updates
          </h1>
          <p className="text-center text-navy/70 max-w-2xl mx-auto mb-12">
            Stay informed about our campaign for public power in Milwaukee.
          </p>

          <NewsGrid posts={posts} />
        </div>
      </main>

      <Footer />
    </>
  );
}
