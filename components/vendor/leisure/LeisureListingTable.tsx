"use client";

import { GrDocumentCsv } from "react-icons/gr";
import React, { useState } from "react";
import { useLeisureListings } from "@/services/vendor/leisure";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import { copyToClipboard, formatNotificationTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useDeleteLeisureListing } from "@/services/vendor/leisure";
import { ActionModal } from "../shared/ActionModal";

const LeisureListingTable = () => {
  const router = useRouter();
  const currentTime = moment();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedLeisure, setSelectedLeisure] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useLeisureListings({
    page: page,
    limit: limit,
    search: debouncedSearch,
  });
  const { mutate: deleteListing, isPending: deleting } =
    useDeleteLeisureListing();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = (id: string) => {
    deleteListing(id);
    setDeleteModal(false);
  };

  return (
    <>
      <div className="h-full bg-white border border-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant={"outline"}
              className="text-gray-700 text-xs cursor-pointer !py-5 hover:bg-muted/50"
            >
              <GrDocumentCsv size={15} />
              Export data
            </Button>
            <Button
              variant={"outline"}
              className="!py-5 hover:bg-muted/50 text-gray-700 text-xs cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.4"
                stroke="currentColor"
                className="text-gray-700 size-[14px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Refresh
            </Button>
          </div>

          <div className="flex items-center gap-3">
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
                className="w-[400px] bg-white !text-xs placeholder:text-gray-700 placeholder:text-xs placeholder:font-medium shadow-xs outline-none ring-0 focus:shadow-xs px-4 !py-5 ps-9 border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                placeholder="Search leisure here"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <Table className="!px-10 mt-4">
            <TableHeader className="!px-10">
              <TableRow className="bg-muted/90 text-xs !px-10">
                <TableHead className="text-gray-700 font-medium py-5 pl-4">
                  Leisure title
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Leisure code
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Created
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
                  <TableCell className="text-right pr-4">
                    <Skeleton className="h-4 w-4 ml-auto bg-gray-200 rounded-sm" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : data?.data?.length ? (
          <Table className="!px-10 mt-4">
            <TableHeader className="!px-10">
              <TableRow className="bg-muted/90 text-xs !px-10">
                <TableHead className="text-gray-700 font-medium py-5 pl-4">
                  Leisure title
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Leisure code
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Created
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-right pr-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((leisure) => (
                <TableRow key={leisure?._id}>
                  <TableCell className="text-gray-700 text-xs font-semibold pl-4 py-5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative size-10 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={`${leisure?.images?.[0]}`}
                          alt={`${leisure?.title}`}
                          className="object-cover"
                          fill
                        />
                      </div>
                      {leisure?.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 text-xs uppercase">
                    <div className="flex items-center gap-2">
                      {leisure?.leisureCode}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.7"
                        stroke="currentColor"
                        className="size-[15px] cursor-pointer"
                        onClick={() =>
                          copyToClipboard(String(leisure?.leisureCode))
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
                    <Badge
                      variant={"default"}
                      className="!text-xs font-medium capitalize px-2.5 py-1 bg-green-800 border-none shadow-none"
                    >
                      {leisure?.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 text-xs">
                    {formatNotificationTime(
                      String(leisure?.createdAt),
                      currentTime
                    )}
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
                            router.push(`/vendor/leisure/${leisure?.slug}/edit`)
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
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedLeisure(String(leisure?._id));
                            setDeleteModal(true);
                          }}
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
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-20 min-h-[400px]">
            <Image
              src={EmptyIcon}
              className="size-14"
              alt="Harmony Bookme"
              loading="lazy"
            />
            <h1 className="text-gray-700 text-sm font-semibold">
              No leisure found
            </h1>
            <p className="text-gray-500 text-xs text-center max-w-md">
              Create leisure and they&apos;ll show up here.
            </p>
          </div>
        )}
      </div>

      <ActionModal
        variant="delete"
        showModal={deleteModal}
        toggleModal={() => setDeleteModal(!deleteModal)}
        heading="Delete Leisure"
        description="Are you sure you want to delete this leisure activity? This action cannot be undone."
        loading={deleting}
        onConfirm={() => selectedLeisure && handleDelete(selectedLeisure)}
      />
    </>
  );
};

export default LeisureListingTable;