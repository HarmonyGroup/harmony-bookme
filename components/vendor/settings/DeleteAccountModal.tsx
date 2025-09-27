import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DeleteAccountModalProps {
  showModal: boolean;
  toggleModal: () => void;
}

const FormSchema = z.object({
  confirmation: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const DeleteAccountModal = ({
  showModal,
  toggleModal,
}: DeleteAccountModalProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      confirmation: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <Dialog open={showModal} onOpenChange={toggleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base">Delete Account</DialogTitle>
          <DialogDescription className="text-xs/relaxed font-light text-gray-700">
            Are you sure you want to delete your account? This action cannot be
            reversed. Type{" "}
            <span className="text-gray-900 font-semibold">
              &quot;Delete account&quot;
            </span>{" "}
            below to confirm
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-1"
          >
            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Type here"
                      {...field}
                      className="text-xs placeholder:text-xs !h-0 !py-5 border shadow-xs outline-none ring-0 focus:shadow-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </form>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant={"outline"}
              className="text-xs border-none shadow-none cursor-pointer"
              onClick={toggleModal}
            >
              Cancel
            </Button>
            <Button variant={"destructive"} className="text-xs cursor-pointer">
              Delete
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;