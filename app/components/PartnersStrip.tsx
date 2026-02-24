export interface Partner {
  name: string;
  shortName: string;
  logo?: {
    sourceUrl: string;
    altText: string;
  };
}

// Default partners (used when WordPress data is not available)
const defaultPartners: Partner[] = [
  { name: "Milwaukee DSA", shortName: "DSA" },
  { name: "Greater Milwaukee Green Party", shortName: "Green Party" },
  { name: "Milwaukee Teachers' Education Association", shortName: "MTEA" },
  { name: "Milwaukee Solidarity", shortName: "Solidarity" },
  { name: "North Side Rising", shortName: "NSR" },
  { name: "Our Wisconsin Revolution", shortName: "OWR" },
];

interface PartnersStripProps {
  partners?: Partner[];
}

export default function PartnersStrip({ partners }: PartnersStripProps) {
  // Use provided partners or fall back to defaults
  const partnerList = partners && partners.length > 0 ? partners : defaultPartners;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-navy/70 uppercase tracking-wide mb-8">
          Coalition Partners
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
          {partnerList.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center h-16 px-6 bg-cream/50 rounded-lg"
              title={partner.name}
            >
              {partner.logo ? (
                <img
                  src={partner.logo.sourceUrl}
                  alt={partner.logo.altText || partner.name}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-navy/80 font-medium text-sm">
                  {partner.shortName}
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="text-center mt-8">
          <a href="/partners" className="text-navy font-bold hover:text-coral-dark transition-colors">
            View all partners &rarr;
          </a>
        </p>
      </div>
    </section>
  );
}
