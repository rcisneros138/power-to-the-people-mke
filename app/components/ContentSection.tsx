interface Stat {
  value: string;
  label: string;
  sublabel?: string;
  source?: string;
}

interface ContentSectionProps {
  label: string;
  title: string;
  children: React.ReactNode;
  imagePosition?: "left" | "right";
  stat?: Stat;
  media?: React.ReactNode;
}

export default function ContentSection({
  label,
  title,
  children,
  imagePosition = "left",
  stat,
  media,
}: ContentSectionProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${imagePosition === "right" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center`}>
          <div className="w-full lg:w-1/2">
            {media ? (
              media
            ) : (
            <div
              className="aspect-square bg-teal rounded-2xl flex items-center justify-center p-8 sm:p-12 relative overflow-hidden"
              role="presentation"
            >
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, #133020 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
                aria-hidden="true"
              />
              <div className="relative text-center max-w-md">
                {stat ? (
                  <>
                    <div className="font-talina text-navy text-7xl sm:text-8xl lg:text-9xl leading-[0.85] tracking-tight uppercase text-shadow-bold">
                      {stat.value}
                    </div>
                    <p className="mt-6 font-spectral font-bold text-navy text-xl sm:text-2xl leading-snug">
                      {stat.label}
                    </p>
                    {stat.sublabel && (
                      <p className="mt-3 text-navy/70 text-base leading-relaxed">
                        {stat.sublabel}
                      </p>
                    )}
                    {stat.source && (
                      <p className="mt-4 text-navy/60 text-xs uppercase tracking-wide font-bold">
                        {stat.source}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-navy/70 text-sm">Illustration</p>
                )}
              </div>
            </div>
            )}
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2">
            <p className="text-navy font-bold tracking-wide uppercase text-sm mb-3">
              {label}
            </p>
            <h2 className="text-4xl sm:text-5xl text-navy mb-6">
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
