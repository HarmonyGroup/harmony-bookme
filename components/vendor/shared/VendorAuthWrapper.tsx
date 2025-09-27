"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import VendorSplashScreen from "./VendorSplashScreen";
import VendorUnauthorized from "./VendorUnauthorized";

interface VendorAuthWrapperProps {
  children: React.ReactNode;
}

const VendorAuthWrapper: React.FC<VendorAuthWrapperProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If session is loading, show splash screen
  if (status === "loading") {
    return <VendorSplashScreen />;
  }

  // If no session and not loading, show unauthorized component
  if (status === "unauthenticated") {
    return <VendorUnauthorized onLoginClick={() => router.push("/auth/vendor/login")} />;
  }

  // If session exists, render children
  if (session) {
    return <>{children}</>;
  }

  // Fallback (should not reach here)
  return <VendorSplashScreen />;
};

export default VendorAuthWrapper;
