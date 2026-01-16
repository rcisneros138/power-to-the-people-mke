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
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-xl text-white/70 mb-8">
          {description}
        </p>
        <Link
          href={buttonHref}
          className="inline-block rounded-full bg-coral px-10 py-4 text-white font-semibold text-lg hover:bg-coral-dark transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
