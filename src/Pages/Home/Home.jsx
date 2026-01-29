
import { useEffect } from "react";
import Banner from "./Banner/Banner";
import CommunitySpotlight from "./CommunitySpotlight/CommunitySpotlight";
import FeaturedEvents from "./FeaturedEvents/FeaturedEvents";
import HeroStats from "./HeroStats/HeroStats";
// import Sponsors from "./Sponsor/Sponsorship";
import Team from "./Team/Team";
// import TechStack from "./TechStack/TechStack";
import Testimonials from "./Testimonials/Testimonials";
import Timeline from "./Timeline/Timeline";


const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 font-sans">
      <Banner />
      <HeroStats />
      <FeaturedEvents />
      <Testimonials />
      <CommunitySpotlight />
      <Timeline />
      {/* <TechStack /> */}
      <Team />
      {/* <Sponsors /> */}
    </div>
  );
};

export default Home;