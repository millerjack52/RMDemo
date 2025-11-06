// src/components/demos/FindAgent.tsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";

// Agents + rough percentage positions (tweak visually if needed)
const AGENTS = [
  {
    id: "akl",
    city: "Auckland",
    pos: { left: 59, top: 36 }, // %
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    person: "Sam Thompson",
    phone: "+64 9 555 0199",
    email: "sam.thompson@example.co.nz",
    blurb:
      "North Island coverage. Industrial PPE & custom branding specialist.",
  },
  {
    id: "wlg",
    city: "Wellington",
    pos: { left: 62, top: 54 },
    photo:
      "https://images.unsplash.com/photo-1573496529574-be85d6a60704?q=80&w=800&auto=format&fit=crop",
    person: "Maya Chen",
    phone: "+64 4 555 0123",
    email: "maya.chen@example.co.nz",
    blurb: "Public sector & infrastructure accounts across lower North Island.",
  },
  {
    id: "chc",
    city: "Christchurch",
    pos: { left: 52, top: 64 },
    photo:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop",
    person: "Ben Walker",
    phone: "+64 3 555 0144",
    email: "ben.walker@example.co.nz",
    blurb: "South Island hub. Civil & manufacturing, on-site support.",
  },
  {
    id: "cwl",
    city: "Cromwell",
    pos: { left: 32, top: 70 },
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
    person: "Aria Patel",
    phone: "+64 3 555 0177",
    email: "aria.patel@example.co.nz",
    blurb: "Central Otago & construction. Mining/quarries specialist.",
  },
  {
    id: "dud",
    city: "Dunedin",
    pos: { left: 42.5, top: 73 },
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
    person: "Chris James",
    phone: "+64 3 555 0188",
    email: "chris.james@example.co.nz",
    blurb: "Ports & logistics. Marine and cold-weather programmes.",
  },
] as const;

type Agent = (typeof AGENTS)[number];

