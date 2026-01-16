const partners = [
  { name: "Milwaukee DSA", shortName: "DSA" },
  { name: "Greater Milwaukee Green Party", shortName: "Green Party" },
  { name: "Milwaukee Teachers' Education Association", shortName: "MTEA" },
  { name: "Milwaukee Solidarity", shortName: "Solidarity" },
  { name: "North Side Rising", shortName: "NSR" },
  { name: "Our Wisconsin Revolution", shortName: "OWR" },
];

export default function PartnersStrip() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-navy/50 uppercase tracking-wide mb-8">
          Coalition Partners
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center h-16 px-6 bg-cream/50 rounded-lg"
              title={partner.name}
            >
              <span className="text-navy/60 font-medium text-sm">
                {partner.shortName}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center mt-8">
          <a href="/partners" className="text-coral hover:text-coral-dark font-medium transition-colors">
            View all partners &rarr;
          </a>
        </p>
      </div>
    </section>
  );
}
