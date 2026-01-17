"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Is this legal?",
    answer: "Yes, Chapter 197 of the Wisconsin State Statutes allows for Cities like the City of Milwaukee to engage in replacing their utility. This is an existing law on the books and we are considering advocating for it to be used by the City of Milwaukee.",
  },
  {
    question: "Why hasn't this been talked about before?",
    answer: "There has not been an organized group who has called for replacing We Energies outside of socialists. Now that socialism is back in Milwaukee, we are looking to call for energy democracy. However, the Milwaukee Common Council in 2014 did discuss creating a plan for energy independence from WE Energies. However, rather than being a serious discussion, it was used as a tactic to combat the rising energy costs for the city. At the time, city alderman on the council did express interest in creating a municipal utility and we could remind them of that effort.",
  },
  {
    question: "When was the last time a city replaced a utility?",
    answer: "The last time a city in Wisconsin bought out their utility company was in 1944 in Medford, Wisconsin. However in 1980, WPPI Energy was formed as a member-owned electric utility service for 51 communities in the Madison area as a way to combat rising energy costs.",
  },
  {
    question: "What about the workers of WE Energies?",
    answer: "The workers of We Energies can and will be protected as we transition. The DSA has a plan to protect the workers and their union rights. The workers of WE Energies and their union structure can be maintained once the municipal utility is created by creating a private company that manages the operations of the utility similar to how the Milwaukee Transit employees are able to have a union despite being county employees.",
  },
  {
    question: "The City of Milwaukee can't even fix a pothole - how can we expect them to deliver reliable power?",
    answer: "Yes, currently, municipal government in Milwaukee is lacking substantially. What we're talking about at Milwaukee DSA is a campaign to call on the City of Milwaukee to replace We Energies. The City of Milwaukee government must improve for this to happen, and winning this campaign will be a part of transforming municipal government in Milwaukee, to make it better in providing all services. This process will take time, and over the course of that time Milwaukee DSA will challenge the citizens of Milwaukee to demand more and better services from their government. When the Sewer Socialists came into power over 100 years ago they made municipal government better and that's what we intend to do. Don't you think that the ruling elites want us to expect poor performance from our government? We can and must change how Milwaukee governs itself and not accept poor services like we are now.",
  },
  {
    question: "How will the City of Milwaukee pay for this?",
    answer: "When we have won this campaign for public ownership of public utilities the City of Milwaukee will need to pay We Energies for the infrastructure we acquire. The price is not known now, and won't be known until a series of hearings in the Chapter 197 process. We can tell you right now it will be a significant investment. The City can pay out of its general fund using tax dollars, or it can finance it using a special type of bond called a revenue bond. This type of bond will protect the City from financial liability, with the proceeds from the sale of the electricity paying back the purchase.",
  },
  {
    question: "Will Milwaukee have utility service during and after the transition?",
    answer: "As we move away from We Energies, Milwaukeeans will have electricity during the entire transition time and afterwards. The Milwaukee utility we create will be much like other municipal utilities in that it may initially rely on a combination of local energy generation and power purchased on what are called \"wholesale markets\", and some electricity may come from We Energies. Electricity purchasing between utilities is very normal and a standard practice for the industry. Currently, even We Energies does not generate all of its own electricity, as it buys some on wholesale markets. As part of creating public ownership of public utilities, regular people in Milwaukee will have a say in where we buy our power, unlike the case now where We Energies calls the shots about electricity sources.",
  },
  {
    question: "Won't the Republicans in Madison just stop Milwaukee from doing this?",
    answer: "Yes, there is a chance that the Republicans in Madison will make a move to stop the City of Milwaukee from using Chapter 197 to replace We Energies. Chapter 197 is state statute, which means that to get rid of the law and stop Milwaukee from replacing We Energies, it would require action from both houses of the legislature and the Governor's signature to repeal Chapter 197. Unless that happens, we have the right to do this, and even at that point there are other possible legal means to achieve this goal.",
  },
  {
    question: "Are there any benefits of creating a municipal utility?",
    answer: "Rates are lower - nationwide municipal electric utilities have rates 15% lower on average than investor owned utilities. Local control and community values - decisions concerning utilities are open and citizens are able to give their input. Reliability - municipal electric utilities have an average of 59 minutes of downtime a year as compared to 133 minutes a year in private utilities.",
  },
  {
    question: "But isn't WE Energies doing a good job with solar energy?",
    answer: "WE Energies has been actively discouraging residential solar panels. Between adding a meter fee for people who make the decision to go solar and drastically lowering the rate that they pay for the \"green\" energy that they purchase (which used to be 22 cents per KWH and is now only 4 cents), WE has made it clear that they would rather just look green than walk the walk. They force solar panel owners to sell them energy that they then sell for more than four times the cost as \"green\" energy, while accusing them of not paying their fair share. A municipal utility could encourage residential solar rather than trying to stomp it out.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-navy-dark py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white text-center mb-16">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`border-b border-white/20 overflow-hidden transition-all duration-300 ${
                openIndex === index ? "border-l-4 border-l-coral pl-4" : ""
              }`}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between py-6 text-left group"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-xl sm:text-2xl font-spectral font-extrabold text-white uppercase tracking-wide group-hover:text-coral transition-colors duration-200 pr-4">
                  {item.question}
                </span>
                <span
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-coral/20 text-coral transition-all duration-300 ${
                    openIndex === index ? "rotate-45 bg-coral text-white" : "group-hover:bg-coral/40"
                  }`}
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`grid transition-all duration-400 ${
                  openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                }}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 text-white/80 text-lg leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
