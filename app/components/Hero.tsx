import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-teal min-h-[80vh] flex items-center justify-center py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Stacked Typography */}
        <div className="mb-10 sm:mb-12 uppercase">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-talina text-navy tracking-wide mb-2">
            Take Our
          </p>
          <h1 className="text-7xl sm:text-8xl lg:text-[10rem] xl:text-[12rem] font-talina text-navy leading-[0.85] tracking-tight text-shadow-bold">
            Power
          </h1>
          <p className="text-4xl sm:text-5xl lg:text-6xl font-talina text-navy tracking-wide mt-2">
            Back
          </p>
          {/* Script accent */}
          <p className="text-3xl sm:text-4xl lg:text-5xl font-cream-cake text-navy/80 mt-6 tracking-normal normal-case">
            Milwaukee
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-navy/80 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
          It's time to replace We Energies with a utility owned by all of us.
          Lower bills. Better service. A cleaner future for Milwaukee.
        </p>

        {/* CTA Button */}
        <Link
          href="/about"
          className="rounded-full bg-coral px-8 py-4 text-white font-medium uppercase tracking-wider hover:bg-coral-dark transition-colors inline-flex items-center gap-3"
        >
          Why We Do It
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
