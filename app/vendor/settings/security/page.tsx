"use client";

import React, { useState } from "react";
import VendorSettingsLayout from "@/components/vendor/layouts/VendorSettingsLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import SecuritySkeleton from "@/components/vendor/settings/SecuritySkeleton";

const FormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});

const Page = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      security_emails: true,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <section className="h-full flex flex-col">
      <div className="border-b border-gray-200/80 p-4 md:px-5 md:py-6">
        <h3 className="text-primary text-lg font-semibold">Security</h3>
        <p className="text-gray-500 text-xs mt-1">
          Manage your security settings and set preferences
        </p>
      </div>

      <VendorSettingsLayout>
        <div className="px-6 py-5">
          {isLoading ? (
            <SecuritySkeleton />
          ) : (
            <Form {...form}>
              <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              {/* <Separator /> */}
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <FormLabel className="text-gray-600 text-xs font-medium">
                    Password
                  </FormLabel>
                  <FormDescription className="text-gray-600 text-[11px] font-light">
                    Set a unique password to protect your account.
                  </FormDescription>
                </div>
                <Button
                  variant={"outline"}
                  className="text-[#292673] text-xs shadow-none cursor-pointer py-4 bg-[#292673]/10 border-none hover:text-[#292673]"
                  onClick={() => setChangePasswordModal(true)}
                >
                  Change password
                </Button>
                {/* <ChangePasswordModal
                showModal={changePasswordModal}
                toggleModal={() => setChangePasswordModal(!changePasswordModal)}
              /> */}
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <FormLabel className="text-gray-600 text-xs font-medium">
                    Transaction Pin
                  </FormLabel>
                  <FormDescription className="text-gray-600 text-[11px] font-light">
                    Set a unique pin to authorize transactions.
                  </FormDescription>
                </div>
                <Button
                  variant={"outline"}
                  className="text-[#292673] text-xs shadow-none cursor-pointer py-4 bg-[#292673]/10 border-none hover:text-[#292673]"
                  onClick={() => setChangePasswordModal(true)}
                >
                  Create pin
                </Button>
                {/* <ChangePasswordModal
                showModal={changePasswordModal}
                toggleModal={() => setChangePasswordModal(!changePasswordModal)}
              /> */}
              </div>
              {/* <Separator /> */}
              <FormField
                control={form.control}
                name="marketing_emails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-1.5">
                      <FormLabel className="text-gray-600 text-xs font-medium">
                        2FA (Two-Factor Authentication)
                      </FormLabel>
                      <FormDescription className="text-gray-600 text-[11px] font-light">
                        Make your account extra secure. Along with your
                        password, you&apos;ll need to enter a code.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#292673]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* <Separator /> */}
              </form>
            </Form>
          )}
        </div>
      </VendorSettingsLayout>
    </section>
  );
};

export default Page;