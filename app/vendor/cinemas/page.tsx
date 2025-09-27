import React from "react";
import Link from "next/link";
import AllCinemasTable from "@/components/vendor/movies-and-cinema/AllCinemasTable";

const Page = () => {
  return (
    <section className="h-full bg-muted/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary text-xl font-semibold">Cinemas</h1>
          <p className="text-gray-600 text-xs mt-1.5">
            Create and manage cinemas here
          </p>
        </div>
        <Link
          href={"/vendor/cinemas/new"}
          className="bg-primary text-white text-xs font-medium px-4 py-2.5 rounded-md"
        >
          Create Cinema
        </Link>
      </div>

      <div className="h-full mt-6">
        <AllCinemasTable />
      </div>
    </section>
  );
};

export default Page;