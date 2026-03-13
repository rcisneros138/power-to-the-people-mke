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

        <BenefitsGrid />

        <AnimateOnScroll animation="fade-up">
          <ContentSection
            label="The Problem"
            title="We Energies Puts Profits Over People"
            imagePosition="left"
            imagePlaceholder="High bills illustration"
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
            imagePlaceholder="Community power illustration"
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
            label="It Works"
            title="Public Power Delivers Results"
            imagePosition="left"
            imagePlaceholder="Success stories illustration"
          >
            <p>
              Nationally, 1 in 7 Americans are served by public utilities. In Wisconsin,
              81 publicly owned utilities serve 11% of the state&apos;s electricity needs—with
              better outcomes than private alternatives.
            </p>
            <p>
              Public utility customers experience an average of 59 minutes of downtime per
              year, compared to 133 minutes for private utility customers. That&apos;s real
              reliability you can count on.
            </p>
          </ContentSection>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up">
          <FAQ items={faqItems} />
        </AnimateOnScroll>

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
