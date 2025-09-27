import React from 'react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const AccommodationListingCard = () => {
  return (
    <div className='border rounded-lg'>
        <div className='w-full h-56 bg-gray-50 rounded-lg'></div>
        <div className='p-4'>
            <h2 className='text-sm font-medium'>De Aries Apartments</h2>
            <p className='text-gray-600 text-[11px] font-medium mt-1.5'>8A Anthony Ajayi Street, Onike Yaba</p>
            {/* <p className='text-blue-600 text-xs mt-2'><span className='text-gray-950 font-medium'>12 bookings,</span> 0% occupancy rate</p> */}
            <Separator className='my-4' />
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2.5'>
                    <span className='bg-primary/10 text-primary text-xs font-medium rounded-sm px-3 py-2'>Vacant</span>
                    <span className='text-gray-600 text-[11px] font-medium'>Updated Aug 2</span>
                </div>
                <Link href={"/"} className='text-sky-600 text-xs font-medium'>View Listing</Link>
            </div>
            <div className='bg-gray-100'>
                <div className='flex items-center justify-between'>
                    <div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AccommodationListingCard;