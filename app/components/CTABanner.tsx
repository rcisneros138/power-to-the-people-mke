import Link from "next/link";

interface CTABannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CTABanner({
  title = "Ready to fight for affordable, reliable, clean energy?",
  description = "Join thousands of Milwaukee residents demanding public power.",
  buttonText = "Get Involved",
  buttonHref = "/get-involved",
}: CTABannerProps) {
  return (
    <section className="bg-navy-dark py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl sm:text-6xl text-white mb-6">
          {title}
        </h2>
        <p className="text-xl text-white/80 mb-10 font-medium">
          {description}
        </p>
        <Link
          href={buttonHref}
          className="rounded-full bg-coral px-10 py-4 text-white font-medium uppercase tracking-wider hover:bg-coral-dark transition-colors inline-flex items-center gap-3"
        >
          {buttonText}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