export default function FindAgent() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active: Agent | null = useMemo(
    () => AGENTS.find((a) => a.id === activeId) ?? null,
    [activeId]
  );

  // Close popover on Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Map container ref (used to clamp popover inside)
  const mapRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto">
      <header className="mb-4 sm:mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold">Find an Agent</h1>
        <p className="text-gray-600 mt-1">
          Click a city pin to view contact details.
        </p>
      </header>

      <div className="grid md:grid-cols-[2fr_1fr] gap-6 sm:gap-8 items-start">
        {/* Map box */}
        <div className="relative w-full border border-gray-200 shadow select-none">
          {/* Maintain tall NZ aspect */}
          <div className="relative w-full aspect-[1]" ref={mapRef}>
            <img
              src="https://media.istockphoto.com/id/470865772/vector/illustrated-map-of-the-country-of-new-zealand.jpg?s=612x612&w=0&k=20&c=QInu73DvhKEMefrsTI2zNDLugdUOsOi97Harklpm1IM="
              alt="Map of New Zealand"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              draggable={false}
            />

            {/* Click-outside overlay (only when a popover is open) */}
            {active && (
              <button
                type="button"
                aria-label="Close agent popover"
                onClick={() => setActiveId(null)}
                className="absolute inset-0 z-10 bg-transparent"
              />
            )}

            {/* Pins */}
            {AGENTS.map((a) => (
              <Pin
                key={a.id}
                xPct={a.pos.left}
                yPct={a.pos.top}
                label={a.city}
                active={activeId === a.id}
                onClick={(e) => {
                  e.stopPropagation(); // don't trigger overlay
                  setActiveId(a.id);
                }}
              />
            ))}

            {/* On-map popover (rendered above overlay), clamped to map box */}
            {active && (
              <MapPopover
                xPct={active.pos.left}
                yPct={active.pos.top}
                parentRef={mapRef}
                onClose={() => setActiveId(null)}
              >
                <AgentMiniCardLarge agent={active} />
              </MapPopover>
            )}
          </div>
        </div>

        {/* Side panel (optional extra detail) */}
        <aside className="md:sticky md:top-10 border border-gray-200 shadow p-4">
          {active ? (
            <AgentCard agent={active} onClear={() => setActiveId(null)} />
          ) : (
            <div className="text-gray-600 text-sm">
              Select a city pin to see details here.
              <div className="mt-3">
                <strong>Coverage:</strong>
                <ul className="list-disc ml-5 mt-1 text-gray-700">
                  <li>North Island: Auckland, Wellington</li>
                  <li>South Island: Christchurch, Cromwell, Dunedin</li>
                </ul>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Pins + Popover ---------------- */

function Pin({
  xPct,
  yPct,
  label,
  active,
  onClick,
}: {
  xPct: number;
  yPct: number;
  label: string;
  active: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none transform transition duration-200 hover:scale-110 active:scale-125 z-20 touch-manipulation"
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
      aria-pressed={active}
      aria-label={`Open details for ${label}`}
    >
      <div className="flex flex-col items-center">
        {/* square head (on TOP) */}
        <div
          className={[
            "w-3 h-3 bg-orange-600 shadow transition-transform duration-200",
            active ? "scale-125" : "group-hover:scale-110",
          ].join(" ")}
        />
        {/* stem under the head */}
        <div className="mt-0.5 w-0.5 h-5 bg-orange-600 transition-transform duration-200" />
      </div>
      <div className="mt-1 text-xs bg-black text-white px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </div>
    </button>
  );
}

function MapPopover({
  xPct,
  yPct,
  children,
  onClose,
  parentRef,
}: {
  xPct: number;
  yPct: number;
  children: React.ReactNode;
  onClose: () => void;
  parentRef: any;
}) {
  const [show, setShow] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Pixel position clamped inside parent
  const [pos, setPos] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });

  // small visual gap between pin and popover
  const GAP = 12;

  const recalc = () => {
    const parent = parentRef.current;
    const panel = panelRef.current;
    if (!parent || !panel) return;

    const parentRect = parent.getBoundingClientRect();

    // Convert pin percent to pixel point inside parent
    const xPin = (xPct / 100) * parentRect.width;
    const yPin = (yPct / 100) * parentRect.height;

    // Desired top-left (anchor to top-left of panel, above-left of pin)
    const desiredLeft = xPin - panel.offsetWidth - GAP;
    const desiredTop = yPin - panel.offsetHeight - GAP;

    // Clamp within [0, parentSize - panelSize]
    const maxLeft = parentRect.width - panel.offsetWidth;
    const maxTop = parentRect.height - panel.offsetHeight;

    const clampedLeft = Math.max(
      0,
      Math.min(desiredLeft, Math.max(0, maxLeft))
    );
    const clampedTop = Math.max(0, Math.min(desiredTop, Math.max(0, maxTop)));

    setPos({ left: clampedLeft, top: clampedTop });
  };

  useLayoutEffect(() => {
    // trigger fade-in on mount
    const id = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(id);
  }, []);

  useLayoutEffect(() => {
    recalc();
    // Recalc on resize
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xPct, yPct, parentRef, show]);

  // Stop clicks inside from closing (overlay is behind this)
  function stop(e: React.MouseEvent) {
    e.stopPropagation();
  }

  // Autofocus first interactive element on open
  useEffect(() => {
    if (!show) return;
    const el = panelRef.current?.querySelector<HTMLElement>(
      'a,button,[tabindex]:not([tabindex="-1"])'
    );
    el?.focus();
  }, [show]);

  return (
    <div
      className="absolute z-20"
      // place using pixels inside the map box; never overflow thanks to clamping
      style={{ left: pos.left, top: pos.top }}
      onClick={stop}
      role="dialog"
      aria-modal="false"
    >
      <div
        className={[
          "transition duration-200",
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
        ].join(" ")}
      >
        <div
          ref={panelRef}
          className="bg-white border border-gray-200 shadow-xl p-4 w-[min(92vw,24rem)] sm:w-96"
        >
          {children}
          <div className="mt-4 flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 border border-gray-300 text-sm hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Agent cards ---------------- */

function AgentMiniCardLarge({ agent }: { agent: Agent }) {
  return (
    <div>
      {/* Accent top bar */}
      <div className="h-1 bg-orange-600 mb-3" />

      {/* Header */}
      <div className="flex items-start gap-4">
        <img
          src={agent.photo}
          alt={agent.person}
          className="w-32 h-32 object-cover"
        />
        <div className="flex-1">
          <div className="text-2xl font-semibold leading-tight">
            {agent.city}
          </div>
          <div className="text-gray-900 font-medium">{agent.person}</div>
          <div className="text-sm text-gray-600 mt-1">{agent.blurb}</div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-4" />

      {/* Quick contact rows */}
      <div className="space-y-1 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Phone</span>
          <a
            href={`tel:${agent.phone.replace(/\s+/g, "")}`}
            className="text-gray-900 hover:underline"
          >
            {agent.phone}
          </a>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Email</span>
          <a
            href={`mailto:${agent.email}`}
            className="text-gray-900 hover:underline truncate max-w-[60%] text-right"
            title={agent.email}
          >
            {agent.email}
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <a
          href={`mailto:${agent.email}`}
          className="px-3 py-2 bg-orange-600 text-white text-sm hover:bg-orange-700 text-center transition"
        >
          Email {agent.person.split(" ")[0]}
        </a>
        <a
          href={`tel:${agent.phone.replace(/\s+/g, "")}`}
          className="px-3 py-2 border border-orange-600 text-orange-600 text-sm hover:bg-orange-50 text-center transition"
        >
          Call {agent.phone}
        </a>
      </div>
    </div>
  );
}

/* Side panel card stays the same (compact) */
function AgentCard({ agent, onClear }: { agent: Agent; onClear: () => void }) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <img
          src={agent.photo}
          alt={agent.person}
          className="w-28 h-28 object-cover"
        />
        <div className="flex-1">
          <div className="text-xl font-semibold">{agent.city}</div>
          <div className="text-gray-800">{agent.person}</div>
          <div className="text-sm text-gray-600 mt-1">{agent.blurb}</div>
          <div className="text-sm mt-3">
            <div>
              <span className="text-gray-500">Phone:</span> {agent.phone}
            </div>
            <div>
              <span className="text-gray-500">Email:</span> {agent.email}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onClear}
          className="px-3 py-2 border border-gray-300 text-sm hover:bg-gray-50"
        >
          Close
        </button>
        <a
          href={`mailto:${agent.email}`}
          className="px-3 py-2 bg-orange-600 text-white text-sm hover:bg-orange-700"
        >
          Email agent
        </a>
        <a
          href={`tel:${agent.phone.replace(/\s+/g, "")}`}
          className="px-3 py-2 border border-orange-600 text-orange-600 text-sm hover:bg-orange-50"
        >
          Call
        </a>
      </div>
    </div>
  );
}
