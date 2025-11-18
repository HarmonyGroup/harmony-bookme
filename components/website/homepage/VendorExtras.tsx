import React from "react";
import Background1 from "@/public/assets/vendor-banner-bg.jpg";
import Background2 from "@/public/assets/vendor-banner-bg-2.jpg";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const VendorExtras = () => {    

  return (
    <section className="py-16 bg-muted/50">
      <div className="mx-auto w-full max-w-7xl px-5">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          {/* <p className="text-sm font-semibold uppercase text-primary tracking-wide mb-3">
            For Vendors
          </p> */}
          <h2 className="text-2xl font-bold text-primary mb-5">
            Grow your brand and <br className="hidden md:block" /> boost revenue
            with Harmony BookMe
          </h2>
          <p className="mx-auto max-w-3xl text-sm/relaxed text-gray-600 leading-relaxed">
            Join thousands of vendors growing their business. List your events,
            movies, accommodations, and leisure activities on Africa&apos;s leading
            booking platform.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {/* Left: Hero Card */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 shadow-xl">
            <div className="absolute inset-0">
              <Image
                src={Background2}
                alt="Vendor Hub"
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
            </div>
            <div className="relative z-10 p-8 md:p-10 h-full min-h-[400px] flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-6">
                  <Zap className="size-4 text-white" />
                  <span className="text-white text-xs font-semibold uppercase tracking-wide">
                    Vendor Hub
                  </span>
                </div>
                <h3 className="text-white text-xl font-bold mb-4">
                  Everything you need to 
                  succeed
                </h3>
                <p className="text-white/90 text-sm/relaxed max-w-xl mb-8">
                  Manage bookings effortlessly, get paid directly, and reach more
                  customers than ever before. Our platform handles the
                  complexity so you can focus on what you do best.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-white text-primary hover:bg-gray-100 font-semibold px-6 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <Link href="/auth/vendor/signup">Get Started Free</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-6 rounded-lg"
                >
                  <Link href="/vendor/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Image Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl h-[400px]">
            <Image
              src={Background1}
              alt="Vendor Success"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <TrendingUp className="size-8 mb-3" />
              <p className="text-lg font-bold mb-1">Track Your Growth</p>
              <p className="text-sm text-white/90">
                Real-time insights and analytics
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorExtras;
