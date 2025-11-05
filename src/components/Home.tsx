import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-4xl font-semibold mb-6">Design Demos</h1>
      <p className="text-gray-600 mb-10 max-w-lg">
        Explore our collection of interactive design components and motion
        demos.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        <Link
          to="/our-journey"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
        >
          Our Journey
        </Link>
        <Link
          to="/why-us"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
        >
          Why Us
        </Link>
        <Link
          to="/road-story"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
        >
          Road to Where We Are
        </Link>
        <Link
          to="/info-boxes"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
        >
          Info Boxes
        </Link>
      </div>
    </div>
  );
}
