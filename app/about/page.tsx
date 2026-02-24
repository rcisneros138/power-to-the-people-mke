import type { Metadata } from "next";
import { Header, Footer } from "../components";
import { getPage } from "../lib/wordpress";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why Milwaukee should replace We Energies with a publicly owned utility. Lower rates, better reliability, and democratic control.",
  openGraph: {
    title: "About | Power to the People MKE",
    description:
      "Learn why Milwaukee should replace We Energies with a publicly owned utility.",
  },
};

// Default content when WordPress page is not available
const defaultContent = {
  title: "About Power to the People",
  content: `
    <p>Power to the People is a coalition of Milwaukee community organizations working to create a publicly-owned municipal utility. We believe that essential services like electricity should be controlled by the people who use them, not distant shareholders seeking profit.</p>

    <h2>Our Mission</h2>
    <p>We are working to replace We Energies with a municipal utility owned and operated by the City of Milwaukee. Under Wisconsin law (Chapter 197), cities have the right to create their own public utilities. We're advocating for Milwaukee to exercise this right.</p>

    <h2>Why Public Power?</h2>
    <p>Across the nation, publicly-owned utilities consistently deliver:</p>
    <ul>
      <li><strong>Lower rates</strong> - Municipal utilities charge 15% less on average than private utilities</li>
      <li><strong>Better reliability</strong> - Public utilities average 59 minutes of downtime per year, compared to 133 minutes for private utilities</li>
      <li><strong>Local control</strong> - Decisions are made by elected officials accountable to residents, not shareholders</li>
      <li><strong>Clean energy leadership</strong> - Public utilities can prioritize renewable energy without shareholder pressure</li>
    </ul>

    <h2>Our Coalition</h2>
    <p>Power to the People brings together labor unions, environmental groups, community organizations, and concerned residents who believe Milwaukee deserves better than what We Energies provides.</p>

    <h2>Get Involved</h2>
    <p>Join us in building a movement for energy democracy in Milwaukee. Whether you can volunteer, donate, or simply spread the word, every contribution helps us move closer to public power.</p>
  `,
};

export default async function AboutPage() {
  // Try to fetch from WordPress, fall back to default content
  const wpPage = await getPage("about");

  const title = wpPage?.title || defaultContent.title;
  const content = wpPage?.content || defaultContent.content;

  return (
    <>
      <Header />

      <main id="main-content" className="bg-cream min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-spectral font-bold text-navy text-center mb-12">
            {title}
          </h1>

          <div
            className="prose prose-lg prose-navy max-w-none
              prose-headings:font-spectral prose-headings:text-navy
              prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-p:text-navy/80 prose-p:leading-relaxed
              prose-li:text-navy/80
              prose-strong:text-navy prose-strong:font-semibold
              prose-a:text-coral prose-a:no-underline hover:prose-a:text-coral-dark"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
