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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/public/assets/logo-wordmark-dark.png";
import { signOut } from "next-auth/react";
import { IoMdArrowDropdown } from "react-icons/io";
import ResponsiveSidebar from "./ResponsiveSidebar";

const Navbar = () => {
  const { data: session, status } = useSession();

  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const buttonsRef = useRef([]);

  console.log(session);

  // Reset refs array
  linksRef.current = [];
  buttonsRef.current = [];

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
    <header className="bg-white border-b">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center md:gap-12">
            <Link href={"/"} className="text-[#183264] text-base font-semibold">
              <Image src={Logo} className="w-40 md:w-48" alt="HarmonyBookMe" />
            </Link>
          </div>

          <div className="hidden lg:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-10 text-[13px] font-semibold">
                <li>
                  <Link className="text-primary transition" href="/">
                    {" "}
                    Discover{" "}
                  </Link>
                </li>
                <li>
                  <Link className="text-primary transition" href="/events">
                    {" "}
                    Events{" "}
                  </Link>
                </li>
                <li>
                  <Link className="text-primary transition" href="/">
                    {" "}
                    Movies{" "}
                  </Link>
                </li>
                <li>
                  <Link className="text-primary transition" href="/">
                    {" "}
                    Recreation{" "}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-primary transition"
                    href="/accommodations"
                  >
                    {" "}
                    Accommodations{" "}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="hidden lg:block">
            {status === "loading" || status === "unauthenticated" ? (
              <div className="flex items-center gap-3">
                <Link
                  href={"/auth/explorer/login"}
                  className="text-primary text-[13px] font-medium border border-primary rounded-full px-5 py-2"
                >
                  Login
                </Link>
                <Link
                  href={"/auth/explorer/signup"}
                  className="bg-primary text-white text-[13px] font-medium rounded-full px-5 py-2.5 hover:bg-primary/90 transition ease-in-out duration-300"
                >
                  Get started
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 cursor-pointer !ring-0 !outline-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-primary size-5 md:size-[13px]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-primary text-[13px] font-semibold hidden md:block">
                    {session?.user?.name}
                  </span>
                  <IoMdArrowDropdown size={18} className="text-primary" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[160px] shadow-xs space-y-1 border-none rounded-t-none mt-9 p-3"
                >
                  <div className="flex items-center gap-2 p-2 py-4 pr-8">
                    <div className="size-8 flex items-center justify-center text-white text-sm font-medium bg-gradient-to-r from-primary to-primary rounded-full">
                      {session?.user?.name?.[0]}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-primary text-[13px] font-medium">
                        {session?.user?.name}
                      </span>
                      <span className="text-gray-500 text-[11px]">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem>
                    <Link
                      href={"/account"}
                      className="w-full flex items-center gap-2 text-primary !text-[12px] font-medium cursor-pointer px-2 py-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="text-primary size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={"/account"}
                      className="w-full flex items-center gap-2 text-primary !text-[12px] font-medium cursor-pointer px-2 py-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="text-primary size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                        />
                      </svg>
                      Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={"/help-center"}
                      className="w-full flex items-center gap-2 text-primary !text-[12px] font-medium cursor-pointer px-2 py-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="text-primary size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                        />
                      </svg>
                      Help center
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 text-primary !text-[12px] font-medium cursor-pointer !px-4 !py-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="text-primary size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                      />
                    </svg>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="block lg:hidden">
            <ResponsiveSidebar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;