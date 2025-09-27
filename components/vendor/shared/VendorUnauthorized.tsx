"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import UnauthorizedIcon from "@/public/assets/unauthorized-icon.png";
import { useRouter } from "next/navigation";

interface VendorUnauthorizedProps {
  onLoginClick: () => void;
}

const VendorUnauthorized: React.FC<VendorUnauthorizedProps> = ({
  onLoginClick,
}) => {
  void onLoginClick; // Suppress unused parameter warning
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-[99999] bg-muted/60 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Logo */}
          <div className="relative w-12 h-12 mx-auto mb-6">
            <Image
              src={UnauthorizedIcon}
              alt="Harmony Bookme"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Content */}
          <h1 className="text-lg font-semibold text-primary mb-2">
            Unauthorized
          </h1>
          <p className="text-gray-600 text-xs/relaxed mb-8">
            You are not authorized to access the vendor dashboard. Click the
            button below to sign in.
          </p>

          {/* Login Button */}
          <Button
            onClick={() => router.push("/auth/vendor/login")}
            className="w-full bg-primary hover:bg-primary/90 text-white cursor-pointer"
            size="lg"
          >
            Sign In
          </Button>

          {/* Footer */}
          <p className="text-xs text-gray-500 mt-6">Need help signing in?</p>
        </div>
      </div>
    </div>
  );
};

export default VendorUnauthorized;