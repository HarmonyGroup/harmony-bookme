import React from "react";
import ExploreMoviesCard from "./ExploreMoviesCard";

const ExploreMovies = () => {
  return (
    <section className="bg-primary/5 py-16">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <h1 className="text-[#183264] text-center text-base md:text-xl/tight font-semibold">
            Looking for something to watch?
          </h1>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 mt-12 md:mt-32">
            <ExploreMoviesCard />
            <ExploreMoviesCard />
            <ExploreMoviesCard />
        </div>
      </div>
    </section>
  );
};

export default ExploreMovies;
