import type { Metadata } from "next";
import { AnimateOnScroll, Header, Footer, FAQ, CTABanner } from "../components";
import { getFAQs } from "../lib/wordpress";

export const metadata: Metadata = {
  title: "Public Power FAQ",
  description:
    "Answers to the most common questions about creating a publicly owned municipal utility in Milwaukee under Wisconsin Chapter 197 — legality, cost, reliability, workers, and more.",
  alternates: { canonical: "/faq" },
  openGraph: {
    url: "/faq",
    title: "Public Power FAQ | Power to the People MKE",
    description:
      "Answers to the most common questions about creating a publicly owned utility in Milwaukee.",
    images: ["/opengraph-image"],
  },
};

export default async function FAQPage() {
  // Pull FAQs from WordPress when available; the FAQ component falls back to
  // its built-in defaults (which mirror the campaign FAQ document) otherwise.
  const faqItems = await getFAQs();

  return (
    <>
      <Header />

      <main id="main-content" className="bg-cream min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-4">
          <AnimateOnScroll animation="fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-spectral font-bold text-navy text-center mb-4">
              Public Power FAQ
            </h1>
            <p className="text-center text-navy/70 max-w-2xl mx-auto text-lg">
              Common questions about replacing We Energies with a publicly owned
              utility in Milwaukee, and how it would work under Wisconsin Chapter 197.
            </p>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll animation="fade-up">
          <FAQ items={faqItems} />
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up">
          <CTABanner
            title="Still have questions?"
            description="Reach out and get involved in the campaign for public power in Milwaukee."
            buttonText="Get Involved"
            buttonHref="/get-involved"
          />
        </AnimateOnScroll>
      </main>

      <Footer />
    </>
  );
}
