"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetNotifications,
  useMarkAllNotificationsRead,
} from "@/services/shared/notification";
import Image from "next/image";
import Link from "next/link";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import NotificationCard from "@/components/vendor/notifications/NotificationCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import NotificationCardSkeleton from "@/components/vendor/notifications/NotificationCardSkeleton";

const Page = () => {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGetNotifications({
    status: filter === "all" ? "" : filter,
    limit,
    skip: (page - 1) * limit,
    search: debouncedSearch,
  });
  const { mutate, isPending: isMarking } = useMarkAllNotificationsRead();
  const queryClient = useQueryClient();

  const handleMarkAllNotificationsRead = () => {
    mutate(undefined, {
      onSuccess: () => {
        toast.success("All notifications marked as read");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1;

  return (
    <section className="h-full flex flex-col bg-gray-50/60 p-6">
      <div>
        <h1 className="text-primary text-xl font-semibold">Notifications</h1>
        <p className="text-gray-700 text-xs mt-1.5">
          Stay updated with your latest activities
        </p>
      </div>

      <div className="h-full bg-white border border-gray-100 rounded-lg p-4 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              disabled={isMarking}
              variant={"outline"}
              className="text-gray-700 text-xs cursor-pointer !py-4 hover:bg-muted/50"
              onClick={handleMarkAllNotificationsRead}
            >
              {isMarking && <Loader2 className="animate-spin mr-2" />}
              Mark all as read
            </Button>
            <Button
              variant={"outline"}
              className="!py-4 hover:bg-muted/50 text-gray-700 text-xs cursor-pointer"
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={filter}
              onValueChange={(value) =>
                setFilter(value as "all" | "unread" | "read")
              }
            >
              <SelectTrigger className="w-[133px] text-gray-700 text-xs font-medium data-[placeholder]:!font-medium data-[placeholder]:text-gray-700 cursor-pointer !py-5">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="all"
                  className="text-gray-700 text-xs font-medium cursor-pointer"
                >
                  All
                </SelectItem>
                <SelectItem
                  value="unread"
                  className="text-gray-700 text-xs font-medium cursor-pointer"
                >
                  Unread
                </SelectItem>
                <SelectItem
                  value="read"
                  className="text-gray-700 text-xs font-medium cursor-pointer"
                >
                  Read
                </SelectItem>
              </SelectContent>
            </Select>
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
                placeholder="Search notification here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="h-full flex flex-col gap-4 py-4">
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <NotificationCardSkeleton key={index} />
              ))}
          </div>
        )}
        {error && (
          <div className="flex justify-center p-4">
            <p className="text-red-500 text-sm">Error: {error.message}</p>
          </div>
        )}
        {!isLoading && !error && data?.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-20 min-h-[400px]">
            <Image
              src={EmptyIcon}
              className="size-14"
              alt="Harmony Bookme"
              loading="lazy"
            />
            <h1 className="text-gray-700 text-sm font-semibold">
              No notifications yet
            </h1>
            <p className="text-gray-500 text-xs text-center max-w-md">
              Receive notifications and they&apos;ll show up here.
            </p>
          </div>
        )}
        {data?.data?.length && (
          <div className="h-full flex flex-col gap-2 py-4">
            {data.data.map((notification, index) => (
              <React.Fragment key={index}>
                {notification?.link ? (
                  <Link href={notification?.link}>
                    <NotificationCard notification={notification} />
                  </Link>
                ) : (
                  <div>
                    <NotificationCard notification={notification} />
                  </div>
                )}
              </React.Fragment>
            ))}
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50 text-xs"
                        : "text-xs"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNum);
                        }}
                        isActive={pageNum === page}
                        className="text-xs"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50 text-xs"
                        : "text-xs"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;