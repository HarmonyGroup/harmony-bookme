"use client";

import React from "react";
import { useSession } from "next-auth/react";
import EventDashboard from "@/components/vendor/events/EventDashboard";
import AccommodationsDashboard from "@/components/vendor/dashboard/AccommodationsDashboard";
import MoviesCinemaDashboard from "@/components/vendor/movies-and-cinema/MoviesCinemaDashboard";
import LeisureDashboard from "@/components/vendor/leisure/LeisureDashboard";
// import WelcomeModal from "@/components/vendor/dashboard/WelcomeModal";

const Page = () => {
  // const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const { data } = useSession();

  return (
    <>
      {data?.user?.vendorAccountPreference === "events" && <EventDashboard />}
      {data?.user?.vendorAccountPreference === "accommodations" && (
        <AccommodationsDashboard />
      )}
      {data?.user?.vendorAccountPreference === "movies_and_cinema" && (
        <MoviesCinemaDashboard />
      )}
      {data?.user?.vendorAccountPreference === "leisure" && (
        <LeisureDashboard />
      )}

      {/* <WelcomeModal showModal={showWelcomeModal} toggleModal={() => setShowWelcomeModal(!showWelcomeModal)} /> */}
    </>
  );
};

export default Page;