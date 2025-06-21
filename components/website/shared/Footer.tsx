// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import Logo from "@/public/assets/logo-wordmark-light.png";

// const Footer = () => {
//   return (
//     <footer className="bg-primary">
//       <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-20 sm:px-6 lg:space-y-20 lg:px-8">
//         <div className="grid grid-cols-1 gap-8 md:gap-24 lg:grid-cols-3">
//           <div>
//             <Link href={"/"} className="text-[#183264] text-base font-semibold">
//               <Image src={Logo} className="w-52 md:w-48" alt="HarmonyBookMe" />
//             </Link>

//             <p className="mt-4 text-white text-xs/relaxed font-medium">
//               We&apos;ve built a platform where you can book everything—from
//               electrifying concerts and must-see movies to essential rentals and
//               unforgettable getaways.
//             </p>

//             <ul className="mt-8 flex gap-6">
//               <li>
//                 <Link
//                   href="/"
//                   rel="noreferrer"
//                   target="_blank"
//                   className="text-gray-300 transition hover:opacity-75"
//                 >
//                   <span className="sr-only">Facebook</span>

//                   <svg
//                     className="size-6"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                     aria-hidden="true"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   href="/"
//                   rel="noreferrer"
//                   target="_blank"
//                   className="text-gray-300 transition hover:opacity-75"
//                 >
//                   <span className="sr-only">Instagram</span>

//                   <svg
//                     className="size-6"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                     aria-hidden="true"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   href="/"
//                   rel="noreferrer"
//                   target="_blank"
//                   className="text-gray-300 transition hover:opacity-75"
//                 >
//                   <span className="sr-only">Twitter</span>

//                   <svg
//                     className="size-6"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                     aria-hidden="true"
//                   >
//                     <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//                   </svg>
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   href="/"
//                   rel="noreferrer"
//                   target="_blank"
//                   className="text-gray-300 transition hover:opacity-75"
//                 >
//                   <span className="sr-only">GitHub</span>

//                   <svg
//                     className="size-6"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                     aria-hidden="true"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4 lg:justify-items-end">
//             <div>
//               <p className="font-semibold text-white text-[13px]">Services</p>
//               <ul className="mt-7 space-y-5 text-[13px] font-medium">
//                 <li>
//                   <Link
//                     href="/"
//                     className="text-white/70 transition hover:text-white ease-in-out duration-300"
//                   >
//                     Events
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/"
//                     className="text-white/70 transition hover:text-white ease-in-out duration-300"
//                   >
//                     Movies
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/"
//                     className="text-white/70 transition hover:text-white ease-in-out duration-300"
//                   >
//                     Leisure
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/"
//                     className="text-white/70 transition hover:text-white ease-in-out duration-300"
//                   >
//                     Accommodation
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <p className="font-semibold text-white text-[13px]">Company</p>
//               <ul className="mt-7 space-y-5 text-xs font-medium">
//                 <li>
//                   <Link
//                     href="/"
//                     className="text-white/70 transition hover:text-white ease-in-out duration-300"
//                   >
//                     About
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/"
//                     className="text-white/70 transition hover:text-white ease-in-out duration-300"
//                   >
//                     Meet the Team
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/"
//                     className="text-white/70 transition hover:text-white ease-in-out duration-300"
//                   >
//                     Ticket Resolution
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <p className="font-semibold text-white text-[13px]">
//                 Helpful Links
//               </p>
//               <ul className="mt-7 space-y-5 text-xs font-medium">
//                 <li>
//                   <Link
//                     href="/"
//                     className="text-white/70 transition hover:text-white ease-in-out duration-300"
//                   >
//                     Contact
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/"
//                     className="text-white/70 transition hover:text-white ease-in-out duration-300"
//                   >
//                     FAQs
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/"
//                     className="text-white/70 transition hover:text-white ease-in-out duration-300"
//                   >
//                     Support
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <p className="font-semibold text-white text-[13px]">Legal</p>
//               <ul className="mt-7 space-y-5 text-xs font-medium">
//                 <li>
//                   <Link
//                     href="/"
//                     className="text-white/70 transition hover:text-white ease-in-out duration-300"
//                   >
//                     Terms and Conditions
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/"
//                     className="text-white/70 transition hover:text-white ease-in-out duration-300"
//                   >
//                     Privacy Policy
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//         {/* <Separator className="bg-white/40" />
//         <p className="text-[13px] text-white font-medium">
//           &copy; 2025. Harmony Bookme. All rights reserved.
//         </p> */}
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
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
            <ul className="space-y-4 mt-6">
              <li>
                <Link href={"/"} className="text-white text-xs font-semibold">
                  Events
                </Link>
              </li>
              <li>
                <Link href={"/"} className="text-white text-xs font-semibold">
                  Movies
                </Link>
              </li>
              <li>
                <Link href={"/"} className="text-white text-xs font-semibold">
                  Leisure
                </Link>
              </li>
              <li>
                <Link href={"/"} className="text-white text-xs font-semibold">
                  Accommodation
                </Link>
              </li>
              <li>
                <Link href={"/"} className="text-white text-xs font-semibold">
                  Travel
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-4 mt-6">
              <li>
                <Link href={"/"} className="text-white text-xs font-semibold">
                  Helpdesk
                </Link>
              </li>
              <li>
                <Link href={"/"} className="text-white text-xs font-semibold">
                  Resource center
                </Link>
              </li>
              <li>
                <Link href={"/"} className="text-white text-xs font-semibold">
                  Ticket resolution
                </Link>
              </li>
              <li>
                <Link href={"/"} className="text-white text-xs font-semibold">
                  Customer success
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold">Company</h3>
            <ul className="space-y-4 mt-6">
              <li>
                <Link href={"/"} className="text-white text-xs font-semibold">
                  About
                </Link>
              </li>
              <li>
                {" "}
                <Link href={"/"} className="text-white text-xs font-semibold">
                  Contact
                </Link>
              </li>
              <li>
                <Link href={"/"} className="text-white text-xs font-semibold">
                  Careers
                </Link>
              </li>
              <li>
                <Link href={"/"} className="text-white text-xs font-semibold">
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
                  className="text-white text-xs font-light z-50 opacity-100"
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