import AnimateOnScroll from "./AnimateOnScroll";

const benefits = [
  {
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    stat: "30-40%",
    title: "Lower Bills",
    description: "Public utilities consistently deliver lower rates than private monopolies like We Energies.",
  },
  {
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    stat: "2x",
    title: "More Reliable",
    description: "Residents with public utilities experience half the downtime of those with private utilities.",
  },
  {
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    stat: "100%",
    title: "Climate Action",
    description: "Democratic control means we decide our energy future—not corporate shareholders.",
  },
];

export default function BenefitsGrid() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl text-navy mb-4">
              Why Public Power?
            </h2>
            <p className="text-lg text-navy/70 max-w-2xl mx-auto">
              Across Wisconsin and the nation, publicly owned utilities deliver better results for communities.
            </p>
          </div>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <AnimateOnScroll key={index} animation="fade-up" delay={index * 100}>
              <div className="text-center p-8 rounded-2xl bg-cream/50">
                <div className="inline-flex items-center justify-center text-coral mb-4">
                  {benefit.icon}
                </div>
                <div className="text-4xl font-spectral font-extrabold text-navy mb-2">
                  {benefit.stat}
                </div>
                <h3 className="text-2xl text-navy mb-3">
                  {benefit.title}
                </h3>
                <p className="text-navy/70">
                  {benefit.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
