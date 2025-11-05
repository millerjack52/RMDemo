import { useEffect, useRef } from "react";

/** --------------------------------
 *  Config
 *  -------------------------------- */
type Milestone = {
  title: string;
  description: string;
  summary: string;
  side: "left" | "right";
};

const MILESTONES: Milestone[] = [
  {
    title: "Recycling Infrastructure Built",
    description:
      "Established our first comprehensive uniform recycling facility in Dunedin, setting the foundation for circular economy practices across New Zealand workwear industry.",
    summary: "Building the foundation for sustainable practices",
    side: "left",
  },
  {
    title: "Carbon Partnership Network",
    description:
      "Formed strategic alliances with Cargill and local environmental organizations to accelerate our carbon reduction initiatives across the entire supply chain.",
    summary: "Expanding our environmental impact through partnerships",
    side: "right",
  },
  {
    title: "Community Education Programs",
    description:
      "Launched sustainability workshops across Otago, engaging over 2,000 community members annually in environmental awareness.",
    summary: "Empowering communities with sustainable knowledge",
    side: "left",
  },
  {
    title: "Native Tree Restoration",
    description:
      "Partnered with Okakanui Trust to plant 5,000+ native trees, contributing to ecosystem restoration and carbon sequestration.",
    summary: "Restoring New Zealand's natural heritage",
    side: "right",
  },
  {
    title: "Closed-Loop Uniforms",
    description:
      "Scaled a closed-loop program so end-of-life garments are turned into feedstock for new materials—minimizing landfill.",
    summary: "Circular by design",
    side: "left",
  },
];

/** Page scroll length for this section (no locking) */
const DURATION_VH = 228;

/** --------------------------------
 *  Page Component
 *  -------------------------------- */
