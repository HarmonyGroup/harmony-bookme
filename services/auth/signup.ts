/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type RegisterData = {
  role: "explorer" | "vendor" | "super_admin" | "sub_admin";
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  email: string;
  password: string;
  avatar?: string;
  permissions?: string[];
};

// export const useSignup = () => {
//   const router = useRouter();

//   return useMutation({
//     mutationFn: async (data: RegisterData) => {
//       const response = await fetch("/api/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || "Signup failed");
//       }

//       return response.json();
//     },
//     onSuccess: async (data, variables) => {
//       toast.success(data?.message || "Account created successfully");

//       // After successful registration, sign in the user
//       const result = await signIn("credentials", {
//         email: variables.email,
//         password: variables.password,
//         redirect: false,
//       });

//       if (result?.error) {
//         throw new Error(result.error);
//       }

//       console.log(result?.error);
      

//       // Redirect to home or role-specific dashboard after successful login
//       const redirectPath =
//         variables.role === "explorer"
//           ? "/"
//           : variables.role === "vendor"
//           ? "/vendor/dashboard"
//           : "/back-office/dashboard";
//       router.push(redirectPath);
//       router.refresh();
//     },
//     onError: (error: any) => {
//       toast.error(error.message || "Failed to create account");
//     },
//   });
// };




export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create account");
      }

      return response.json();
    },
    onSuccess: async (data, variables) => {
      // After successful registration, sign in the user
      const result = await signIn("credentials", {
        email: variables.email,
        password: variables.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirect to role-specific dashboard after successful login
      const redirectPath =
        variables.role === "explorer"
          ? "/"
          : variables.role === "vendor"
          ? "/vendor/dashboard"
          : "/back-office/dashboard";
      
      router.push(redirectPath);
      router.refresh();
    },
  });
};