"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Logo from "@/public/assets/logo-wordmark-light.png";
import { useSession } from "next-auth/react";
import { vendorAccountPreferences } from "@/constants/vendor-account-preferences";
import { toast } from "sonner";

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
  onLinkClick,
}: {
  href: string;
  title: string;
  iconPath: string;
  onClick?: () => void;
  onLinkClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <li>
      <Link
        href={href}
        onClick={handleClick}
        className={`w-full flex items-center gap-2 p-3 text-xs font-medium transition-all duration-300 ease-in-out ${
          isActive
            ? "bg-white/20 text-white font-medium rounded-md"
            : "text-white/80 hover:text-white hover:bg-[#292673]/20"
        }`}
      >
        <NavIcon path={iconPath} />
        {title}
      </Link>
    </li>
  );
};

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileSidebar = ({ open, onOpenChange }: MobileSidebarProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    if (open) {
      // Small delay to prevent immediate close when opening
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

  const handleLogout = async () => {
    const toastId = toast.loading("Please wait while we sign you out");
    
    try {
      await signOut({ callbackUrl: "/auth/vendor/login" });
      toast.dismiss(toastId);
      onOpenChange(false);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to sign out", {
        description: "An error occurred while signing out. Please try again."
      });
      console.log(error);
    }
  };

  const baseNavLinks = [
    {
      href: "/vendor/dashboard",
      title: "Dashboard",
      iconPath:
        "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z",
    },
    {
      href: "/vendor/bookings",
      title: "Bookings",
      iconPath:
        "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z",
    },
    {
      href: "/vendor/transactions",
      title: "Transactions",
      iconPath:
        "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    },
    {
      href: "/vendor/notification-center",
      title: "Notifications",
      iconPath:
        "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5",
    },
    {
      href: "/vendor/settings",
      title: "Settings",
      iconPath:
      "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    },
  ];

  // Define dynamic links based on vendorAccountPreferences
  const dynamicLinks = vendorAccountPreferences
    .map((preference) => {
      switch (preference.value) {
        case "events":
          return {
            href: "/vendor/events",
            title: preference.label,
            iconPath:
              "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
          };
        case "movies_and_cinema":
          return [
            {
              href: "/vendor/movies",
              title: "Movies",
              iconPath:
                "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z",
            },
            {
              href: "/vendor/cinemas",
              title: "Cinemas",
              iconPath:
                "M19.5 5.25a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v13.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V5.25ZM12 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z",
            },
          ];
        case "accommodations":
          return {
            href: "/vendor/accommodations",
            title: preference.label,
            iconPath:
              "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3h-1.5m0 6.75h18M3.75 7.5v11.25m-1.5-9.75 1.5 1.636V3.545M12.75 3h-1.5",
          };
        case "leisure":
          return {
            href: "/vendor/leisure",
            title: preference.label,
            iconPath:
              "M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Zm4.5 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm3.75-3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z",
          };
        default:
          return null;
      }
    })
    .flat()
    .filter((link) => link !== null);

  // Conditionally add dynamic links for vendors
  const navLinks =
    user?.role === "vendor" && user?.vendorAccountPreference
      ? [
          baseNavLinks[0], // Dashboard
          ...dynamicLinks.filter((link) => {
            if (!link) return false;
            
            // For movies_and_cinema preference, show both Movies and Cinemas
            if (user.vendorAccountPreference === "movies_and_cinema") {
              return link.title === "Movies" || link.title === "Cinemas";
            }
            
            // For other preferences, show only the matching preference
            const preference = vendorAccountPreferences.find(
              (pref) => pref.value === user.vendorAccountPreference
            );
            return preference && link.title === preference.label;
          }),
          ...baseNavLinks.slice(1), // Rest of the links
        ].filter((link) => link !== null && link !== undefined)
      : baseNavLinks;

  const supportLinks = [
    {
      href: "/vendor/support",
      title: "Support",
      iconPath:
        "M18.364 5.636A9 9 0 1 1 5.636 18.364 9 9 0 0 1 18.364 5.636ZM12 9.75a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75Zm0-3a.75.75 0 0 0-.75.75v.75a.75.75 0 0 0 1.5 0v-.75a.75.75 0 0 0-.75-.75Z",
    },
    {
      href: "#",
      title: "Log out",
      iconPath:
        "M8.25 6h7.5a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-7.5A2.25 2.25 0 0 1 8.25 6Zm3.75 1.5v9",
      onClick: handleLogout,
    },
  ];

  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`absolute inset-0 bg-primary/70 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => onOpenChange(false)}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`absolute left-0 top-0 h-full w-[280px] bg-primary border-r border-gray-200/20 shadow-xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200/20">
            <Image
              src={Logo}
              alt="Harmony Bookme"
              className="w-[140px] object-contain"
              priority
            />
            <button
              onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Content */}
          <div className="flex flex-col flex-1 justify-between overflow-y-auto py-6">
            {/* Main Navigation */}
            <div>
              <p className="px-6 text-[10px] font-semibold text-gray-300 uppercase tracking-wide">
                MAIN
              </p>
              <ul className="mt-4 space-y-2 px-4">
                {navLinks.map((link) => (
                  <NavLink 
                    key={link.href} 
                    {...link} 
                    onLinkClick={() => onOpenChange(false)}
                  />
                ))}
              </ul>
            </div>

            {/* Support and Logout */}
            <div className="pb-6">
              <p className="px-6 text-[10px] font-semibold text-gray-300 uppercase tracking-wide">
                GENERAL
              </p>
              <ul className="mt-2 space-y-1 px-4">
                {supportLinks.map((link) => (
                  <NavLink 
                    key={link.href} 
                    {...link}
                    onLinkClick={() => onOpenChange(false)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MobileSidebar;
