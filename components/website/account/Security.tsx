import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
// import DeleteAccountModal from "@/components/vendor/settings/DeleteAccountModal";
import ChangePasswordModal from "./ChangePasswordModal";

const FormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});

const Security = () => {
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
    <>
      <div>
        <h3 className="text-primary text-base font-semibold">Security</h3>

        <div className="mt-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="marketing_emails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-1">
                      <FormLabel className="text-gray-700 text-[13px]">
                        Two Factor Authentication
                      </FormLabel>
                      <FormDescription className="text-[11px]">
                        Increase your account&apos;s security by setting up two
                        factor authentication
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="cursor-pointer"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Separator />

              <div className="flex items-center justify-between">
                <div className=" space-y-1">
                  <Label className="text-gray-700 text-[13px]">
                    Reset Password
                  </Label>
                  <p className="text-gray-500 text-[11px]">
                    Increase your account&apos;s security by setting up two factor
                    authentication
                  </p>
                </div>

                {/* <Button className="text-primary text-[11px] bg-white hover:bg-muted cursor-pointer border border-primary !h-fit !w-fit !px-3 !py-1.5">
                  Reset
                </Button> */}
                <ChangePasswordModal />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className=" space-y-1">
                  <Label className="text-gray-700 text-[13px]">
                    Delete Account
                  </Label>
                  <p className="text-gray-500 text-[11px]">
                    Increase your account&apos;s security by setting up two factor
                    authentication
                  </p>
                </div>

                <Button className="bg-white text-red-600 text-xs cursor-pointer border border-red-600 hover:bg-red-50 !h-fit !w-fit !px-3 !py-1.5">
                  Delete
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Security;