"use client";

import React, { useState, useEffect, Suspense } from "react";
import PersonalDetails from "@/components/website/account/PersonalDetails";
import Bookings from "@/components/website/account/Bookings";
import Preferences from "@/components/website/account/Preferences";
import {
  FadersIcon,
  HeadsetIcon,
  ShieldCheckIcon,
  TicketIcon,
  UserIcon,
} from "@phosphor-icons/react";
import Security from "@/components/website/account/Security";
import Feedback from "@/components/website/account/Feedback";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import moment from "moment";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  description: string;
}

const AccountContent = () => {
  const searchParams = useSearchParams();
  const [view, setView] = useState("personal-details");
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const { data: session } = useSession();

  // Handle booking query parameter
  useEffect(() => {
    const bookingId = searchParams.get("booking");
    if (bookingId) {
      setSelectedBookingId(bookingId);
      setView("bookings");
    }
  }, [searchParams]);

  const menuItems: MenuItem[] = [
    {
      id: "personal-details",
      label: "Personal Details",
      icon: UserIcon,
      description: "Manage your personal information.",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: TicketIcon,
      description: "View and manage all your bookings.",
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: FadersIcon,
      description: "Customize your account preferences.",
    },
    {
      id: "security",
      label: "Security",
      icon: ShieldCheckIcon,
      description: "Manage your account security settings.",
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: HeadsetIcon,
      description: "Share your feedback to help us improve.",
    },
  ];

  return (
    <section className="min-h-[80vh] bg-muted/60">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 md:py-10">
        <div>
          <h1 className="text-primary text-base font-semibold">
            Welcome, {session?.user?.firstName}!
          </h1>
          <p className="text-gray-600 text-[11px] mt-1.5">
            Last Login: {moment(session?.user?.lastLogin).format("lll")}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-10">
            <div className="hidden lg:block col-span-1 rounded-lg">
              <div className="flex flex-col gap-3">
                {menuItems.map((menu) => (
                  <div
                    key={menu.id}
                    onClick={() => setView(menu.id)}
                    className={` border hover:shadow-xs flex items-start gap-3.5 rounded-lg p-4 cursor-pointer transition-all ease-in-out duration-300 ${
                      view === menu?.id ? "border-primary/10 !bg-primary/10 border-none" : "bg-white border-gray-100"
                    }`}
                  >
                    <div className={`${view === menu?.id ? "bg-white" : "bg-muted"} size-11 flex items-center justify-center shrink-0 bg-muted rounded-md`}>
                      <menu.icon size={20} color="#183264" />
                    </div>
                    <div>
                      <h1 className="text-primary text-[13px] font-medium">
                        {menu.label}
                      </h1>
                      <p className="text-gray-600 text-[11px]/relaxed mt-1 line-clamp-1 w-full">
                        {menu.description}
                      </p>
                    </div>
                  </div>
                ))}

                {/* <div
                  onClick={() => setView("bookings")}
                  className="bg-white border border-gray-100 hover:shadow-xs flex items-start gap-3 rounded-lg p-4 cursor-pointer"
                >
                  <div className="size-11 flex items-center justify-center shrink-0 bg-muted rounded-md">
                    <TicketIcon size={20} color="#183264" />
                  </div>
                  <div>
                    <h1 className="text-primary text-[13px] font-medium">
                      Bookings
                    </h1>
                    <p className="text-gray-500 text-[11px]/relaxed mt-1 line-clamp-1 w-full max-w-[92%]">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Esse omnis ipsam commodi incidunt ullam aut quod mollitia
                      quidem necessitatibus
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setView("preferences")}
                  className="bg-white border border-gray-100 hover:shadow-xs flex items-start gap-3 rounded-lg p-4 cursor-pointer"
                >
                  <div className="size-11 flex items-center justify-center shrink-0 bg-muted rounded-md">
                    <FadersIcon size={20} color="#183264" />
                  </div>
                  <div>
                    <h1 className="text-primary text-[13px] font-medium">
                      Preferences
                    </h1>
                    <p className="text-gray-500 text-[11px]/relaxed mt-1 line-clamp-1 w-full max-w-[92%]">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Esse omnis ipsam commodi incidunt ullam aut quod mollitia
                      quidem necessitatibus
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setView("security")}
                  className="bg-white border border-primary hover:shadow-xs flex items-start gap-3 rounded-lg p-4 cursor-pointer"
                >
                  <div className="size-11 flex items-center justify-center shrink-0 bg-muted rounded-md">
                    <ShieldCheckIcon size={20} color="#183264" />
                  </div>
                  <div>
                    <h1 className="text-primary text-[13px] font-medium">
                      Security
                    </h1>
                    <p className="text-gray-600 text-[11px]/relaxed mt-1 line-clamp-1 w-full max-w-[92%]">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Esse omnis ipsam commodi incidunt ullam aut quod mollitia
                      quidem necessitatibus
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setView("feedback")}
                  className="bg-white border border-gray-100 hover:shadow-xs flex items-start gap-3 rounded-lg p-4 cursor-pointer"
                >
                  <div className="size-11 flex items-center justify-center shrink-0 bg-muted rounded-md">
                    <HeadsetIcon size={20} color="#183264" />
                  </div>
                  <div>
                    <h1 className="text-primary text-[13px] font-medium">
                      Feedback
                    </h1>
                    <p className="text-gray-600 text-[11px]/relaxed mt-1 line-clamp-1 w-full max-w-[92%]">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Esse omnis ipsam commodi incidunt ullam aut quod mollitia
                      quidem necessitatibus
                    </p>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="col-span-3 lg:col-span-2 bg-white border border-gray-100 rounded-lg shadow-xs p-6">
              {view === "personal-details" && <PersonalDetails />}
              {view === "bookings" && <Bookings selectedBookingId={selectedBookingId} />}
              {view === "preferences" && <Preferences />}
              {view === "security" && <Security />}
              {view === "feedback" && <Feedback />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
};

export default Page;