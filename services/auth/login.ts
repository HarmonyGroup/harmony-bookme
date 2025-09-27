"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { toast } from "react-toastify";

type LoginCredentials = {
  email: string;
  password: string;
};

export const useSignIn = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign in");
    },
  });

  return {
    signIn: mutation.mutate,
    isPending: mutation.isPending,
  };
};
