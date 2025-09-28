/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/public/assets/logo-wordmark-dark.png";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import CustomMobileNav from "./CustomMobileNav";
// import HamburgerButton from "./HamburgerButton";
import {
  StorefrontIcon,
  TicketIcon,
  TranslateIcon,
  TrophyIcon,
} from "@phosphor-icons/react";
import NigerianFlag from "@/public/assets/nigerian-flag.svg";
import { MdArrowDropDown } from "react-icons/md";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/AuthModal";
import { Skeleton } from "@/components/ui/skeleton";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const buttonsRef = useRef([]);

  console.log(session);

  // Reset refs array
  linksRef.current = [];
  buttonsRef.current = [];

  const handleSignOut = async (callbackUrl: string = "/") => {
    const toastId = toast.loading("Please wait while we sign you out");

    try {
      await signOut({ callbackUrl });
      toast.dismiss(toastId);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to sign out", {
        description: "An error occurred while signing out. Please try again.",
      });
    }
  };

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Initial animation when component mounts
  useEffect(() => {
    // Navbar fade in
    gsap.fromTo(
      navbarRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    // Logo animation
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: "back.out(1.7)" }
    );

    // Links staggered animation
    gsap.fromTo(
      linksRef.current,
      { opacity: 0, y: -10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.4,
        ease: "power2.out",
      }
    );

    // Buttons staggered animation
    gsap.fromTo(
      buttonsRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.6,
        ease: "elastic.out(1, 0.5)",
      }
    );
  }, []);

  return (
    <>
      <header className="bg-white">
        <div className="border-b border-gray-200/70">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <Link
                  href={"/"}
                  className="text-[#183264] text-base font-semibold"
                >
                  <Image
                    src={Logo}
                    className="w-44 md:w-48 shrink-0"
                    alt="HarmonyBookMe"
                    loading="eager"
                  />
                </Link>
              </div>

              <div className="flex items-center gap-3 md:gap-6">
                <DropdownMenu>
                  <DropdownMenuTrigger className="hidden md:flex items-center gap-3 text-primary text-[13px] font-medium cursor-pointer !outline-0 !ring-0">
                    <div className="flex items-center gap-2 text-primary text-[13px]">
                      <div className="relative size-4 rounded-full">
                        <Image
                          src={NigerianFlag}
                          alt="Nigeria"
                          className=""
                          fill
                          objectFit="cover"
                          loading="eager"
                        />
                      </div>
                      Nigeria
                    </div>
                    <MdArrowDropDown size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mt-4">
                    <DropdownMenuItem className="flex items-center gap-2 text-primary text-[13px] font-medium cursor-pointer">
                      <div className="relative size-4 rounded-full">
                        <Image
                          src={NigerianFlag}
                          alt="Nigeria"
                          className=""
                          fill
                          objectFit="cover"
                          loading="eager"
                        />
                      </div>
                      Nigeria
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger className="hidden md:flex items-center gap-3 text-primary text-[13px] font-medium cursor-pointer !outline-0 !ring-0">
                    <div className="flex items-center gap-2 text-[13px]">
                      <TranslateIcon size={17} />
                      English
                    </div>
                    <MdArrowDropDown size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mt-4">
                    <DropdownMenuItem className="flex items-center gap-2 text-primary text-[13px] font-medium cursor-pointer">
                      <TranslateIcon size={17} weight="bold" />
                      English
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  href={"/auth/vendor/login"}
                  className="md:flex items-center gap-2 text-primary text-[13px] font-medium hidden"
                >
                  <StorefrontIcon size={17} />
                  Vendor
                </Link>

                {/* <Link
                  href={"/auth/explorer/login"}
                  className="bg-primary text-white text-xs font-medium border border-primary rounded-md px-5 py-2 hover:bg-primary/90 transition-colors ease-in-out duration-300"
                >
                  Login
                </Link> */}
                {status === "loading" ? (
                  <Skeleton className="bg-gray-200/80 w-24 h-8" />
                ) : session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-0 ring-0 cursor-pointer hidden md:block">
                      <div className="bg-gradient-to-r from-sky-700 to-[#183264]/90 size-8 rounded-full flex items-center justify-center">
                        <span className="text-white text-[13px] font-semibold">
                          {session.user?.firstName?.[0]}
                          {/* {session.user?.lastName?.[0]} */}
                        </span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="mt-4">
                      <DropdownMenuItem className="text-gray-600 text-xs font-medium">
                        <Link
                          href={"/profile"}
                          className="flex items-center gap-2 text-gray-600 text-xs font-medium w-full cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="size-[15px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-600 text-xs font-medium">
                        <Link
                          href={"/bookings"}
                          className="flex items-center gap-2 text-gray-600 text-xs font-medium w-full cursor-pointer"
                        >
                          <TicketIcon size={15} />
                          Bookings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-600 text-xs font-medium">
                        <Link
                          href={"/notifications"}
                          className="flex items-center gap-2 text-gray-600 text-xs font-medium w-full cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="size-[16px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                            />
                          </svg>
                          Notifications
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSignOut("/")}
                        className="flex items-center gap-2 text-gray-600 text-xs font-medium cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="size-[16px]"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                          />
                        </svg>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-primary text-white rounded-lg px-5 py-2 text-xs md:text-[13px] font-medium cursor-pointer"
                  >
                    Login
                  </Button>
                )}
                <div className="block md:hidden">
                  <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-[20px] text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  </button>
                  {/* <HamburgerButton
                    isOpen={isMobileNavOpen}
                    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block border-b border-gray-200/70">
          <div className="mx-auto max-w-screen-xl px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Link
                  href={"/"}
                  className="text-primary text-[13px] font-medium"
                >
                  Home
                </Link>
                <Link
                  href={"/events"}
                  className="text-primary text-[13px] font-medium"
                >
                  Events
                </Link>
                <Link
                  href={"/movies"}
                  className="text-primary text-[13px] font-medium"
                >
                  Movies
                </Link>
                <Link
                  href={"/leisure"}
                  className="text-primary text-[13px] font-medium"
                >
                  Leisure
                </Link>
                <Link
                  href={"/accommodations"}
                  className="text-primary text-[13px] font-medium"
                >
                  Accommodations
                </Link>
                <Link
                  href={"/travel"}
                  className="text-primary text-[13px] font-medium"
                >
                  Travel
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={"/"}
                  className="flex items-center gap-2 text-primary text-[13px] font-medium"
                >
                  {/* <Image src={CoinIcon} alt="Coin" className="size-4" /> */}
                  <TrophyIcon size={18} />
                  Claim Rewards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      <AuthModal
        showModal={showAuthModal}
        toggleModal={() => setShowAuthModal(!showAuthModal)}
      />
      <CustomMobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
};

export default Navbar;