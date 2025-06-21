import React from "react";
import Hero from "@/components/website/homepage/Hero";
import HeroSearchBox from "@/components/website/homepage/HeroSearchBox";
import QuickLinks from "@/components/website/homepage/QuickLinks";
import RewardsBanner from "@/components/website/homepage/RewardsBanner";
import ExploreAccommodations from "@/components/website/homepage/ExploreAccommodations";
import ExploreMovies from "@/components/website/homepage/ExploreMovies";
import WhyChooseUs from "@/components/website/homepage/WhyChooseUs";
import VendorBanner from "@/components/website/homepage/VendorBanner";

const Page = () => {
  return (
    <div>
      <Hero />
      <HeroSearchBox />
      <QuickLinks />
      <RewardsBanner />
      <ExploreAccommodations />
      <VendorBanner />
      {/* <WhyChooseUs /> */}
      {/* <ExploreMovies /> */}
    </div>
  );
};

export default Page;
