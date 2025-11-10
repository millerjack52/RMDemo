import React from "react";
import { ChevronRight, X } from "lucide-react";

export type WhyUsBoxProps = {
  index: number;
  expandedIndex: number | null;
  setExpandedIndex: (i: number | null) => void;
  rowIndex: number;
  expandedRowIndex: number | null;
  title: string;
  subtitle: string;
  width: string;
  bgUrl: string;
  renderExpanded: () => React.ReactNode;
  grayscaleWhenCollapsed?: boolean;
};

export default function WhyUsBox({
  index,
  expandedIndex,
  setExpandedIndex,
  rowIndex,
  expandedRowIndex,
  title,
  subtitle,
  width,
  bgUrl,
  renderExpanded,
  grayscaleWhenCollapsed = true,
}: WhyUsBoxProps) {
  const isExpanded = expandedIndex === index;
  const isAnyOpen = expandedIndex !== null;
  const isInExpandedRow = expandedRowIndex === rowIndex;
  const isCollapsed = isAnyOpen && !isExpanded && isInExpandedRow;

  const titleWords = title.split(" ");

  return (
    <div
      className={`relative flex items-end justify-between text-white cursor-pointer
                  transition-all duration-500 ease-in-out group
                  /* allow content to overflow naturally on mobile when expanded */
                  overflow-visible md:overflow-hidden
                  ${
                    isExpanded
                      ? "h-auto md:h-[400px] flex-[1_1_100%]"
                      : isCollapsed
                      ? "h-0 md:h-[240px] opacity-0 md:opacity-0 pointer-events-none md:pointer-events-none m-0 p-0 flex-[0_1_0%]"
                      : "h-[220px] md:h-[240px]"
                  }`}
      style={{
        // Preserve desktop percentage widths; mobile stacks so this is ignored there
        flexBasis: !isExpanded && !isCollapsed ? width : undefined,
      }}
      onClick={() => setExpandedIndex(isExpanded ? null : index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setExpandedIndex(isExpanded ? null : index);
        }
      }}
    >
      {/* Background image (hide on mobile when expanded so the flow panel owns the space) */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-500
          ${isExpanded ? "hidden md:block" : ""}
          ${
            grayscaleWhenCollapsed
              ? isExpanded
                ? "grayscale-0"
                : "grayscale"
              : ""
          }
          group-hover:scale-105`}
        style={{ backgroundImage: `url(${bgUrl})` }}
      />

      {/* Overlay (same visibility as background) */}
      <div
        className={`absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300
          ${isExpanded ? "hidden md:block" : ""}`}
      />

      {/* Tile text — hide on mobile when expanded to let panel take full width */}
      <div
        className={`relative z-10 flex flex-col justify-end p-5 md:p-8 leading-tight ${
          isExpanded ? "hidden md:flex" : ""
        }`}
      >
        <h2
          className="text-3xl md:text-4xl font-normal text-white transition-colors duration-300 group-hover:text-orange-500 leading-[0.8] md:leading-[0.7] tracking-tight"
          style={{
            WebkitTextStroke: "1px white",
            WebkitTextFillColor: "white",
          }}
        >
          {titleWords.map((word, i) => (
            <div key={i}>{word}</div>
          ))}
        </h2>
        <p className="text-sm md:text-base font-normal text-white/90 mt-2 leading-[0.8] md:leading-[0.6] tracking-tight">
          {subtitle}
        </p>
      </div>

      {/* Arrow — also hidden on mobile when expanded */}
      <div
        className={`relative z-10 items-center justify-center pr-4 pb-4 md:pr-6 md:pb-6 ${
          isExpanded ? "hidden md:flex" : "flex"
        }`}
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:text-orange-500" />
      </div>

      {/* Expanded content: relative + w-full on mobile, absolute overlay on desktop (unchanged) */}
      {isExpanded && (
        <div className="relative w-full md:absolute md:inset-0 z-20 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 p-6 md:p-10 animate-slideIn">
          {renderExpanded()}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandedIndex(null);
            }}
            className="absolute top-2 right-2 md:top-0 md:right-0 bg-orange-500 hover:bg-orange-500/80 text-white p-2 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
