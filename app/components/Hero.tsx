import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-teal min-h-[80vh] flex items-center justify-center py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-[8rem] xl:text-[10rem] text-navy leading-[0.9] mb-10 tracking-tight text-shadow-bold">
          Power to the People.
        </h1>
        <p className="text-lg sm:text-xl text-navy/80 max-w-2xl mx-auto mb-12 leading-relaxed">
          It's time to replace We Energies with a utility owned by all of us.
          Lower bills. Better service. A cleaner future for Milwaukee.
        </p>
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
