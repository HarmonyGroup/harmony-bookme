"use client"

import React from 'react';
import { useGetVendorCinema } from '@/services/vendor/movies-and-cinema';

interface CinemaPageProps {
  params: Promise<{ slug: string }>;
}

const Page = ({ params }: CinemaPageProps) => {

    const resolvedParams = React.use(params);
      const { slug } = resolvedParams;

      const { data } = useGetVendorCinema({ slug });

        console.log(data);
        

  return (
    <div>
      
    </div>
  )
}

export default Page
