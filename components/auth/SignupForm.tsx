"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useSignup } from "@/services/auth/signup";

const SignupFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["explorer"]),
});

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const SignupForm = ({ onSuccess, onSwitchToLogin }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signup, isPending: signupPending } = useSignup();

  const signupForm = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "explorer",
    },
  });

  const onSignupSubmit = (data: z.infer<typeof SignupFormSchema>) => {
    signup(data, {
      onSuccess: () => {
        toast.success("Signed up successfully");
        onSuccess();
        signupForm.reset();
      },
    });
  };

  return (
    <div>
      <Form {...signupForm}>
        <div className="!mt-8">
          <form
            onSubmit={signupForm.handleSubmit(onSignupSubmit)}
            className="space-y-5"
          >
            <FormField
              control={signupForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-xs font-medium gap-0.5">
                    First Name
                    <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter first name"
                      {...field}
                      className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 auth-modal"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-xs font-medium gap-0.5">
                    Last Name
                    <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter last name"
                      {...field}
                      className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 auth-modal"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-xs font-medium gap-0.5">
                    Email
                    <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email address"
                      {...field}
                      className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 auth-modal"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-xs font-medium gap-0.5">
                    Password
                    <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter password"
                        {...field}
                        className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 auth-modal"
                        type={showPassword ? "text" : "password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? (
                          <BsEyeSlash size={16} />
                        ) : (
                          <BsEye size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="flex items-center justify-center bg-primary w-full text-xs font-semibold !py-6 cursor-pointer hover:bg-primary/90 transition-all ease-in-out duration-300"
              disabled={signupPending}
            >
              {signupPending ? (
                <span>
                  <Loader2 className="animate-spin size-5" />
                </span>
              ) : (
                <span>Signup</span>
              )}
            </Button>
          </form>
        </div>
      </Form>
      <p className="text-[11px] md:text-xs text-gray-600 mt-4">
        Already have an account?{" "}
        <span
          className="font-semibold text-primary hover:underline underline-offset-2 transition-all ease-in-out duration-300 cursor-pointer"
          onClick={onSwitchToLogin}
        >
          Login
        </span>
      </p>
    </div>
  );
};

