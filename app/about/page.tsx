import type { Metadata } from "next";
import Link from "next/link";
import { AnimateOnScroll, Header, Footer, ContentSection } from "../components";
import { getPage } from "../lib/wordpress";

export const metadata: Metadata = {
  title: "About the Public Power Campaign",
  description:
    "Learn why Milwaukee should replace We Energies with a publicly owned municipal utility. Lower rates, better reliability, and democratic control under Wisconsin Chapter 197.",
  alternates: { canonical: "/about" },
  openGraph: {
    url: "/about",
    title: "About the Public Power Campaign | Power to the People MKE",
    description:
      "Learn why Milwaukee should replace We Energies with a publicly owned municipal utility.",
    images: ["/opengraph-image"],
  },
};

interface Benefit {
  stat: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const benefits: Benefit[] = [
  {
    stat: "15%",
    title: "Lower Rates",
    description:
      "Municipal utilities charge about 15% less on average than investor-owned utilities like We Energies.",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    stat: "2×",
    title: "More Reliable",
    description:
      "Public utilities average 59 minutes of downtime a year — less than half the 133 minutes for private utilities.",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    stat: "Local",
    title: "Local Control",
    description:
      "Decisions are made by elected officials accountable to residents — not distant shareholders seeking profit.",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    stat: "Clean",
    title: "Clean Energy",
    description:
      "A public utility can prioritize renewables and climate resilience without pressure from shareholders.",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
];

const coalition = [
  "Labor Unions",
  "Environmental Groups",
  "Community Organizations",
  "Concerned Residents",
];

// Fallback prose layout, used only if a WordPress "about" page exists.
const fallbackContent = `
  <p>Power to the People is a coalition of Milwaukee community organizations working to create a publicly owned municipal utility. We believe essential services like electricity should be controlled by the people who use them, not distant shareholders seeking profit.</p>
  <h2>Our Mission</h2>
  <p>We are working to replace We Energies with a municipal utility owned and operated by the City of Milwaukee. Under Wisconsin law (Chapter 197), cities have the right to create their own public utilities. We're advocating for Milwaukee to exercise this right.</p>
  <h2>Our Coalition</h2>
  <p>Power to the People brings together labor unions, environmental groups, community organizations, and concerned residents who believe Milwaukee deserves better than what We Energies provides.</p>
`;

export default async function AboutPage() {
  const wpPage = await getPage("about");

  // Editorial override: if WordPress supplies About content, render it as prose.
  if (wpPage?.content) {
    return (
      <>
        <Header />
        <main id="main-content" className="bg-cream min-h-screen">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <AnimateOnScroll animation="fade-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-spectral font-bold text-navy text-center mb-12">
                {wpPage.title || "About Power to the People"}
              </h1>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={100}>
              <div
                className="prose prose-xl prose-navy max-w-none
                  prose-headings:font-spectral prose-headings:font-bold prose-headings:text-navy
                  prose-h2:text-3xl prose-h2:sm:text-4xl prose-h2:mt-16 prose-h2:mb-6
                  prose-p:text-navy/80 prose-p:leading-relaxed prose-p:my-7
                  prose-ul:my-7 prose-li:text-navy/80 prose-li:my-2 prose-li:leading-relaxed
                  prose-strong:text-navy prose-strong:font-semibold
                  prose-a:text-navy prose-a:underline prose-a:decoration-coral hover:prose-a:text-coral"
                dangerouslySetInnerHTML={{ __html: wpPage.content || fallbackContent }}
              />
            </AnimateOnScroll>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-cream py-20 sm:py-28 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #133020 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center hero-entrance">
            <p className="text-coral font-bold tracking-widest uppercase text-sm mb-4">
              About the Campaign
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl text-navy mb-6">
              About Power to the People
            </h1>
            <div className="w-24 h-1.5 bg-coral mx-auto mb-8 rounded-full" aria-hidden="true" />
            <p className="text-xl sm:text-2xl text-navy/80 leading-relaxed max-w-3xl mx-auto">
              We&apos;re a coalition of Milwaukee community organizations working to
              create a publicly owned municipal utility — because essential services
              like electricity should be controlled by the people who use them, not
              distant shareholders seeking profit.
            </p>
          </div>
        </section>

        {/* Mission */}
        <div className="bg-white">
          <AnimateOnScroll animation="fade-up">
            <ContentSection
              label="Our Mission"
              title="A Utility Owned by Milwaukee"
              imagePosition="right"
              stat={{
                value: "197",
                label: "Wisconsin Chapter 197 gives cities the legal right to create their own public utilities.",
                source: "Wisconsin State Statutes",
              }}
            >
              <p>
                We&apos;re working to replace We Energies with a municipal utility owned
                and operated by the City of Milwaukee. Under Wisconsin law, cities already
                have the right to create their own public utilities — we&apos;re advocating
                for Milwaukee to exercise it.
              </p>
              <p>
                This is energy democracy: a utility accountable to the residents it serves,
                run in the public interest rather than for private profit.
              </p>
            </ContentSection>
          </AnimateOnScroll>
        </div>

        {/* Why Public Power */}
        <section className="bg-cream py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="text-center mb-14">
                <p className="text-coral font-bold tracking-widest uppercase text-sm mb-3">
                  Why It Works
                </p>
                <h2 className="text-4xl sm:text-5xl text-navy mb-4">
                  Why Public Power?
                </h2>
                <p className="text-lg text-navy/70 max-w-2xl mx-auto">
                  Across the country, publicly owned utilities deliver lower rates, better
                  reliability, and a real say for the communities they serve.
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <AnimateOnScroll key={benefit.title} animation="fade-up" delay={index * 100}>
                  <div className="h-full bg-white rounded-2xl p-8 text-center border border-navy/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <div className="inline-flex items-center justify-center text-coral mb-4">
                      {benefit.icon}
                    </div>
                    <div className="font-spectral font-extrabold text-navy text-4xl uppercase tracking-wide mb-2">
                      {benefit.stat}
                    </div>
                    <h3 className="text-xl text-navy mb-3">{benefit.title}</h3>
                    <p className="text-navy/70 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Our Coalition */}
        <section className="bg-navy-dark py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <AnimateOnScroll animation="fade-up">
              <p className="text-teal font-bold tracking-widest uppercase text-sm mb-3">
                Stronger Together
              </p>
              <h2 className="text-4xl sm:text-5xl text-white mb-6">
                Our Coalition
              </h2>
              <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-10">
                Power to the People brings together a broad movement of Milwaukeeans who
                believe our city deserves better than what We Energies provides.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {coalition.map((group) => (
                  <span
                    key={group}
                    className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-white/90 font-bold uppercase tracking-wide text-sm"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Get Involved CTA */}
        <section className="bg-coral py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <AnimateOnScroll animation="fade-up">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-5">
                Join the Movement
              </h2>
              <p className="text-xl text-white/95 mb-9 font-medium max-w-2xl mx-auto">
                Whether you can volunteer, donate, or simply spread the word, every
                contribution moves Milwaukee closer to public power.
              </p>
              <Link
                href="/get-involved"
                className="rounded-full bg-navy-dark px-10 py-4 text-white font-bold text-xl uppercase tracking-wider hover:bg-navy transition-colors inline-flex items-center gap-3"
              >
                Get Involved
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </Link>
            </AnimateOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
