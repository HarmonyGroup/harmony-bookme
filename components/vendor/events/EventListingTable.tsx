// "use client";

// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { EventListing } from "@/types/event";
// import moment from "moment";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useRouter } from "next/navigation";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ActionModal } from "../shared/ActionModal";
// import { useDeleteVendorEvent } from "@/services/vendor/event";
// import { toast } from "sonner";

// interface TableProps {
//   events?: EventListing[];
//   isLoading: boolean;
// }

// const EventListingTable = ({ events, isLoading }: TableProps) => {
//   const router = useRouter();
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
//   const { mutate: deleteEvent, isPending: isDeleting } = useDeleteVendorEvent();

//   if (isLoading) {
//     return (
//       <Table>
//         <TableHeader>
//           <TableRow className="bg-gray-100">
//             <TableHead className="text-xs py-4">Event</TableHead>
//             <TableHead className="text-xs">Event Type</TableHead>
//             <TableHead className="text-xs">Event Category</TableHead>
//             <TableHead className="text-xs">Event Format</TableHead>
//             <TableHead className="text-xs">Event Pricing</TableHead>
//             <TableHead className="text-xs text-right">Date Created</TableHead>
//             <TableHead className="text-xs text-right">Action</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {Array.from({ length: 5 }).map((_, index) => (
//             <TableRow key={index}>
//               <TableCell className="py-6">
//                 <div className="flex items-center gap-2.5">
//                   <Skeleton className="size-11 rounded-md" />
//                   <div className="flex flex-col gap-2">
//                     <Skeleton className="h-4 w-40" />
//                     <Skeleton className="h-3 w-20" />
//                   </div>
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <Skeleton className="h-4 w-24" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton className="h-4 w-24" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton className="h-4 w-24" />
//               </TableCell>
//               <TableCell>
//                 <Skeleton className="h-4 w-24" />
//               </TableCell>
//               <TableCell className="text-right">
//                 <Skeleton className="h-4 w-24 ml-auto" />
//               </TableCell>
//               <TableCell className="text-right">
//                 <Skeleton className="h-4 w-8 ml-auto" />
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     );
//   }

//   if (!events || events.length === 0) {
//     return (
//       <div className="text-center py-10 text-gray-500 text-sm">
//         No events found.
//       </div>
//     );
//   }

//   const handleDeleteEvent = () => {
//     deleteEvent(String(selectedEvent), {
//       onSuccess: (response) => {
//         toast.success(response?.message ?? "Event deleted successfully");
//         setDeleteModal(false);
//       },
//       onSettled: () => setSelectedEvent(null),
//     });
//   };

//   return (
//     <>
//       <Table>
//         <TableHeader>
//           <TableRow className="bg-gray-100">
//             <TableHead className="text-xs py-4">Event</TableHead>
//             <TableHead className="text-xs">Event Type</TableHead>
//             <TableHead className="text-xs">Event Category</TableHead>
//             <TableHead className="text-xs">Event Format</TableHead>
//             <TableHead className="text-xs">Event Pricing</TableHead>
//             <TableHead className="text-xs text-right">Date Created</TableHead>
//             <TableHead className="text-xs text-right">Action</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {events.map((event) => (
//             <TableRow key={event._id}>
//               <TableCell className="flex items-center gap-2.5 py-6">
//                 <div className="bg-gray-200 size-11 rounded-md"></div>
//                 <div className="flex flex-col gap-0.5">
//                   <span className="text-[13px] font-medium">{event.title}</span>
//                   {/* <span className="text-gray-600 text-xs capitalize">
//                     {event.status}
//                   </span> */}
//                 </div>
//               </TableCell>
//               <TableCell className="text-gray-700 text-xs">
//                 {event.eventType}
//               </TableCell>
//               <TableCell className="text-gray-700 text-xs">
//                 {event.category}
//               </TableCell>
//               <TableCell className="text-gray-700 text-xs capitalize">
//                 {event.format}
//               </TableCell>
//               <TableCell className="text-gray-700 text-xs capitalize">
//                 {event.pricingType}
//               </TableCell>
//               <TableCell className="text-gray-700 text-xs text-right">
//                 {moment(event.createdAt).format("ll")}
//               </TableCell>
//               <TableCell className="text-xs text-right">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger className="cursor-pointer hover:bg-gray-100 rounded-md transition ease-in-out duration-300 p-1">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="1.5"
//                       stroke="currentColor"
//                       className="size-5"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
//                       />
//                     </svg>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="mt-3">
//                     <DropdownMenuItem
//                       onClick={() =>
//                         router.push(`/vendor/events/${event.slug}`)
//                       }
//                       className="text-gray-700 text-xs cursor-pointer focus:!text-gray-700 !py-2"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                         className="size-3.5"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
//                         />
//                       </svg>
//                       View Details
//                     </DropdownMenuItem>
//                     <DropdownMenuItem
//                       onClick={() =>
//                         router.push(`/vendor/events/${event.slug}/edit`)
//                       }
//                       className="text-gray-700 text-xs cursor-pointer focus:!text-gray-700 !py-2"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                         className="text-gray-600 size-3.5"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
//                         />
//                       </svg>
//                       Edit
//                     </DropdownMenuItem>
//                     <DropdownMenuItem
//                       onClick={() => {
//                         setSelectedEvent(String(event?._id)),
//                           setDeleteModal(!deleteModal);
//                       }}
//                       className="text-gray-700 text-xs cursor-pointer focus:!text-gray-700 !py-2"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                         className="text-gray-600 size-3.5"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//                         />
//                       </svg>
//                       Delete
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       <ActionModal
//         variant="delete"
//         showModal={deleteModal}
//         toggleModal={() => setDeleteModal(!deleteModal)}
//         onConfirm={handleDeleteEvent}
//         loading={isDeleting}
//         heading="Delete Event"
//         description="Are you sure you want to delete this event? This action cannot be reversed."
//       />
//     </>
//   );
// };

