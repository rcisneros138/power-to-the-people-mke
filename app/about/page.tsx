import type { Metadata } from "next";
import Image from "next/image";
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
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
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
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
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
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
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
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
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
                dangerouslySetInnerHTML={{ __html: wpPage.content }}
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
        {/* ── Hero: type on cream, then the photograph full-bleed and uncovered ── */}
        <section className="bg-cream pt-16 pb-12 sm:pt-20 sm:pb-14 relative overflow-hidden">
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

        <div className="bg-cream">
          <div className="hero-reveal relative w-full aspect-[3/2] sm:aspect-[2/1] lg:aspect-[12/5]">
            <Image
              src="/about/group-city-hall-steps.jpg"
              alt="Dozens of Milwaukee residents stand together under the arched entrance of City Hall, fists and arms raised, behind a red Milwaukee DSA banner, after delivering public power petitions on March 1, 2024."
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          {/* Dateline: a caption bar, not decoration — it says when and where. */}
          <div className="bg-navy-dark">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
              <p className="text-white font-bold uppercase tracking-wide text-sm">
                Milwaukee City Hall, 200 East Wells
              </p>
              <p className="text-white/75 uppercase tracking-wide text-sm">
                Petition delivery, March 1, 2024
              </p>
            </div>
          </div>
        </div>

        {/* ── Mission: the sign makes the argument, the copy finishes it ── */}
        <div className="bg-white">
          <AnimateOnScroll animation="fade-up">
            <ContentSection
              label="Our Mission"
              title="A Utility Owned by Milwaukee"
              imagePosition="right"
              media={
                <div className="relative max-w-none sm:max-w-sm mx-auto lg:max-w-md lg:mx-0 lg:ml-auto lg:mr-12">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-sm">
                    <Image
                      src="/about/protester-sign.jpg"
                      alt="A demonstrator inside the Milwaukee City Hall rotunda raises a hand-lettered cardboard sign whose last words read “to a corporation.”"
                      fill
                      loading="lazy"
                      sizes="(max-width: 639px) 92vw, (max-width: 1023px) 384px, 448px"
                      className="object-cover object-center"
                    />
                  </div>
                  {/* Chapter 197 tile, lapped over the photograph's lower corner. */}
                  <div className="absolute -bottom-10 right-0 sm:-bottom-6 sm:-right-6 lg:-right-10 w-40 sm:w-48 lg:w-52 bg-teal p-5 sm:p-6 shadow-[0_18px_40px_-12px_rgba(13,31,21,0.45)]">
                    <div className="font-talina text-navy text-6xl sm:text-7xl leading-[0.8] tracking-tight uppercase text-shadow-coral-sm">
                      197
                    </div>
                    <p className="mt-4 font-spectral font-bold text-navy text-sm sm:text-base leading-snug">
                      Wisconsin Chapter 197 already gives cities the right to run their
                      own utility.
                    </p>
                    <p className="mt-3 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-wider text-navy/70">
                      Wisconsin State Statutes
                    </p>
                  </div>
                </div>
              }
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

        {/* ── Why Public Power: four figures, read as a record rather than cards ── */}
        <section className="bg-cream pt-24 pb-20 sm:pt-28 sm:pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="max-w-2xl mb-12 sm:mb-14">
                <h2 className="text-4xl sm:text-5xl text-navy mb-4">
                  Why Public Power?
                </h2>
                <p className="text-lg text-navy/70">
                  Across the country, publicly owned utilities deliver lower rates, better
                  reliability, and a real say for the communities they serve.
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-navy/10 border border-navy/10">
              {benefits.map((benefit, index) => (
                <AnimateOnScroll
                  key={benefit.title}
                  animation="fade-up"
                  delay={index * 90}
                  duration={700}
                  className="bg-white"
                >
                  <div className="h-full p-7 sm:p-8">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="font-display text-navy text-5xl sm:text-6xl leading-[0.85] tracking-wide uppercase">
                        {benefit.stat}
                      </div>
                      <div className="text-coral-deep shrink-0" aria-hidden="true">
                        {benefit.icon}
                      </div>
                    </div>
                    <div className="h-1 w-10 bg-coral mb-4" aria-hidden="true" />
                    <h3 className="text-lg text-navy mb-2.5">{benefit.title}</h3>
                    <p className="text-navy/70 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── March 1, 2024: the photo essay ── */}
        <section className="bg-navy-dark py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 sm:mb-16">
                <h2 className="lg:col-span-6 text-4xl sm:text-5xl text-white">
                  We Carried It Through the Front Door
                </h2>
                <p className="lg:col-span-6 text-lg sm:text-xl text-white/80 leading-relaxed">
                  On March 1, 2024, Milwaukeeans walked petitions for a public utility into
                  City Hall and carried them upstairs to the mayor&apos;s office. Neighbors,
                  union members and organizers filled the balconies. Public power is not an
                  abstraction in this city — it is a demand people have already made in
                  person.
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <AnimateOnScroll animation="reveal" duration={900} className="lg:col-span-7">
                <figure>
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src="/about/march-inside.jpg"
                      alt="Marchers stream through the glass doors of Milwaukee City Hall carrying a red Milwaukee DSA banner, backlit by the street behind them."
                      fill
                      loading="lazy"
                      sizes="(max-width: 1023px) 100vw, 58vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <figcaption className="mt-3 text-white/75 text-sm leading-relaxed">
                    The march enters City Hall behind the Milwaukee DSA banner.
                  </figcaption>
                </figure>
              </AnimateOnScroll>

              <AnimateOnScroll
                animation="reveal"
                delay={180}
                duration={900}
                className="lg:col-span-5 lg:mt-16"
              >
                <figure>
                  <div className="relative aspect-[4/3] lg:aspect-[3/4] overflow-hidden">
                    <Image
                      src="/about/city-hall-atrium.jpg"
                      alt="Supporters line the ornate iron balconies of the Milwaukee City Hall atrium, gathered outside the door marked Mayor."
                      fill
                      loading="lazy"
                      sizes="(max-width: 1023px) 100vw, 40vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <figcaption className="mt-3 text-white/75 text-sm leading-relaxed">
                    The atrium fills outside the mayor&apos;s office.
                  </figcaption>
                </figure>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ── Coalition ── */}
        <section className="bg-navy py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <AnimateOnScroll animation="fade-up">
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

        {/* ── Get Involved ── */}
        <section className="bg-coral-deep py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <AnimateOnScroll animation="fade-up">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-5">
                Join the Movement
              </h2>
              <p className="text-xl text-white mb-9 font-medium max-w-2xl mx-auto">
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
