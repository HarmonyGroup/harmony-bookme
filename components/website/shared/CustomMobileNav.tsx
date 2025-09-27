"use client";

import React, { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { toast } from "sonner";
import Logo from "@/public/assets/logo-wordmark-dark.png";

interface CustomMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomMobileNav: React.FC<CustomMobileNavProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: session } = useSession();
  const overlayRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const userSectionRef = useRef<HTMLDivElement>(null);

  // Navigation links
  const navigationLinks = [
    { href: "/", label: "Home", icon: null },
    { href: "/events", label: "Events", icon: null },
    { href: "/movies", label: "Movies", icon: null },
    { href: "/leisure", label: "Leisure", icon: null },
    { href: "/accommodations", label: "Accommodations", icon: null },
    { href: "/travel", label: "Travel", icon: null },
  ];

  const handleSignOut = async () => {
    const toastId = toast.loading("Please wait while we sign you out");
    try {
      await signOut({ callbackUrl: "/" });
      toast.dismiss(toastId);
      onClose();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to sign out", {
        description: "An error occurred while signing out. Please try again.",
      });
      console.error(error);
    }
  };

  // Animation timeline
  useEffect(() => {
    if (!isOpen) return;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const tl = gsap.timeline();

      // Set initial states
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(sidebarRef.current, { x: "-100%" });
      gsap.set(logoRef.current, { opacity: 0, y: -20 });
      gsap.set(linksRef.current, { opacity: 0, y: 20 });
      gsap.set(userSectionRef.current, { opacity: 0, y: 20 });

      // Animate in sequence
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
        .to(
          sidebarRef.current,
          {
            x: "0%",
            duration: 0.4,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .to(
          logoRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        )
        .to(
          linksRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .to(
          userSectionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.1"
        );
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div ref={logoRef}>
            <Link href="/" className="text-[#183264] text-base font-semibold">
              <Image src={Logo} className="w-[150px]" alt="HarmonyBookMe" />
            </Link>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-primary hover:bg-muted/50 transition-colors duration-300 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-[14px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div ref={linksRef} className="">
          <div className="">
            {/* Main navigation links */}
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between gap-3 px-4 py-5 text-primary hover:bg-muted/50 hover:text-primary transition-all duration-300 group border-muted border-b"
              >
                <span className="font-medium text-[13px]">{link.label}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.7"
                  stroke="currentColor"
                  className="size-[14px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </Link>
            ))}

            {/* User-specific links when logged in */}
            {session && (
              <>
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 px-4 py-5 text-primary hover:bg-muted/50 hover:text-primary transition-all duration-300 group border-muted border-b"
                >
                  <span className="font-medium text-[13px]">Profile</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="size-[14px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </Link>
                <Link
                  href="/notifications"
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 px-4 py-5 text-primary hover:bg-muted/50 hover:text-primary transition-all duration-300 group border-muted border-b"
                >
                  <span className="font-medium text-[13px]">Notifications</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="size-[14px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </Link>
                <Link
                  href="/bookings"
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 px-4 py-5 text-primary hover:bg-muted/50 hover:text-primary transition-all duration-300 group border-muted border-b"
                >
                  <span className="font-medium text-[13px]">Bookings</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="size-[14px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </Link>

                {/* Sign Out button */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-between gap-3 px-4 py-5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 group border-muted border-b w-full text-left"
                >
                  <span className="font-medium text-[13px]">Sign Out</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="size-[14px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomMobileNav;