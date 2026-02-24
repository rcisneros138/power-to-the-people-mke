import type { Metadata } from "next";
import { Header, Footer, CTABanner } from "../components";
import { getPage } from "../lib/wordpress";

interface Resource {
  title: string;
  description: string;
  type: "pdf" | "link" | "doc";
  href: string;
}

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Reports, legal documents, and evidence supporting the case for public power in Milwaukee.",
  openGraph: {
    title: "Resources | Power to the People MKE",
    description:
      "Reports, legal documents, and evidence for public power in Milwaukee.",
  },
};

const defaultResources: Resource[] = [
  {
    title: "Public Power FAQ",
    description: "Answers to the most common questions about creating a municipal utility in Milwaukee.",
    type: "doc",
    href: "/about",
  },
  {
    title: "Wisconsin Chapter 197",
    description: "The state law that gives Milwaukee the legal right to create a publicly owned utility.",
    type: "link",
    href: "https://docs.legis.wisconsin.gov/statutes/statutes/197",
  },
  {
    title: "APPA Public Power Statistics",
    description: "National data from the American Public Power Association on municipal utility performance.",
    type: "link",
    href: "https://www.publicpower.org/",
  },
  {
    title: "We Energies Rate Comparison",
    description: "How We Energies rates compare to Wisconsin's publicly owned utilities. (Coming soon)",
    type: "doc",
    href: "/resources",
  },
  {
    title: "Municipal Utility Case Studies",
    description: "Success stories from Austin, Memphis, Los Angeles, and Wisconsin communities. (Coming soon)",
    type: "doc",
    href: "/resources",
  },
  {
    title: "Campaign White Paper",
    description: "Our detailed proposal for transitioning Milwaukee to public power. (Coming soon)",
    type: "pdf",
    href: "/resources",
  },
];

const typeIcons: Record<Resource["type"], React.ReactNode> = {
  pdf: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  link: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.654a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364l1.757 1.757" />
    </svg>
  ),
  doc: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
};

export default async function ResourcesPage() {
  const wpPage = await getPage("resources");

  return (
    <>
      <Header />

      <main className="bg-cream min-h-screen" id="main-content">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-spectral font-bold text-navy text-center mb-4">
            Resources
          </h1>
          <p className="text-center text-navy/70 max-w-2xl mx-auto mb-12 text-lg">
            Learn more about the case for public power in Milwaukee. Download reports, read the law, and explore the evidence.
          </p>

          {/* WordPress content if available */}
          {wpPage?.content && (
            <div
              className="prose prose-lg prose-navy max-w-3xl mx-auto mb-16
                prose-headings:font-spectral prose-headings:text-navy
                prose-p:text-navy/80 prose-a:text-navy prose-a:underline prose-a:decoration-coral hover:prose-a:text-coral"
              dangerouslySetInnerHTML={{ __html: wpPage.content }}
            />
          )}

          {/* Resource cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultResources.map((resource) => (
              <a
                key={resource.title}
                href={resource.href}
                target={resource.type === "link" ? "_blank" : undefined}
                rel={resource.type === "link" ? "noopener noreferrer" : undefined}
                className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-navy/5 hover:border-coral/20"
              >
                <div className="text-coral mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">
                  {typeIcons[resource.type]}
                </div>
                <h3 className="text-xl font-spectral font-bold text-navy mb-2 group-hover:text-coral transition-colors">
                  {resource.title}
                </h3>
                <p className="text-navy/70 text-sm leading-relaxed">
                  {resource.description}
                </p>
                <span className="mt-4 inline-flex items-center text-navy text-sm font-bold group-hover:text-coral uppercase tracking-wide">
                  {resource.type === "link" ? "Visit" : resource.type === "pdf" ? "Download" : "Read"}
                  {resource.type === "link" && <span className="sr-only"> (opens in new tab)</span>}
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>

        <CTABanner
          title="Have a resource to share?"
          description="Help us build our library of evidence for public power."
          buttonText="Contact Us"
          buttonHref="/get-involved"
        />
      </main>

      <Footer />
    </>
  );
}
