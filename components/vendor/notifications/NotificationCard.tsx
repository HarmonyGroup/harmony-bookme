import React from "react";
import moment from "moment";
import { Notification } from "@/types/notification";
import { formatNotificationTime } from "@/lib/utils";

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  
  const currentTime = moment();

  return (
    <div className="flex items-center justify-between bg-muted/50 hover:bg-muted rounded-lg cursor-pointer p-3 transition-colors ease-in-out duration-300">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center bg-sky-500 size-10 rounded-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.6"
            stroke="currentColor"
            className="text-white size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-1 py-[1px]">
          <h1 className="text-gray-700 text-[13px] font-semibold">
            {notification?.title}
          </h1>
          <p className="text-gray-600 text-[11px]">{notification?.content}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        {notification?.status === "unread" && (
          <div className="size-1 bg-sky-500 rounded-full" />
        )}
        <p className="text-gray-600 text-[11px]">
          {formatNotificationTime(notification.createdAt, currentTime)}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;