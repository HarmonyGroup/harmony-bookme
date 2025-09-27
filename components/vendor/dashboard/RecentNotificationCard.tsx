import React from "react";
import { Notification } from "@/types/notification";
import { formatNotificationTime } from "@/lib/utils";
import moment from "moment";

interface RecentNotificationCardProps {
  notification: Notification;
}

const RecentNotificationCard = ({
  notification,
}: RecentNotificationCardProps) => {
  const currentTime = moment();

  return (
    <div className="hover:bg-muted flex items-center justify-between rounded-md p-2 cursor-pointer transition-colors ease-in-out duration-300">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center bg-sky-400 size-9 rounded-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="text-white size-[17px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-gray-700 text-xs font-semibold">
            {notification?.title}
          </p>
          <p className="text-gray-500 text-[11px] line-clamp-1">{notification?.subtext}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {notification?.status === "unread" && (
          <div className="size-[4px] bg-sky-500 rounded-full" />
        )}
        <p className="text-gray-500 text-[11px] whitespace-nowrap">
          {formatNotificationTime(notification.createdAt, currentTime)}
        </p>
      </div>
    </div>
  );
};

export default RecentNotificationCard;