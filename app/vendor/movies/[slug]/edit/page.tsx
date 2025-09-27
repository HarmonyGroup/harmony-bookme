"use client"

import React from "react";
import NewMovieForm from "@/components/vendor/movies-and-cinema/NewMovieForm";
import { useGetVendorMovie } from "@/services/vendor/movies-and-cinema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page = ({ params }: PageProps) => {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;

  const { data } = useGetVendorMovie({ slug });

  console.log(data?.data);

  return (
    <div>
      <NewMovieForm movie={data?.data} />
    </div>
  );
};

export default Page;