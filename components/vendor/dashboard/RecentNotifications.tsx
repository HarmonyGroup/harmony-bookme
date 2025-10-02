import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {
  useGetNotifications,
  useMarkAllNotificationsRead,
} from "@/services/shared/notification";
import Image from "next/image";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import RecentNotificationCard from "./RecentNotificationCard";
import Link from "next/link";
import { toast } from "sonner";
import RecentNotificationCardSkeleton from "./RecentNotificationCardSkeleton";

const RecentNotifications = () => {
  const router = useRouter();
  const { data, isLoading } = useGetNotifications({
    limit: 5,
  });
  const { mutate: markAll, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const handleMarkAllNotificationsRead = () => {
    markAll(undefined, {
      onSuccess: () => {
        toast.success("All notifications marked as read");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  return (
    <div className="bg-white border border-muted rounded-lg shadow-none p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-primary text-[13px] font-semibold">
          Notifications
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer hover:bg-muted rounded-md transition-colors ease-in-out duration-300 p-1 focus-visible:outline-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.7"
              stroke="currentColor"
              className="size-[20px]"
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
              onClick={() => router.push(`/vendor/notification-center`)}
              className="text-gray-700 text-[11px] font-medium cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.7"
                stroke="currentColor"
                className="text-gray-700 size-[13px]"
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
              See all
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleMarkAllNotificationsRead}
              disabled={isMarkingAll}
              className="text-gray-700 text-[11px] font-medium cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="text-gray-700 size-[13px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
              Mark all as read
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="h-full flex flex-col gap-4 py-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <RecentNotificationCardSkeleton key={index} />
            ))}
        </div>
      ) : (
        <>
          {data?.data?.length ? (
            <div className="flex flex-col gap-2 mt-2">
              {data?.data?.map((notification, index) => (
                <React.Fragment key={index}>
                  {notification?.link ? (
                    <Link href={notification?.link}>
                      <RecentNotificationCard notification={notification} />
                    </Link>
                  ) : (
                    <div>
                      <RecentNotificationCard notification={notification} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 pb-28">
              <Image
                src={EmptyIcon}
                className="size-14"
                alt="Harmony Bookme"
                loading="lazy"
              />
              <h1 className="text-gray-700 text-xs font-semibold mt-3">
                No notifications yet
              </h1>
              <p className="text-gray-500 text-[11px] text-center max-w-md mt-1.5">
                Receive notifications and they&apos;ll show up here.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecentNotifications;