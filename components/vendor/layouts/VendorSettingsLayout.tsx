"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import DeleteAccountModal from "../settings/DeleteAccountModal";

const VendorSettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  const navLinks = [
    { href: "/vendor/settings", label: "General" },
    { href: "/vendor/settings/security", label: "Security" },
    { href: "/vendor/settings/payments", label: "Payments" },
  ];

  return (
    <>
      <div className="h-full bg-white rounded-lg">
        <div className="h-full grid grid-cols-5">
          <div className="h-full col-span-1">
            <div className="flex h-full flex-col justify-between border-e border-gray-200/80 bg-white p-5">
              <div>
                <ul className="space-y-3">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`block rounded-lg px-4 py-3 text-xs font-medium transition-all duration-300 ease-in-out
                          ${
                            isActive
                              ? "bg-muted text-primary"
                              : "text-gray-500 hover:bg-muted hover:text-primary"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Button
                      variant={"destructive"}
                      onClick={() => setDeleteAccountModal(true)}
                      className="block rounded-lg !px-4 !py-3 text-red-500 text-xs font-medium !bg-white border-none shadow-none cursor-pointer"
                    >
                      Delete Account
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-span-4">{children}</div>
        </div>
      </div>

      <DeleteAccountModal
        showModal={deleteAccountModal}
        toggleModal={() => setDeleteAccountModal(!deleteAccountModal)}
      />
    </>
  );
};

export default VendorSettingsLayout;