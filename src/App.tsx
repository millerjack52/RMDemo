import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import { OurJourney } from "./components/Demos/OurJourney";
import WhyUs from "./components/Demos/WhyUs";
import RoadStory from "./components/Demos/RoadStory";
import InfoBoxes from "./components/Demos/InfoBoxes";
import FindAgent from "./components/Demos/FindAgent";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h1 className="font-bold text-lg">Road Materials Component Demos</h1>
        <img src="images/picturelogoblack.png" alt="Logo" className="h-8 w-8" />
        <nav className="space-x-4">
          <Link to="/" className="hover:text-orange-500">
            Home
          </Link>
          <Link to="/our-journey" className="hover:text-orange-500">
            Our Journey
          </Link>
          <Link to="/why-us" className="hover:text-orange-500">
            Why Us
          </Link>
          <Link to="/road-story" className="hover:text-orange-500">
            Our Story
          </Link>
          <Link to="/find-agent" className="hover:text-orange-500">
            Find an Agent
          </Link>
        </nav>
      </header>

      <main className="p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/our-journey" element={<OurJourney />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/info-boxes" element={<InfoBoxes />} />
          <Route path="/find-agent" element={<FindAgent />} />
          <Route
            path="/road-story"
            element={
              <RoadStory
                milestones={[
                  {
                    year: "1982",
                    title: "Safety Pioneer",
                    body: "Started safety standards.",
                  },
                  {
                    year: "1997",
                    title: "National Rollout",
                    body: "Expanded across the country.",
                  },
                  {
                    year: "2010",
                    title: "Circular Materials",
                    body: "Introduced closed-loop systems.",
                  },
                  {
                    year: "2024",
                    title: "Global Collaboration",
                    body: "Partnered internationally.",
                  },
                ]}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
