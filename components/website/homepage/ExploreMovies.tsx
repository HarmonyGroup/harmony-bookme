// Removed unused eslint-disable directive

"use client";

import React, { useState } from "react";
import ExploreMoviesCard from "./ExploreMoviesCard";
import { useGetAllMovies } from "@/services/public/movies-and-cinema";

const ExploreMovies = () => {
  const [page] = useState(1);
  const [limit] = useState(10);
  const [search] = useState("");

  const { data, } = useGetAllMovies({
    page,
    limit,
    search,
  });

  console.log(data);

  return (
    <section className="bg-muted py-16">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <h1 className="text-primary text-base md:text-xl/tight font-semibold">
          Looking for something to watch?
        </h1>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 mt-10 md:mt-12">
          {data?.data?.map((movie) => (
            <ExploreMoviesCard key={movie?._id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreMovies;