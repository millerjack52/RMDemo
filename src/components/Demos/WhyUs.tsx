import React, { useMemo, useState } from "react";
import WhyUsBox from "./WhyUsBox";

type BoxConfig = {
  title: string;
  subtitle: string;
  w: string; // e.g. "65%"
  bg: string;
  renderExpanded: () => React.ReactNode;
};

type RowConfig = { boxes: BoxConfig[] };

export default function WhyUs() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const rows: RowConfig[] = useMemo(
    () => [
      {
        boxes: [
          {
            title: "Our Approach",
            subtitle: "Approach Subtitle",
            w: "65%",
            bg: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2",
            renderExpanded: () => (
              <ExpandedPanel
                tag="SUSTAINABILITY"
                heading="Committed to making a positive impact."
                body="At our core, sustainability isn’t just a goal—it’s a commitment. We’re dedicated to reducing our environmental footprint through innovative initiatives that make a real difference. From eco-friendly practices to wellness-focused strategies, we strive to create a greener, healthier future."
                cta="Find out more about our efforts to affect positive change >"
                image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
              />
            ),
          },
          {
            title: "Our Sustainability Mission",
            subtitle: "Approach Subtitle",
            w: "35%",
            bg: "https://www.forestandbird.org.nz/sites/default/files/styles/ratio_3_x_2_small_/public/2018-03/about-us_x2.jpg?itok=NHizqB3t",
            renderExpanded: () => (
              <ExpandedPanel
                tag="IMPACT"
                heading="Designing circular systems."
                body="We’re streamlining recycling logistics, material recovery, and end-of-life processing to keep products in use longer and reduce waste."
                cta="See our initiatives >"
                image="https://www.forestandbird.org.nz/sites/default/files/styles/ratio_3_x_2_small_/public/2018-03/about-us_x2.jpg?itok=NHizqB3t"
              />
            ),
          },
        ],
      },
      {
        boxes: [
          {
            title: "Our Team",
            subtitle:
              "We can screen print literally anything its so cool, got heaps of colors too",
            w: "40%",
            bg: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
            renderExpanded: () => (
              <ExpandedPanel
                tag="PEOPLE"
                heading="Experts who care."
                body="Cross-functional practitioners—from design to supply chain—align on measurable outcomes that benefit customers and communities."
                cta="Meet the team >"
                image="https://images.unsplash.com/photo-1524504388940-b1c1722653e1"
              />
            ),
          },
          {
            title: "Comprehensive Range",
            subtitle: "Approach Subtitle",
            w: "60%",
            bg: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            renderExpanded: () => (
              <ExpandedPanel
                tag="RANGE"
                heading="Workwear built for performance."
                body="We offer durable, comfortable, and ethically-made gear fit for demanding environments—without sacrificing style."
                cta="Browse the range >"
                image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
              />
            ),
          },
        ],
      },
      {
        boxes: [
          {
            title: "A Good Reason",
            subtitle: "Approach Subtitle",
            w: "55%",
            bg: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
            renderExpanded: () => (
              <ExpandedPanel
                tag="VALUES"
                heading="Doing the right thing."
                body="From fair pay to local partnerships, we choose long-term value over short-term wins—because trust is everything."
                cta="Learn about our values >"
                image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
              />
            ),
          },
          {
            title: "More Text",
            subtitle: "Approach Subtitle",
            w: "45%",
            bg: "https://www.shopworx.com/wp-content/uploads/2024/06/embroidery-technology.jpg",
            renderExpanded: () => (
              <ExpandedPanel
                tag="STORY"
                heading="Our journey continues."
                body="We’re constantly iterating with customers, suppliers, and communities to push what’s possible for responsible workwear."
                cta="Read more >"
                image="https://www.shopworx.com/wp-content/uploads/2024/06/embroidery-technology.jpg"
              />
            ),
          },
        ],
      },
    ],
    []
  );

  const expandedRowIndex =
    expandedIndex === null ? null : Math.floor(expandedIndex / 2);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* HERO */}
      <section className="flex items-center justify-center py-24 px-4 sm:px-6 md:px-0">
        <div className="text-left">
          <h1 className="text-[60px] sm:text-[80px] md:text-[100px] font-light leading-[55px] sm:leading-[60px] md:leading-[65px]">
            <span className="block">WHY</span>
            <span className="relative block leading-[60px] sm:leading-[65px] md:leading-[70px]">
              <span className="text-orange-500 font-light">US</span>
              <img
                src="/images/picturelogoblack.png"
                alt="Company logo"
                className="absolute bottom-0 left-[calc(100%-0.8em)] md:left-[calc(100%-1em)] h-[0.6em] md:h-[0.7em] w-auto translate-y-[3px] md:translate-y-[4px]"
              />
            </span>
          </h1>
        </div>
      </section>

      {/* GRID */}
      <div className="max-w-6xl mx-auto grid gap-4 px-4 md:px-6 pb-20">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex flex-col md:flex-row gap-4">
            {row.boxes.map((box, bIdx) => {
              const index = rIdx * 2 + bIdx;
              return (
                // Important: wrapper disappears on desktop so widths (65/35 etc.) are unchanged
                <div key={index} className="block w-full md:contents">
                  <WhyUsBox
                    index={index}
                    expandedIndex={expandedIndex}
                    setExpandedIndex={setExpandedIndex}
                    rowIndex={rIdx}
                    expandedRowIndex={expandedRowIndex}
                    title={box.title}
                    subtitle={box.subtitle}
                    width={box.w}
                    bgUrl={box.bg}
                    renderExpanded={box.renderExpanded}
                    grayscaleWhenCollapsed
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Expanded content — mobile fills width/flows, desktop unchanged */
function ExpandedPanel({
  tag,
  heading,
  body,
  cta,
  image,
}: {
  tag: string;
  heading: string;
  body: string;
  cta: string;
  image: string;
}) {
  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Text: full width on mobile, 60% cap on desktop */}
      <div className="w-full md:max-w-[60%]">
        <div className="text-xs tracking-wide md:text-small uppercase text-gray-500">
          {tag}
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-heading text-orange-500 mt-2 mb-3">
          {heading}
        </h2>
        <p className="text-sm sm:text-base md:text-body text-gray-700 mb-4">
          {body}
        </p>
        <a
          href="#"
          className="inline-block mt-2 font-semibold text-gray-800 hover:text-orange-500 text-sm sm:text-base"
        >
          {cta}
        </a>
      </div>

      {/* Image: full width on mobile; fixed framed box on desktop */}
      <div className="relative w-full md:w-[300px] md:h-[400px] md:ml-auto md:mr-10 mt-6 md:mt-0 aspect-[3/4] md:aspect-auto">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 border-[14px] md:border-[35px] border-orange-500/70 pointer-events-none"></div>
      </div>
    </div>
  );
}
