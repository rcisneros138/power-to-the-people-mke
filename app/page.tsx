import Image from "next/image";
import {
  AnimateOnScroll,
  Header,
  Footer,
  Hero,
  BenefitsGrid,
  ContentSection,
  CTABanner,
  PartnersStrip,
  FAQ,
  RisingLineChart,
  HandshakeTile,
  OutageClocks,
} from "./components";
import { getFAQs, getPartners } from "./lib/wordpress";

export default async function Home() {
  // Fetch data from WordPress at build time
  const [faqItems, partners] = await Promise.all([
    getFAQs(),
    getPartners(),
  ]);

  return (
    <>
      <Header />

      <main id="main-content">
        <Hero />

        {/* ── The wordmark, made physical: the same demand, assembled under the
             Wells Street arch. Matted into the hero's amber rather than set on
             its own ground, so the top of the page reads as one unit. ── */}
        <section className="bg-teal pb-10 sm:pb-12">
          <figure>
            <AnimateOnScroll animation="reveal" duration={900}>
              <div className="relative w-full aspect-square sm:aspect-[16/9] lg:aspect-[2/1]">
                <Image
                  src="/home/arch-crowd-wide.jpg"
                  alt="Milwaukeeans stand in a wide ring beneath the stone arch at the Wells Street entrance of City Hall, listening to a speaker on the plinth at the center while others hold hand-lettered “Power 2 the People” placards."
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            </AnimateOnScroll>
            <figcaption className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-4 text-navy text-sm sm:text-base font-medium leading-relaxed">
              Milwaukee City Hall, 200 East Wells. On March 1, 2024 residents
              filled the arch to hand the city their petitions for a public utility.
            </figcaption>
          </figure>
        </section>

        <BenefitsGrid />

        <AnimateOnScroll animation="fade-up">
          <ContentSection
            label="The Problem"
            title="We Energies Puts Profits Over People"
            imagePosition="left"
            media={<RisingLineChart />}
          >
            <p>
              Milwaukee residents pay some of the highest utility rates in the nation.
              We Energies charges 30-40% more than Wisconsin&apos;s public utilities—and that
              money goes straight to corporate shareholders, not better service.
            </p>
            <p>
              Meanwhile, our community faces frequent outages, aging infrastructure, and
              a utility company that&apos;s dragging its feet on clean energy. We Energies
              generates less than 6% of its power from renewables.
            </p>
          </ContentSection>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up">
          <ContentSection
            label="The Solution"
            title="A Utility Owned By All of Us"
            imagePosition="right"
            media={<HandshakeTile />}
          >
            <p>
              Wisconsin law (Chapter 197) gives Milwaukee the power to create a municipal
              utility. This means a utility controlled by elected officials accountable
              to us—not distant shareholders.
            </p>
            <p>
              Public utilities across Wisconsin already serve communities like Manitowoc,
              Sun Prairie, and Sheboygan with lower rates and better reliability. Cities
              like Austin, Memphis, and Los Angeles prove public power works at scale.
            </p>
          </ContentSection>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up">
          <ContentSection
            label="The Proof"
            title="Public Power Works"
            imagePosition="left"
            media={<OutageClocks />}
          >
            <p>
              Nationally, 1 in 7 Americans are served by public utilities. In Wisconsin,
              81 publicly owned utilities serve 11% of the state&apos;s electricity needs.
            </p>
            <p>
              Public utility customers experience an average of 59 minutes of downtime per
              year, compared to 133 minutes for private utility customers.
            </p>
          </ContentSection>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up">
          <FAQ items={faqItems} />
        </AnimateOnScroll>

        {/* ── The last thing before the ask: who is doing the asking. Inset on
             the CTA's own navy so the plate and the banner read as one block. ── */}
        <div className="bg-navy-dark pt-16 sm:pt-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll animation="reveal" duration={900}>
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/9]">
                <Image
                  src="/home/rally-speaker.jpg"
                  alt="A speaker on the plinth under the City Hall arch raises one arm mid-sentence, microphone in hand, addressing the crowd gathered for the public power petition delivery."
                  fill
                  loading="lazy"
                  sizes="(max-width: 1151px) 100vw, 1120px"
                  className="object-cover object-center"
                />
              </div>
            </AnimateOnScroll>
          </div>
        </div>

        <AnimateOnScroll animation="fade-up">
          <CTABanner />
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-in">
          <PartnersStrip partners={partners} />
        </AnimateOnScroll>
      </main>

      <Footer />
    </>
  );
}
