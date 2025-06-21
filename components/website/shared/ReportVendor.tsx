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
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { Checkbox } from "@/components/ui/checkbox";

interface ReportVendorProps {
  showModal: boolean;
  toggleModal: () => void;
}

const items = [
  {
    id: "recents",
    label:
      "Misleading or inaccurate listing (e.g., false descriptions, photos)",
  },
  {
    id: "home",
    label: "Poor service or experience (e.g., unresponsive, unprofessional)",
  },
  {
    id: "applications",
    label: "Inappropriate content (e.g., offensive or illegal)",
  },
  {
    id: "desktop",
    label: "Suspected fraud or scam",
  },
  {
    id: "downloads",
    label: "Other (please specify)",
  },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Please select at least one reason.",
  }),
});

const ReportVendor = ({ showModal, toggleModal }: ReportVendorProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={showModal} onOpenChange={toggleModal}>
        <DialogContent className="sm:max-w-xl p-7">
          <DialogHeader>
            <DialogTitle className="text-[17px]">Report Vendor</DialogTitle>
            <DialogDescription className="text-gray-700 text-xs/relaxed -mt-1">
              Help us maintain a safe and trustworthy community.
            </DialogDescription>
          </DialogHeader>
          <ReportForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={showModal} onOpenChange={toggleModal}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Report vendor</DrawerTitle>
          <DrawerDescription className="text-gray-700 text-xs/relaxed">
            Set a unique password to protect your account. Click save when
            you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-scroll px-4">
          <ReportForm />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ReportVendor;

const ReportForm = ({}: React.ComponentProps<"form">) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                {items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-center gap-2 my-2"
                        >
                          <FormControl>
                            <Checkbox
                              className="cursor-pointer"
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-gray-600 text-xs font-normal cursor-pointer">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full md:w-fit text-xs font-semibold float-right mt-6 cursor-pointer !py-5 md:!py-5"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};