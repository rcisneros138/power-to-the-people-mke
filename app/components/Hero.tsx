import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-coral py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-cream font-semibold tracking-wide uppercase text-sm mb-4">
          A Campaign for Milwaukee
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          Power to the People
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
          It's time to replace We Energies with a utility owned by all of us.
          Lower bills. Better service. A cleaner future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/get-involved"
            className="rounded-full bg-navy-dark px-8 py-4 text-cream font-semibold text-lg hover:bg-navy transition-colors"
          >
            Get Involved
          </Link>
          <Link
            href="/about"
            className="rounded-full border-2 border-white px-8 py-4 text-white font-semibold text-lg hover:bg-white hover:text-coral transition-colors"
          >
            Learn Why
          </Link>
        </div>
      </div>
    </section>
  );
}
