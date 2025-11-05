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

  // Split title into words for stacked layout
  const titleWords = title.split(" ");

  return (
    <div
      className={`relative flex items-end justify-between text-white cursor-pointer overflow-hidden transition-all duration-500 ease-in-out group ${
        isExpanded
          ? "flex-[1_1_100%] h-[400px]"
          : isCollapsed
          ? "flex-[0_1_0%] opacity-0 pointer-events-none h-[240px]"
          : "h-[240px]"
      }`}
      style={{
        flexBasis: !isExpanded && !isCollapsed ? width : undefined,
      }}
      onClick={() => setExpandedIndex(isExpanded ? null : index)}
    >
      {/* Background image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
          grayscaleWhenCollapsed
            ? isExpanded
              ? "grayscale-0"
              : "grayscale"
            : ""
        } group-hover:scale-105`}
        style={{ backgroundImage: `url(${bgUrl})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

      {/* Text content */}
      <div className="relative z-10 flex flex-col justify-end p-8 leading-tight">
        <h2
          className="text-4xl font-normal text-white transition-colors duration-300 group-hover:text-orange-500 leading-[0.7] tracking-tight"
          style={{
            WebkitTextStroke: "1px white",
            WebkitTextFillColor: "white",
          }}
        >
          {titleWords.map((word, i) => (
            <div key={i}>{word}</div>
          ))}
        </h2>
        <p className="text-base font-normal text-white/90 mt-2 leading-[0.6] tracking-tight">
          {subtitle}
        </p>
      </div>

      {/* Arrow */}
      <div className="relative z-10 flex items-center justify-center pr-6 pb-6">
        <ChevronRight className="w-8 h-8 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:text-orange-500" />
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 p-10 animate-slideIn">
          {renderExpanded()}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandedIndex(null);
            }}
            className="absolute top-0 right-0 bg-orange-500 hover:bg-orange-500/80 text-white p-2 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
