"use client"

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/public/assets/logo-wordmark-light.png";

const Sidebar = () => {

    const baseNavLinks = [
        {
          href: "/admin/dashboard",
          title: "Dashboard",
          iconPath:
            "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z",
        },
        {
          href: "/admin/bookings",
          title: "Bookings",
          iconPath:
            "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z",
        },
        {
          href: "/admin/events",
          title: "Events",
          iconPath:
            "M6.75 3v2.25M17.25 3v2.25M4.5 9.75h15M5.25 6.75h13.5A1.5 1.5 0 0 1 20.25 8.25v11.25A1.5 1.5 0 0 1 18.75 21H5.25A1.5 1.5 0 0 1 3.75 19.5V8.25A1.5 1.5 0 0 1 5.25 6.75z",
        },
        {
          href: "/admin/notification-center",
          title: "Notifications",
          iconPath:
            "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5",
        },
        // {
        //   href: "/admin/account",
        //   title: "Account",
        //   iconPath:
        //     "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
        // },
        {
          href: "/admin/transactions",
          title: "Transactions",
          iconPath: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
        },
        {
          href: "/admin/users",
          title: "Users",
          iconPath:
            "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
        },
        {
          href: "/admin/configurations",
          title: "Configurations",
          iconPath:
            "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
        },
      ];

  return (
    <div className="hidden lg:flex h-screen flex-col justify-between border-r border-gray-200/20 bg-primary w-60 text-white">
      <div className="flex flex-col h-full px-0 py-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 pb-8 px-4">
          <Image
            src={Logo}
            alt="Harmony Bookme"
            className="w-[160px] object-contain"
            priority
          />
        </div>

        {/* Navigation Sections */}
        <div className="flex flex-col flex-1 justify-between">
          {/* Main Navigation */}
          <div>
            <p className="px-4 text-[10px] font-semibold text-gray-300 uppercase tracking-wide">
              MENU
            </p>
            <ul className="mt-2 space-y-1">
             {baseNavLinks.map((link) => (
                <NavLink key={link.href} {...link} />
             ))}
            </ul>
          </div>

          {/* Support and Logout */}
          <div>
            <p className="px-4 text-[10px] font-semibold text-gray-300 uppercase tracking-wide">
              GENERAL
            </p>
            <ul className="mt-2 space-y-1">
             
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
};

const NavIcon = ({ path }: { path: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      stroke="currentColor"
      className="size-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );

const NavLink = ({
    href,
    title,
    iconPath,
    onClick,
  }: {
    href: string;
    title: string;
    iconPath: string;
    onClick?: () => void;
  }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
  
    return (
      <li>
        <Link
          href={href}
          onClick={onClick}
          className={`w-full flex items-center gap-2 px-4 py-4 text-xs font-medium transition-all duration-300 ease-in-out ${
            isActive
              ? "bg-white/20 text-white font-medium border-r-[3.5px]"
              : "text-white/80 hover:text-white hover:bg-[#292673]/20"
          }`}
        >
          <NavIcon path={iconPath} />
          {title}
        </Link>
      </li>
    );
  };

export default Sidebar
