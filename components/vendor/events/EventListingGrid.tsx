/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { useGetVendorEvents } from "@/services/vendor/event";
import { Skeleton } from "@/components/ui/skeleton";

const EventListingGrid = () => {
  const [page] = useState(1);
  const [limit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pricingTypeFilter, setPricingTypeFilter] = useState("all");

  // Fetch events data
  const { data, isLoading } = useGetVendorEvents({
    page,
    limit,
    search: debouncedSearchQuery,
    category: categoryFilter !== "all" ? categoryFilter : "",
    pricingType: pricingTypeFilter !== "all" ? pricingTypeFilter : "",
  });

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "draft":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "inactive":
//         return "bg-gray-100 text-gray-800 border-gray-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getStatusLabel = (status: string) => {
//     switch (status) {
//       case "active":
//         return "Published";
//       case "draft":
//         return "Draft";
//       case "inactive":
//         return "Inactive";
//       default:
//         return status;
//     }
//   };

  const events = data?.data || [];

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Calendar className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No events found
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-sm">
        {searchQuery ||
        statusFilter !== "all" ||
        categoryFilter !== "all" ||
        pricingTypeFilter !== "all"
          ? "No events match your current filters. Try adjusting your search criteria."
          : "You haven't created any events yet. Get started by creating your first event."}
      </p>
      <Link href="/vendor/events/new">
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Your First Event
        </Button>
      </Link>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
        >
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      {/* <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-primary text-lg md:text-xl font-semibold">Events</h1>
          <p className="text-gray-700 text-[11px] md:text-xs mt-0.5 md:mt-1">
            Create and manage your events here
          </p>
        </div>
        <Link href="/vendor/events/new">
          <Button className="flex items-center gap-1.5 bg-primary text-white text-[11px] md:text-xs font-medium px-4 py-2.5 rounded-md hover:bg-primary/90 transition-all ease-in-out duration-300">
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
        </Link>
      </div> */}

      {/* Search and Filter Bar */}
      {/* <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Status: {statusFilter === 'all' ? 'All' : getStatusLabel(statusFilter)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('active')}>
              Published
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
              Inactive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Category: {categoryFilter === 'all' ? 'All' : categoryFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-60 overflow-y-auto">
            <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
              All Categories
            </DropdownMenuItem>
            {EVENT_CATEGORIES.map((category) => (
              <DropdownMenuItem 
                key={category} 
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Pricing: {pricingTypeFilter === 'all' ? 'All' : pricingTypeFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPricingTypeFilter('all')}>
              All Pricing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPricingTypeFilter('free')}>
              Free Events
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPricingTypeFilter('paid')}>
              Paid Events
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}

      {/* Events Grid */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white border border-muted rounded-xl duration-200 overflow-hidden group"
            >
              {/* Event Image */}
              <div className="relative h-48 bg-gray-100">
                {event.images && event.images.length > 0 ? (
                  <Image
                    src={event.images[0]}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Calendar className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {/* Status Badge */}
                {/* <div className="absolute top-3 left-3">
                  <Badge className={getStatusColor(event.status)}>
                    {getStatusLabel(event.status)}
                  </Badge>
                </div> */}

                {/* Format Badge */}
                {/* <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    {event.format === 'virtual' ? 'Virtual' : 'In-Person'}
                  </Badge>
                </div> */}

                {/* Action Menu */}
              </div>

              {/* Event Content */}
              <div className="p-4">
                <div className="space-y-2">
                  {/* Title and Category */}
                  <div>
                    <h3 className="font-semibold text-primary text-[13px] line-clamp-1">
                      {event.title}
                    </h3>
                    {/* <p className="text-xs text-gray-500">{event.category}</p> */}
                  </div>

                  {/* Summary */}
                  <p className="text-[11px]/relaxed text-gray-700 line-clamp-2 font-light">
                    {event.summary}
                  </p>

                  {/* Date and Time */}
                  {/* <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{moment(event.startDate).format('MMM DD, YYYY')}</span>
                  </div> */}

                  {/* Location or Virtual Platform */}
                  {/* <div className="flex items-center gap-2 text-xs text-gray-500">
                    {event.format === 'virtual' ? (
                      <>
                        <ExternalLink className="w-3 h-3" />
                        <span>{event.virtualPlatform}</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3 h-3" />
                        <span>{event.city}, {event.state}</span>
                      </>
                    )}
                  </div> */}

                  {/* Pricing */}
                  {/* <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>
                        {event.pricingType === 'free' 
                          ? `Free (${event.freeEventCapacity} capacity)`
                          : `From ₦${formatPrice(event.tickets?.[0]?.basePrice || 0)}`
                        }
                      </span>
                    </div>
                  </div> */}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-muted">
                  {/* <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs"
                    onClick={() => router.push(`/vendor/events/${event.slug}`)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs"
                    onClick={() => router.push(`/vendor/events/${event.slug}/edit`)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button> */}
                  {/* <Link
                    href={`/vendor/events/${event.slug}/edit`}
                    className="bg-white w-full flex items-center justify-center gap-1 text-primary text-[13px] font-medium border border-muted rounded-md py-2.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-[15px]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    Edit
                  </Link> */}
                  <p className="text-gray-700 text-[11px] font-light">No attendees</p>
                  <span className="bg-green-100/80 text-green-700 text-[11px] font-light rounded-md px-2 py-1">Upcoming</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventListingGrid;