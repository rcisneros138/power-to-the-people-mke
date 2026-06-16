import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { AnimateOnScroll, Header, Footer } from "../components";
import { getPage } from "../lib/wordpress";

const PETITION_URL = "https://actionnetwork.org/petitions/power-to-the-people";
const CONTACT_REPS_URL =
  "https://dsamke.solidarity.tech/power-to-the-people-alder-email-mobilization";

// Embedded volunteer interest form — official ST embed pattern is
// `<page-url>/embed`; `?breakout=true` makes the form's post-submit
// redirect the parent page instead of stranding the user inside the iframe.
// Requires the height-broadcast script to be pasted into the ST page's
// Page Settings → Head HTML (same setup as the event-calendar embed).
const SOLIDARITY_TECH_FORM_URL =
  "https://dsamke.solidarity.tech/power-to-the-people-interest-form/embed?breakout=true";
const SOLIDARITY_TECH_FORM_PUBLIC_URL =
  "https://dsamke.solidarity.tech/power-to-the-people-interest-form";

export const metadata: Metadata = {
  title: "Get Involved — Join the Public Power Campaign",
  description:
    "Sign the petition, volunteer, donate, or contact your alder. Join Milwaukee's campaign to replace We Energies with a publicly owned utility.",
  alternates: { canonical: "/get-involved" },
  openGraph: {
    url: "/get-involved",
    title: "Get Involved | Power to the People MKE",
    description:
      "Join the Milwaukee public power campaign — sign, volunteer, or donate.",
    images: ["/opengraph-image"],
  },
};

type WayToHelp = {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

const waysToHelp: WayToHelp[] = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "Volunteer",
    description: "Join our canvassing teams, help at events, or assist with outreach. Every hour you give helps build the movement.",
    href: "#volunteer-signup",
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
    title: "Contact Your Reps",
    description: "Let your alderperson and city officials know you support public power. We'll give you the talking points and contact info.",
    href: CONTACT_REPS_URL,
    external: true,
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
      </svg>
    ),
    title: "Spread the Word",
    description: "Talk to your neighbors, share on social media, and help us reach every corner of Milwaukee with the message of public power.",
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      "Milwaukee deserves public power. Sign the petition:"
    )}&url=${encodeURIComponent(PETITION_URL)}`,
    external: true,
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    title: "Donate",
    description: "Help fund canvassing materials, event spaces, and campaign resources. Every dollar goes directly to the campaign.",
    href: "https://donorbox.org/power-to-the-people-mke",
    external: true,
  },
];

export default async function GetInvolvedPage() {
  const wpPage = await getPage("get-involved");

  return (
    <>
      <Header />

      <main className="bg-cream min-h-screen" id="main-content">
        {/* Hero */}
        <div className="bg-teal py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <AnimateOnScroll animation="fade-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-spectral font-bold text-navy mb-4">
                Get Involved
              </h1>
              <p className="text-xl text-navy/90 max-w-2xl mx-auto mb-8">
                The fight for public power needs you. Here&apos;s how you can help build a better Milwaukee.
              </p>
              <a
                href={PETITION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-coral px-8 py-4 text-white font-bold text-xl uppercase tracking-wider hover:bg-coral-dark transition-colors inline-flex items-center gap-3"
              >
                Sign The Petition
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </AnimateOnScroll>
          </div>
        </div>

        {/* WordPress content if available */}
        {wpPage?.content && (
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
            <div
              className="prose prose-lg prose-navy max-w-none
                prose-headings:font-spectral prose-headings:text-navy
                prose-p:text-navy/80 prose-a:text-navy prose-a:underline prose-a:decoration-coral hover:prose-a:text-coral"
              dangerouslySetInnerHTML={{ __html: wpPage.content }}
            />
          </div>
        )}

        {/* Ways to help */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {waysToHelp.map((item, index) => {
              const externalProps = item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <AnimateOnScroll key={item.title} animation="fade-up" delay={index * 100}>
                  <a
                    href={item.href}
                    {...externalProps}
                    className="group block bg-white rounded-xl p-8 border border-navy/5 hover:border-coral hover:shadow-lg transition-all h-full"
                  >
                    <div className="text-coral mb-4">{item.icon}</div>
                    <h3 className="text-2xl font-spectral font-bold text-navy mb-2 group-hover:text-coral transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-navy/70 leading-relaxed">
                      {item.description}
                    </p>
                  </a>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>

        {/* Volunteer signup form — embedded from Solidarity Tech */}
        <AnimateOnScroll animation="fade-up">
        <div id="volunteer-signup" className="bg-navy-dark py-16 sm:py-20 scroll-mt-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-spectral font-bold text-white text-center mb-3">
              Sign Up to Volunteer
            </h2>
            <p className="text-white/70 text-center mb-10">
              Fill out the interest form and a campaign leader will reach out to you.
            </p>

            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <iframe
                id="solidarity-volunteer-form"
                src={SOLIDARITY_TECH_FORM_URL}
                title="Power to the People MKE — volunteer interest form"
                className="w-full block border-0"
                // Tall placeholder to minimize jank — the postMessage receiver
                // below resizes to the form's actual height once ST broadcasts it.
                style={{ minHeight: 1400 }}
                loading="lazy"
              />
            </div>

            <p className="mt-4 text-center text-sm text-white/70">
              Having trouble viewing the form?{" "}
              <a
                href={SOLIDARITY_TECH_FORM_PUBLIC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-coral-dark transition-colors"
              >
                Open it in a new tab
              </a>
              .
            </p>
          </div>
        </div>
        </AnimateOnScroll>
      </main>

      <Footer />

      {/*
        Solidarity Tech broadcasts `postMessage` height updates from inside the
        iframe (the height-broadcast script must be pasted into the ST form
        page's Page Settings → Head HTML). Target by id so this stays robust
        if another iframe is ever added to this page. +20px buffer matches
        ST's recommended snippet.
      */}
      <Script id="solidarity-tech-form-resize-receiver" strategy="afterInteractive">
        {`
          window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'solidarity-tech-resize') {
              var iframe = document.getElementById('solidarity-volunteer-form');
              if (iframe) {
                iframe.style.height = (event.data.height + 20) + 'px';
              }
            }
          });
        `}
      </Script>
    </>
  );
}
