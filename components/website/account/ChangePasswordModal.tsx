"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

const ChangePasswordModal = () => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className="text-primary text-xs shadow-none cursor-pointer py-4 border border-primary hover:text-primary hover:bg-primary/10"
          >
            Change password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl p-7">
          <DialogHeader>
            <DialogTitle className="text-[17px]">Change password</DialogTitle>
            <DialogDescription className="text-gray-700 text-xs -mt-1">
              Set a unique password to protect your account. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <PasswordForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant={"outline"}
          className="text-primary text-xs shadow-none cursor-pointer py-4 border border-primary hover:text-primary hover:bg-primary/10"
        >
          Change password
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Change password</DrawerTitle>
          <DrawerDescription className="text-gray-700 text-xs/relaxed">
            Set a unique password to protect your account. Click save when
            you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-scroll px-4">
          <PasswordForm />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ChangePasswordModal;

const PasswordForm = ({}: React.ComponentProps<"form">) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 text-xs font-medium">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter password"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 text-xs font-medium">
                  Confirm password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm password"
                    {...field}
                    className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full md:w-fit text-xs font-semibold float-right mt-6 cursor-pointer !py-6 md:!py-5"
        >
          Save changes
        </Button>
      </form>
    </Form>
  );
};
