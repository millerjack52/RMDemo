import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/** Milestones (content only). Positions are computed uniformly by the component. */
type Milestone = {
  year: string;
  title: string;
  body: string;
  side?: "left" | "right"; // optional override; otherwise auto-alternate
};

type RoadStoryProps = {
  milestones?: Milestone[];
  sectionVh?: number;

  /** Sine-wave road params (in SVG viewBox units) */
  periods?: number; // how many full sine periods from top to bottom
  amplitudeX?: number; // horizontal swing (+/-) from center
  topY?: number; // where the road starts (y)
  heightY?: number; // total vertical distance the road travels
};

const SAMPLES = 1400; // for length sampling
const CARD_W = 320;
const ROAD_GAP = 120; // px distance from road centerline to card column
const V_NUDGE = 0; // keep 0; we center with translateY(-50%)

export default function RoadStory({
  milestones = [
    {
      year: "1982",
      title: "Safety Pioneer",
      body: "HEllo",
    },
    {
      year: "1997",
      title: "National Rollout",
      body: "Expanded across the country.Started safety standards.Started safety standards.Started safety standards.Started safety standards.Started safety standards.",
    },
    {
      year: "2010",
      title: "Circular Materials",
      body: "Introduced closed-loop systems.Started safety standards.Started safety standards.Started safety standards.Started safety standards.Started safety standards.Started safety standards.Started safety standards.",
    },
    {
      year: "2024",
      title: "Global Collaboration",
      body: "Partnered internationally.Started safety standards.Started safety standards.Started safety standards.",
    },
  ],
  sectionVh = 220,
  periods = 2,
  amplitudeX = 260,
  topY = 100,
  heightY = 1200,
}: RoadStoryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null); // relative card container
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  const [progress, setProgress] = useState(0); // 0..1
  const [pathLen, setPathLen] = useState(1);
  const [samples, setSamples] = useState<
    Array<{ len: number; x: number; y: number }>
  >([]);
  const [anchorLens, setAnchorLens] = useState<number[]>([]);
  const [visible, setVisible] = useState<boolean[]>(() =>
    milestones.map(() => false)
  );

  const viewBox = { w: 760, h: Math.max(topY + heightY + 120, 900) };
  const centerX = viewBox.w / 2;

  /** Uniform anchors along the road (keep a little top/bottom margin) */
  const anchorsT = useMemo(() => {
    const n = milestones.length;
    if (n <= 1) return [0.5];
    const margin = 0.08; // crop top/bottom so cards don't crowd ends
    return Array.from({ length: n }, (_, i) =>
      lerp(margin, 1 - margin, i / (n - 1))
    );
  }, [milestones.length]);

  /** Build a vertical sine-wave path: x = cx + A*sin(2π*periods*t), y = topY + height*t */
  const pathD = useMemo(() => {
    const steps = Math.max(1.5, Math.floor(periods * 64)); // smoothness
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const t = i / steps; // 0..1
      const x = centerX - amplitudeX * Math.sin(2 * Math.PI * periods * t);
      const y = topY + heightY * t;
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  }, [centerX, amplitudeX, periods, topY, heightY]);

  /** Measure path & sample table */
  useLayoutEffect(() => {
    const p = pathRef.current;
    if (!p || !p.getTotalLength) return;

    const L = p.getTotalLength();
    setPathLen(L);

    const arr: { len: number; x: number; y: number }[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const len = (i / SAMPLES) * L;
      const pt = p.getPointAtLength(len);
      arr.push({ len, x: pt.x, y: pt.y });
    }
    setSamples(arr);

    // Map uniform t-anchors to y positions, then to lengths
    const lens = anchorsT.map((t) => {
      const targetY = topY + heightY * t;
      const hit = arr.find((s) => s.y >= targetY);
      return hit ? hit.len : L;
    });
    setAnchorLens(lens);
  }, [pathD, anchorsT, topY, heightY]);

  /** Recompute on container resize (SVG scales with layout) */
  useEffect(() => {
    if (!frameRef.current) return;
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        const p = pathRef.current;
        if (!p) return;
        const L = p.getTotalLength();
        setPathLen(L);

        const arr: { len: number; x: number; y: number }[] = [];
        for (let i = 0; i <= SAMPLES; i++) {
          const len = (i / SAMPLES) * L;
          const pt = p.getPointAtLength(len);
          arr.push({ len, x: pt.x, y: pt.y });
        }
        setSamples(arr);

        const lens = anchorsT.map((t) => {
          const targetY = topY + heightY * t;
          const hit = arr.find((s) => s.y >= targetY);
          return hit ? hit.len : L;
        });
        setAnchorLens(lens);
      });
    });
    ro.observe(frameRef.current);
    return () => ro.disconnect();
  }, [anchorsT, topY, heightY]);

  /** Scroll progress (rAF throttled) */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ticking = false;
    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const total = Math.max(1, section.getBoundingClientRect().height - vh);
        const y = window.scrollY - section.offsetTop;
        setProgress(Math.min(1, Math.max(0, y / total)));
        ticking = false;
      });
    };

    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  /** Current point along the path */
  const currentLen = progress * pathLen;
  const currentPoint = useMemo(() => {
    const p = pathRef.current;
    if (!p) return { x: 0, y: 0 };
    const pt = p.getPointAtLength(currentLen);
    return { x: pt.x, y: pt.y };
  }, [currentLen]);

  /** Reveal when current y crosses each anchor */
  useEffect(() => {
    if (!samples.length) return;
    const y = currentPoint.y;
    const topMargin = topY + heightY * 0.02; // slight forgiveness
    setVisible(
      anchorsT.map((t) => y >= Math.max(topMargin, topY + heightY * t - 0.5))
    );
  }, [currentPoint, samples.length, anchorsT, topY, heightY]);

  /** Card positions:
   *  - convert SVG anchor (x,y) -> CSS px (y only needed for vertical align)
   *  - compute two fixed columns from the SVG's center in CSS px
   *  - place each card in its column and center it vertically on the anchor
   */
  const cardData = useMemo(() => {
    const svg = svgRef.current;
    const frame = frameRef.current;
    if (!svg || !frame) return [];

    // Columns anchored off the SVG's center in CSS px
    const centerPx = svgToLocal(svg, frame, centerX, 0).x;
    const colLeft = centerPx - ROAD_GAP - CARD_W;
    const colRight = centerPx + ROAD_GAP;

    return milestones.map((ms, i) => {
      const lenAt = anchorLens[i] ?? 0;
      const s = nearestSample(samples, lenAt);
      const anchorPx = svgToLocal(svg, frame, s.x, s.y);

      const side: "left" | "right" =
        ms.side ?? (i % 2 === 0 ? "left" : "right");
      const left = side === "left" ? colLeft : colRight;
      const top = anchorPx.y + V_NUDGE; // center line; transform will -50%

      // Leader in SVG space (keeps line near the road)
      const leader = {
        x1: s.x + (side === "left" ? -8 : 8),
        y1: s.y,
        x2: s.x + (side === "left" ? -24 : 24),
        y2: s.y - 6,
      };

      return { ms, card: { left, top, side }, leader };
    });
  }, [samples, anchorLens, milestones, centerX]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: `${sectionVh}vh` }}
      aria-labelledby="roadstory-heading"
    >
      <div className="sticky top-0">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-4 text-center">
          <p className="text-xs font-bold tracking-[.14em] text-orange-500">
            OUR STORY
          </p>
          <h2
            id="roadstory-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mt-1"
          >
            The Road to Where We Are
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pb-12" ref={frameRef}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
            className="w-full h-[70vh] md:h-[78vh] mx-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.06)]"
            role="img"
            aria-hidden="true"
          >
            {/* Road base */}
            <path
              d={pathD}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={80}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit={1}
              opacity={0.9}
            />
            {/* Center dashed */}
            <path
              d={pathD}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="28 18"
              opacity={0.9}
            />

            {/* Progress (orange), revealed by dashoffset */}
            <path
              ref={pathRef}
              d={pathD}
              fill="none"
              stroke="#F26101"
              strokeWidth={80}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit={1}
              style={{
                strokeDasharray: pathLen,
                strokeDashoffset: Math.max(pathLen - currentLen, 0),
                transition: "stroke-dashoffset 0.08s linear",
                filter:
                  "drop-shadow(0 10px 20px rgba(242,97,1,0.25)) drop-shadow(0 2px 4px rgba(242,97,1,0.25))",
              }}
            />
            <path
              d={pathD}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="28 18"
              style={{
                strokeDashoffset:
                  Math.max(pathLen - currentLen, 0) * (28 / (60 + 28)),
                transition: "stroke-dashoffset 0.08s linear",
              }}
            />

            {/* Leader lines to visible cards (drawn in SVG space) */}
            {cardData.map((c, i) => (
              <line
                key={`leader-${i}`}
                x1={c.leader.x1}
                y1={c.leader.y1}
                x2={c.leader.x2}
                y2={c.leader.y2}
                stroke="#9CA3AF"
                strokeWidth={1.5}
                opacity={visible[i] ? 1 : 0}
                style={{ transition: "opacity .35s ease" }}
              />
            ))}
          </svg>

          {/* Cards outside the road, positioned in CSS pixels; centered vertically on the anchor */}
          <ul className="contents">
            {cardData.map((c, i) => (
              <li
                key={`card-${i}`}
                className="absolute w-[320px] bg-white border border-gray-300 shadow-[0_8px_24px_rgba(0,0,0,.12)] rounded-sm p-4 will-change-transform transition-all duration-400"
                style={{
                  left: clampPx(c.card.left, 8, "calc(100% - 328px)"),
                  top: clampPx(c.card.top, 8, "calc(100% - 8px)"),
                  opacity: visible[i] ? 1 : 0,
                }}
              >
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="font-medium">{milestones[i].year}</span>
                </div>
                <h3 className="text-gray-900 font-semibold mt-2">
                  {milestones[i].title}
                </h3>
                <p className="text-gray-600 text-sm leading-6 mt-1">
                  {milestones[i].body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reduced motion: no transitions */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-all { transition: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------- helpers ---------- */

function nearestSample(
  samples: { len: number; x: number; y: number }[],
  targetLen: number
) {
  if (!samples.length) return { x: 0, y: 0, len: 0 };
  let lo = 0,
    hi = samples.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (samples[mid].len < targetLen) lo = mid + 1;
    else hi = mid;
  }
  const a = samples[Math.max(0, lo - 1)],
    b = samples[lo] ?? samples[samples.length - 1];
  return Math.abs(a.len - targetLen) < Math.abs(b.len - targetLen) ? a : b;
}

/** clamp number (px) between min and max (CSS accepts either px or calc string for max bound) */
function clampPx(n: number, minPx: number, maxCss: string): string {
  return `max(${minPx}px, min(${n}px, ${maxCss}))`;
}

/** Map SVG viewBox coordinates → local CSS pixel coordinates inside `frame` */
function svgToLocal(
  svg: SVGSVGElement,
  frame: HTMLElement,
  x: number,
  y: number
) {
  const svgRect = svg.getBoundingClientRect();
  const frameRect = frame.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  const scaleX = svgRect.width / vb.width;
  const scaleY = svgRect.height / vb.height;
  return {
    x: (x - vb.x) * scaleX + (svgRect.left - frameRect.left),
    y: (y - vb.y) * scaleY + (svgRect.top - frameRect.top),
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
