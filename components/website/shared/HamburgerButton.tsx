"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ 
  isOpen, 
  onClick, 
  className = "" 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const line1Ref = useRef<SVGLineElement>(null);
  const line2Ref = useRef<SVGLineElement>(null);
  const line3Ref = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!line1Ref.current || !line2Ref.current || !line3Ref.current) return;

    const tl = gsap.timeline();

    if (isOpen) {
      // Transform to X
      tl.to(line2Ref.current, {
        scaleX: 0,
        duration: 0.2,
        ease: "power2.inOut",
      })
      .to(
        [line1Ref.current, line3Ref.current],
        {
          rotation: 45,
          transformOrigin: "center",
          duration: 0.3,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        line3Ref.current,
        {
          y: -6,
          duration: 0.3,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        line1Ref.current,
        {
          y: 6,
          duration: 0.3,
          ease: "power2.inOut",
        },
        0
      );
    } else {
      // Transform back to hamburger
      tl.to(
        [line1Ref.current, line3Ref.current],
        {
          rotation: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.inOut",
        }
      )
      .to(
        line2Ref.current,
        {
          scaleX: 1,
          duration: 0.2,
          ease: "power2.inOut",
        },
        0.1
      );
    }
  }, [isOpen]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer ${className}`}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <line
          ref={line1Ref}
          x1="3"
          y1="6"
          x2="18"
          y2="6"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <line
          ref={line2Ref}
          x1="3"
          y1="12"
          x2="18"
          y2="12"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <line
          ref={line3Ref}
          x1="3"
          y1="18"
          x2="18"
          y2="18"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};

export default HamburgerButton;
