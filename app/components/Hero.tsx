import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-coral font-semibold tracking-wide uppercase text-sm mb-4">
          A Campaign for Milwaukee
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-6">
          Power to the People
        </h1>
        <p className="text-xl sm:text-2xl text-navy/70 max-w-3xl mx-auto mb-10 leading-relaxed">
          It's time to replace We Energies with a utility owned by all of us.
          Lower bills. Better service. A cleaner future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/get-involved"
            className="rounded-full bg-coral px-8 py-4 text-white font-semibold text-lg hover:bg-coral-dark transition-colors"
          >
            Get Involved
          </Link>
          <Link
            href="/about"
            className="rounded-full border-2 border-navy px-8 py-4 text-navy font-semibold text-lg hover:bg-navy hover:text-white transition-colors"
          >
            Learn Why
          </Link>
        </div>
      </div>
    </section>
  );
}