// export default EventListingTable;

"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "use-debounce";
import { useGetVendorEvents } from "@/services/vendor/event";
import Image from "next/image";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import { EVENT_CATEGORIES } from "@/constants/events";
import { copyToClipboard } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const EventListingTable = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [category] = useState("all");
  const [pricingType] = useState("all");

  const { data, isLoading } = useGetVendorEvents({
    page,
    limit,
    search: debouncedSearchQuery ?? "",
    category: category !== "all" ? category : "",
    pricingType: pricingType !== "all" ? pricingType : "",
  });

  return (
    <>
      <div className="h-full">
        <div className="md:flex items-center justify-between hidden">
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="absolute left-4 top-1/2 -translate-y-1/2 size-[13px] text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <Input
                type="search"
                className="w-[300px] bg-white !text-xs placeholder:text-gray-500 placeholder:text-xs placeholder:font-medium shadow-xs outline-none ring-0 focus:shadow-xs px-4 !py-5 ps-9 border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                placeholder="Search booking code here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-[133px] text-gray-700 text-xs font-medium data-[placeholder]:!font-medium data-[placeholder]:text-gray-700 cursor-pointer !py-5">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="all"
                  className="text-gray-700 text-xs font-medium cursor-pointer"
                >
                  All categories
                </SelectItem>
                {EVENT_CATEGORIES?.map((cat, index) => (
                  <SelectItem
                    value={cat}
                    key={index}
                    className="text-gray-700 text-xs font-medium cursor-pointer"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <Table className="!px-10 mt-4">
            <TableHeader>
              <TableRow className="bg-muted/90 text-xs !px-10">
                <TableHead className="text-gray-700 font-medium py-5 pl-4">
                  Event title
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Event code
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Schedule
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Status
                </TableHead>

                <TableHead className="text-gray-700 font-medium">
                  Date created
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-right pr-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(7)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-4 py-5">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-6 w-6 bg-gray-200 rounded-sm" />
                      <Skeleton className="h-4 w-[200px] bg-gray-200 rounded-sm" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-[100px] bg-gray-200 rounded-sm" />
                      <Skeleton className="h-4 w-4 bg-gray-200 rounded-sm" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px] bg-gray-200 rounded-sm" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px] bg-gray-200 rounded-sm" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px] bg-gray-200 rounded-sm" />
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Skeleton className="h-4 w-4 ml-auto bg-gray-200 rounded-sm" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : data?.data?.length ? (
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/90 text-xs !px-10">
                  <TableHead className="text-gray-700 font-medium py-5 pl-4">
                    Event title
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium">
                    Event code
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium">
                    Schedule
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium">
                    Status
                  </TableHead>

                  <TableHead className="text-gray-700 font-medium">
                    Date created
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium text-right pr-4">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((event) => (
                  <TableRow key={event?._id}>
                    <TableCell className="text-gray-700 text-xs font-semibold pl-4 py-5">
                      {event?.title}
                    </TableCell>
                    <TableCell className="text-gray-700 text-xs uppercase">
                      <div className="flex items-center gap-2">
                        {event?.eventCode}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.7"
                          stroke="currentColor"
                          className="size-[15px] cursor-pointer"
                          onClick={() =>
                            copyToClipboard(String(event.eventCode))
                          }
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                          />
                        </svg>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 text-xs">
                      August 4 20:45 PM
                    </TableCell>
                    <TableCell className="text-gray-700 text-xs">
                      {event?.status}
                    </TableCell>
                    <TableCell className="text-gray-700 text-xs">
                      August 4 20:45 PM
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer hover:bg-muted rounded-md transition-colors ease-in-out duration-300 p-1 focus-visible:outline-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-[22px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                            />
                          </svg>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/vendor/events/${event?.slug}`)
                            }
                            className="text-gray-700 text-xs font-medium cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.7"
                              stroke="currentColor"
                              className="text-gray-700 size-[14px]"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/vendor/events/${event?.slug}/edit`)
                            }
                            className="text-gray-700 text-xs font-medium cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.7"
                              stroke="currentColor"
                              className="text-gray-700 size-[14px]"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                            Manage
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-20 min-h-[400px]">
            <Image
              src={EmptyIcon}
              className="size-14"
              alt="Harmony Bookme"
              loading="lazy"
            />
            <h1 className="text-gray-700 text-sm font-semibold">
              No events found
            </h1>
            <p className="text-gray-500 text-xs text-center max-w-md">
              Create events and they&apos;ll show up here.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default EventListingTable;