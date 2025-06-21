import React from "react";
import Link from "next/link";
import Image from "next/image";
import BG from "@/public/assets/help-desk-banner.jpg";

const Page = () => {
  return (
    <div>
      <section className="relative h-[50vh] w-full bg-primary flex flex-col items-center justify-center overflow-x-hidden">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
          <Image
            src={BG}
            layout="fill"
            objectFit="cover"
            alt="Harmony BookMe"
            className="blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-primary/60"></div>
          <div className="relative flex flex-col items-center justify-center">
            <h1 className="mb-5 text-white text-center text-4xl font-bold md:text-4xl">
              How can we help?
            </h1>
          </div>
        </div>
      </section>
      <div className="mx-auto w-full h-full max-w-7xl px-4 py-16">
        <div>
          <h3 className="text-primary text-base md:text-lg/tight font-semibold">
            New to Harmony Bookme? Start here
          </h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6 mt-10">
            <div className="bg-gray-100/70 rounded-lg p-5">
              <h3 className="text-primary text-sm font-semibold">General</h3>
              <p className="text-gray-600 text-xs/relaxed line-clamp-3 mt-2 mb-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et,
                illum similique? Provident, odit aliquam! Provident totam
                expedita reiciendis aut quia eius, facere explicabo magnam fuga
                reprehenderit accusantium est sint ducimus!
              </p>
              <Link
                href={"/"}
                className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold"
              >
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="size-[14px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg> */}
                See resources
              </Link>
            </div>
            <div className="bg-gray-100/70 rounded-lg p-5">
              <h3 className="text-primary text-sm font-semibold">Explorer</h3>
              <p className="text-gray-600 text-xs/relaxed line-clamp-3 mt-2 mb-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et,
                illum similique? Provident, odit aliquam! Provident totam
                expedita reiciendis aut quia eius, facere explicabo magnam fuga
                reprehenderit accusantium est sint ducimus!
              </p>
              <Link
                href={"/"}
                className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold"
              >
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="size-[14px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg> */}
                See resources
              </Link>
            </div>
            <div className="bg-gray-100/70 rounded-lg p-5">
              <h3 className="text-primary text-sm font-semibold">Merchant</h3>
              <p className="text-gray-600 text-xs/relaxed line-clamp-3 mt-2 mb-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et,
                illum similique? Provident, odit aliquam! Provident totam
                expedita reiciendis aut quia eius, facere explicabo magnam fuga
                reprehenderit accusantium est sint ducimus!
              </p>
              <Link
                href={"/"}
                className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold"
              >
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="size-[14px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg> */}
                See resources
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-14">
          <h3 className="text-primary text-base md:text-lg/tight font-semibold">
            Suggested Articles
          </h3>
          <div className="space-y-6 mt-10">
            <div className="bg-gray-100/70 rounded-md p-4">
              <Link href={"/"} className="group">
                <h4 className="group-hover:underline underline-offset-2 text-[13px] font-semibold">
                  How to contact support
                </h4>
                <p className="text-gray-600 text-xs/relaxed line-clamp-2 mt-1.5">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Sint, quam quo reiciendis, dicta quasi hic laudantium libero
                  eveniet sunt quod doloremque magni sequi repellendus totam
                  esse, quos nam? Corporis, labore?
                </p>
              </Link>
            </div>
            <div className="bg-gray-100/70 rounded-md p-4">
              <Link href={"/"} className="group">
                <h4 className="group-hover:underline underline-offset-2 text-[13px] font-semibold">
                  How to contact support
                </h4>
                <p className="text-gray-600 text-xs/relaxed line-clamp-2 mt-1.5">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Sint, quam quo reiciendis, dicta quasi hic laudantium libero
                  eveniet sunt quod doloremque magni sequi repellendus totam
                  esse, quos nam? Corporis, labore?
                </p>
              </Link>
            </div>
            <div className="bg-gray-100/70 rounded-md p-4">
              <Link href={"/"} className="group">
                <h4 className="group-hover:underline underline-offset-2 text-[13px] font-semibold">
                  How to contact support
                </h4>
                <p className="text-gray-600 text-xs/relaxed line-clamp-2 mt-1.5">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Sint, quam quo reiciendis, dicta quasi hic laudantium libero
                  eveniet sunt quod doloremque magni sequi repellendus totam
                  esse, quos nam? Corporis, labore?
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;