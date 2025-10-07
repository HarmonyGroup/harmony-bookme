"use client";

import React, { useState } from "react";
import { usePreventZoom } from "@/hooks/use-prevent-zoom";
import CustomModal from "@/components/ui/custom-modal";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface AuthModalProps {
  showModal: boolean;
  toggleModal: () => void;
  redirectUrl?: string;
}

const AuthModal = ({ showModal, toggleModal, redirectUrl }: AuthModalProps) => {
  const [view, setView] = useState("login");
  
  // Prevent zoom on mobile when focusing inputs
  usePreventZoom();

  return (
    <CustomModal isOpen={showModal} onClose={toggleModal} className="p-6 pt-10 md:p-8 md:!py-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-primary text-lg md:text-xl font-semibold">
            {view === "login" ? "Welcome Back!" : "Get Started"}
          </h2>
          <p className="text-gray-600 text-xs leading-relaxed">
            {view === "login"
              ? "Please enter your credentials to continue."
              : "Please enter your information to create an account."}
          </p>
        </div>

          {view === "login" ? (
            <LoginForm
              onSuccess={toggleModal}
              onSwitchToSignup={() => setView("signup")}
              redirectUrl={redirectUrl}
            />
          ) : (
            <SignupForm
              onSuccess={toggleModal}
              onSwitchToLogin={() => setView("login")}
            />
          )}
      </div>
    </CustomModal>
  );
};

export default AuthModal;