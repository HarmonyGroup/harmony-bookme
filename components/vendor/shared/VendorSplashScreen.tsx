"use client";

import React from "react";
import Image from "next/image";

const VendorSplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[99999] bg-muted/60 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="relative w-72 h-72 animate-pulse">
          <Image
            loading="eager"
            src="/assets/logo-wordmark-dark.png"
            alt="Harmony Bookme"
            fill
            className="object-contain animate-pulse"
            priority
          />
        </div>
        
        {/* Loading Text */}
        {/* <div className="text-center">
          <h2 className="text-primary text-lg font-semibold mb-2">
            Preparing your dashboard...
          </h2>
          <p className="text-gray-600 text-sm">
            Please wait while we set up your vendor experience
          </p>
        </div> */}
        
        {/* Loading Spinner */}
        {/* <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div> */}
      </div>
    </div>
  );
};

export default VendorSplashScreen;
