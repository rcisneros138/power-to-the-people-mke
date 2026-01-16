interface ContentSectionProps {
  label: string;
  title: string;
  children: React.ReactNode;
  imagePosition?: "left" | "right";
  imagePlaceholder?: string;
}

export default function ContentSection({
  label,
  title,
  children,
  imagePosition = "left",
  imagePlaceholder = "Illustration",
}: ContentSectionProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${imagePosition === "right" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center`}>
          {/* Image placeholder */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-square bg-gradient-to-br from-coral/20 to-navy/20 rounded-2xl flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-coral/30 flex items-center justify-center">
                  <svg className="w-16 h-16 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <p className="text-navy/50 text-sm">{imagePlaceholder}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2">
            <p className="text-coral font-semibold tracking-wide uppercase text-sm mb-3">
              {label}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6">
              {title}
            </h2>
            <div className="text-lg text-navy/70 space-y-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
