import type { Metadata } from "next";
import { AnimateOnScroll, Header, Footer, CTABanner } from "../components";
import type { Partner } from "../components";
import { getPartners } from "../lib/wordpress";

export const metadata: Metadata = {
  title: "Coalition Partners",
  description:
    "Milwaukee organizations united in the fight for energy democracy and public power.",
  openGraph: {
    title: "Coalition Partners | Power to the People MKE",
    description:
      "Milwaukee organizations united in the fight for energy democracy.",
  },
};

const defaultPartners: Partner[] = [
  {
    name: "Milwaukee DSA",
    shortName: "DSA",
  },
  {
    name: "Greater Milwaukee Green Party",
    shortName: "Green Party",
  },
  {
    name: "Milwaukee Teachers' Education Association",
    shortName: "MTEA",
  },
  {
    name: "Milwaukee Solidarity",
    shortName: "Solidarity",
  },
  {
    name: "North Side Rising",
    shortName: "NSR",
  },
  {
    name: "Our Wisconsin Revolution",
    shortName: "OWR",
  },
];

export default async function PartnersPage() {
  const wpPartners = await getPartners();
  const partners = wpPartners.length > 0 ? wpPartners : defaultPartners;

  return (
    <>
      <Header />

      <main id="main-content" className="bg-cream min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <AnimateOnScroll animation="fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-spectral font-bold text-navy text-center mb-4">
              Coalition Partners
            </h1>
            <p className="text-center text-navy/70 max-w-2xl mx-auto mb-16 text-lg">
              Power to the People is a coalition of Milwaukee organizations united in the fight for energy democracy. Together, we represent thousands of Milwaukee residents demanding public power.
            </p>
          </AnimateOnScroll>

          {/* Partner grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <AnimateOnScroll key={partner.name} animation="fade-up" delay={index * 60}>
              <div
                className="bg-white rounded-xl p-6 flex flex-col items-center justify-center text-center border border-navy/5 hover:shadow-md transition-all duration-200 min-h-[160px]"
              >
                {partner.logo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partner.logo.sourceUrl}
                      alt={partner.logo.altText || partner.name}
                      className="h-16 w-auto object-contain mb-3"
                    />
                    <p className="text-sm font-medium text-navy/70">{partner.name}</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center mb-3">
                      <span className="text-2xl font-spectral font-extrabold text-coral">
                        {partner.shortName.charAt(0)}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-navy">{partner.name}</p>
                  </>
                )}
              </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        <AnimateOnScroll animation="fade-up">
          <CTABanner
            title="Want your organization to join the coalition?"
            description="We welcome labor unions, environmental groups, community organizations, and civic groups who support public power for Milwaukee."
            buttonText="Become a Partner"
            buttonHref="/get-involved"
          />
        </AnimateOnScroll>
      </main>

      <Footer />
    </>
  );
}
