export default function Hero() {
  return (
    <section className="bg-teal min-h-[80vh] flex items-center justify-center py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Stacked Typography */}
        <div className="mb-10 sm:mb-12 uppercase hero-entrance">
          <h1 className="font-talina text-navy">
            <span className="block text-6xl sm:text-7xl lg:text-9xl xl:text-[10rem] leading-[0.85] tracking-tight text-shadow-bold">
              Power
            </span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl tracking-wide my-2 sm:my-3">
              to the
            </span>
            <span className="block text-6xl sm:text-7xl lg:text-9xl xl:text-[10rem] leading-[0.85] tracking-tight text-shadow-bold">
              People
            </span>
          </h1>
          {/* Chapter attribution */}
          <p className="text-base sm:text-lg lg:text-xl font-cream-cake text-navy/80 mt-6 tracking-normal normal-case max-w-3xl mx-auto leading-snug">
            A Milwaukee Democratic Socialists of America Campaign
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-navy/80 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed hero-entrance-d1">
          It&apos;s time to replace We Energies with a utility owned by all of us.
          Lower bills. Better service. A cleaner future for Milwaukee.
        </p>

        {/* CTA Button */}
        <a
          href="https://actionnetwork.org/petitions/power-to-the-people"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-coral px-8 py-4 text-white font-bold text-xl uppercase tracking-wider hover:bg-coral-dark transition-colors inline-flex items-center gap-3 hero-entrance-d2"
        >
          Sign The Petition
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </section>
  );
}
