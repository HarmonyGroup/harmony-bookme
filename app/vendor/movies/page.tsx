import React from "react";
import Link from "next/link";
import AllMoviesTable from "@/components/vendor/movies-and-cinema/AllMoviesTable";

const Page = () => {
  return (
    <section className="h-full flex flex-col bg-muted/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary text-xl font-semibold">Movies</h1>
          <p className="text-gray-600 text-xs mt-1.5">
            List and manage movie tickets here
          </p>
        </div>
        <Link
          href={"/vendor/movies/new"}
          className="bg-primary text-white text-xs font-medium px-4 py-2.5 rounded-md"
        >
          Create Movie
        </Link>
      </div>

      <div className="h-full mt-6">
        <AllMoviesTable />
      </div>
    </section>
  );
};

export default Page;