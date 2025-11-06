import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-6">Design Demos</h1>
      <p className="text-gray-600 mb-10 max-w-md sm:max-w-lg">
        Explore our collection of interactive design components and motion
        demos.
      </p>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {[
          { to: "/our-journey", label: "Our Journey" },
          { to: "/why-us", label: "Why Us" },
          { to: "/road-story", label: "Road to Where We Are" },
          { to: "/info-boxes", label: "Info Boxes" },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="bg-orange-500 text-white px-6 py-3 sm:px-8 sm:py-3 hover:bg-orange-600 transition-colors duration-300 text-sm sm:text-base"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
