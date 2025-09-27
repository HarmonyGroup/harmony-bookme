"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import BG from "@/public/assets/dreamy-atmosphere-pastel-colored-scene-travel-content.jpg";
import Logo from "@/public/assets/logo-wordmark-light.png";
import { useSignIn } from "@/services/auth/login";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

const Page = () => {
  const router = useRouter();
  const { signIn, isPending } = useSignIn();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    signIn(data, {
      onSuccess: () => {
        toast.success("Signed in successfully");
        router.push("/");
      },
    });
  };

  return (
    <section>
      <div className="grid gap-0 md:h-screen md:grid-cols-3">
        <div className="flex items-center justify-center px-5 py-16 md:px-10 md:py-20 md:col-span-2">
          <div className="w-full mx-auto md:max-w-md ">
            <h2 className="mb-2 text-primary text-xl md:text-xl font-semibold">
              Explorer Login
            </h2>
            <p className="text-gray-600 text-[12px] mb-8 md:mb-12 lg:mb-12">
              Enter your credentials in the form below
            </p>
            <Form {...form}>
              <div className="pb-4">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
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
                            className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-xs font-medium gap-0.5">
                          Password
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter password"
                            {...field}
                            className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            type="password"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="flex items-center justify-center bg-primary w-full text-xs font-semibold !py-6 cursor-pointer hover:bg-primary/90 transition-all ease-in-out duration-300"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <span className="loader"></span>
                    ) : (
                      <span>Login</span>
                    )}
                  </Button>
                </form>
              </div>
            </Form>
            <p className="text-xs text-gray-700">
              Don&apos;t have an explorer account yet?{" "}
              <Link
                href="/auth/explorer/signup"
                className="font-semibold text-[#183264] hover:underline underline-offset-2 transition-all ease-in-out duration-300"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>

        <div className="-order-1 h-full relative p-1.5">
          <div className="relative h-full overflow-hidden rounded-xl p-4">
            <Image
              src={BG}
              layout="fill"
              objectFit="cover"
              alt="Harmony BookMe"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary/75"></div>
            <div className="relative p-4">
              <Link href={"/"}>
                <Image src={Logo} className="w-[200px]" alt="Harmony BookMe" />
              </Link>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/20 rounded-lg p-4 border border-white/20">
                <p className="text-white text-xs/relaxed">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Harum et magni repudiandae commodi, vero suscipit architecto
                  aut autem illum rem porro perferendis blanditiis ipsum sint,
                  nam aspernatur ad alias. Amet.
                </p>

                <p className="text-white text-[13px] font-semibold mt-6">Olusegun Adebayo</p>
                <p className="text-white text-xs font-medium mt-1">Harmony Group</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
