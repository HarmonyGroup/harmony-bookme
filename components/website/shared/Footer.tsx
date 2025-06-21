import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { FaInstagram } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { IoLogoTiktok } from "react-icons/io5";
import { BsTwitterX } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-primary">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-white text-sm font-semibold">Services</h3>
            <ul className="space-y-4 text-xs font-medium mt-6">
              <li>
                <Link href={"/events"} className="text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link href={"/movies"} className="text-white">
                  Movies
                </Link>
              </li>
              <li>
                <Link href={"/leisure"} className="text-white">
                  Leisure
                </Link>
              </li>
              <li>
                <Link href={"/accommodation"} className="text-white">
                  Accommodation
                </Link>
              </li>
              <li>
                <Link href={"/travel"} className="text-white">
                  Travel
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-4 text-xs font-medium mt-6">
              <li>
                <Link href={"/helpdesk"} className="text-white">
                  Helpdesk
                </Link>
              </li>
              <li>
                <Link href={"/resource-center"} className="text-white">
                  Resource center
                </Link>
              </li>
              <li>
                <Link href={"/ticket-resolution"} className="text-white">
                  Ticket resolution
                </Link>
              </li>
              <li>
                <Link href={"/customer-success"} className="text-white">
                  Customer success
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold">Company</h3>
            <ul className="space-y-4 text-xs font-medium mt-6">
              <li>
                <Link href={"/about"} className="text-white">
                  About
                </Link>
              </li>
              <li>
                {" "}
                <Link href={"/contact"} className="text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href={"/careers"} className="text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href={"/press-center"} className="text-white">
                  Press center
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold">
              Connect with us
            </h3>
            <div className="inline-flex flex-row items-center gap-4 mt-6">
              <Link
                href={"/"}
                className="!bg-white/10 size-[38px] flex items-center justify-center rounded-lg p-2"
              >
                <FaInstagram size={20} className="text-white" />
              </Link>
              <Link
                href={"/"}
                className="!bg-white/10 size-[38px] flex items-center justify-center rounded-lg p-2"
              >
                <FaSquareFacebook size={20} className="text-white" />
              </Link>
              <Link
                href={"/"}
                className="!bg-white/10 size-[38px] flex items-center justify-center rounded-lg p-2"
              >
                <IoLogoTiktok size={19} className="text-white" />
              </Link>
              <Link
                href={"/"}
                className="!bg-white/10 size-[38px] flex items-center justify-center rounded-lg p-2"
              >
                <BsTwitterX size={15} className="text-white" />
              </Link>
            </div>
          </div>
        </div>
        <Separator className="bg-white/15 my-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-white font-semibold">Never miss an update</h3>
            <p className="max-w-lg text-white/80 text-xs/relaxed font-light mt-2">
              From trending events to hidden gems, new experiences, and blog
              content you actually want to read — we&apos;ll drop the latest
              straight in your inbox.
            </p>
          </div>
          <div className="md:justify-items-end">
            <div className="w-full flex md:justify-end gap-2">
              <Input
                placeholder="you@email.com"
                className="w-full bg-white/15 text-white md:max-w-sm border-none p-6 placeholder:text-white/80 placeholder:text-xs"
              />
            </div>
            <div>
              <div className="flex items-start gap-3 mt-4">
                <Checkbox id="toggle" />
                <Label
                  htmlFor="toggle"
                  className="text-white text-xs/relaxed font-light z-50 opacity-100"
                >
                  I agree to receive marketing emails from Harmony Bookme
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;