export function OurJourneyPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // CSS vars: 50vh bar, centered => 25vh top/bottom margins
    section.style.setProperty("--oj-height", `${DURATION_VH}vh`);
    section.style.setProperty("--oj-track-height", `180vh`);
    section.style.setProperty("--oj-track-top", `5vh`);
    section.style.setProperty("--oj-cards", `${MILESTONES.length}`);

    let raf = 0;

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight || document.documentElement.clientHeight;

        // Reveal when a card center crosses the viewport center (50vh)
        const viewportCenter = vh * 0.5;
        const leadPx = 16;
        itemRefs.current.forEach((el) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const center = r.top + r.height / 2;
          if (center <= viewportCenter + leadPx) el.classList.add("is-visible");
          else el.classList.remove("is-visible");
        });
      });
    };

    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <>
      <section id="journey" className="ourjourney" ref={sectionRef}>
        <style>{`
          :root { --accent: #f26101; }

          .ourjourney {
            background:#f9fafb;
            height: var(--oj-height, 350vh);  /* taller than screen so page scrolls */
            padding: 0;
            position: relative;
          }

          .oj-sticky {
            position: sticky;
            top: 0;
            height: 300vh;       /* viewport pinned while we scroll through */
            display: flex;
            flex-direction: column;
          }

          .oj-container { max-width: 1100px; margin: 0 auto; padding: 22px 18px; width: 100%; }
          .oj-eyebrow { color: var(--accent); font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; text-align:center; }
          .oj-title   { margin: 6px 0 10px; font-size: clamp(24px, 3.6vw, 36px); color: #111; font-weight: 700; text-align:center; }

          /* 50vh track with 25vh margins (top & bottom) */
          .oj-track {
            position: relative;
            height: var(--oj-track-height, 70vh);
            margin-top: var(--oj-track-top, 5vh);
            margin-bottom: var(--oj-track-top, 5vh);
          }
          .oj-track::before {
            content: "";
            position: absolute;
            left: 50%;
            top: 0; bottom: 0;
            width: 1px; background: #d1d5db;
            display: none;
          }
          @media (min-width:768px){ .oj-track::before { display:block; } }

          /* Progress circle stays centered (sticky @ 50vh) */
          .oj-marker {
            position: sticky;
            top: 50vh;                /* center of viewport */
            left: 50%;
            transform: translate(-50%, -50%);
            width: 14px; height: 14px;
            background: var(--accent);
            border-radius: 999px;
            z-index: 2;
            will-change: transform;
            backface-visibility: hidden;
            display: none;
          }
          @media (min-width:768px){ .oj-marker { display:block; } }

          /* Five rows inside the 50vh track; no overlap, responsive spacing */
          .oj-list {
            position: relative;
            height: 100%;
            display: grid;
            grid-template-rows: repeat(var(--oj-cards, 5), 1fr);
            align-items: stretch;
          }

          .oj-item { display: grid; grid-template-columns: 1fr; gap: 10px; align-items: start; }
          @media (min-width:768px){
            .oj-item { grid-template-columns: 1fr 1fr; gap: 16px; }
            .oj-item.right { direction: rtl; }
            .oj-item.right * { direction: ltr; }
          }

          .oj-card {
            background:#fff;
            border: 1px solid #fb923c;
            padding: 12px 14px;       /* compact so five fit comfortably */
            box-shadow: 0 1px 2px rgba(0,0,0,.04);
          }
          .oj-kicker  { font-size: 13px; font-weight: 700; color:#0f172a; margin: 0 0 6px; }
          .oj-h3      { font-size: 18px; font-weight: 700; color:#0f172a; margin: 0 0 6px; }
          .oj-p       { font-size: 14px; line-height: 1.5; color:#374151; margin: 0 0 8px; }
          .oj-summary { font-size: 13px; color: var(--accent); font-weight: 700; margin: 0; }

          .oj-dot { display: none; }
          @media (min-width:768px){
            .oj-dot { display:block; position: relative; height: 0; }
            .oj-dot::after {
              content:"";
              position:absolute; left:50%; transform:translate(-50%, -8px);
              width: 12px; height: 12px; background: var(--accent); border-radius: 999px; opacity:.15;
            }
          }

          /* Reveal animation toggled when a card crosses the centered marker */
          .oj-cardwrap {
            opacity: 0;
            transform: translateY(12px) translateX(var(--slide-x, 0));
            transition: opacity .35s ease, transform .35s ease;
            will-change: opacity, transform;
          }
          .oj-item.left  .oj-cardwrap { --slide-x: -14px; }
          .oj-item.right .oj-cardwrap { --slide-x:  14px; }
          .oj-cardwrap.is-visible { opacity: 1; transform: translateY(0) translateX(10); }

          @media (prefers-reduced-motion: reduce) {
            .oj-marker { display: none !important; }
            .oj-cardwrap { transition: none !important; opacity: 1 !important; transform: none !important; }
          }
        `}</style>

        <div className="oj-sticky">
          <div className="oj-container">
            <div className="oj-eyebrow">OUR JOURNEY</div>
            <h2 className="oj-title">What We've Done So Far</h2>
          </div>

          <div className="oj-container" style={{ position: "relative" }}>
            <div className="oj-track" ref={trackRef}>
              {/* Centered (sticky) marker */}
              <div className="oj-marker" aria-hidden="true" />

              <div className="oj-list">
                {MILESTONES.map((m, i) => (
                  <div
                    key={i}
                    className={`oj-item ${
                      m.side === "right" ? "right" : "left"
                    }`}
                  >
                    <div
                      className="oj-cardwrap"
                      ref={(el) => {
                        if (el) itemRefs.current[i] = el;
                      }}
                    >
                      <div className="oj-card">
                        <div className="oj-kicker">
                          Notable sustainable practice
                        </div>
                        <div className="oj-h3">{m.title}</div>
                        <p className="oj-p">{m.description}</p>
                        <p className="oj-summary">{m.summary}</p>
                      </div>
                    </div>
                    <div className="oj-dot" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { OurJourneyPage as OurJourney };
export default OurJourneyPage;
