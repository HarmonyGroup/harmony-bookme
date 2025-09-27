import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import NewsletterBackground from "@/public/assets/newsletter-background.jpg";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useNewsletterSubscription } from "@/services/shared/newsletter";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ModalProps {
  showModal: boolean;
  toggleModal: () => void;
}

const FormSchema = z.object({
  name: z.string(),
  email: z.string(),
});

const NewsletterSubscription = ({ showModal, toggleModal }: ModalProps) => {
  const { mutate: subscribe, isPending } = useNewsletterSubscription();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const closeModal = () => {
    toggleModal();
    form.reset();
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    const payload = {
      isNewsletterSubscribed: true,
    };
    subscribe(payload, {
      onSuccess: (response) => {
        toast.success(
          response.message ?? "Subscribed to newsletter successfully"
        );
        closeModal();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Something went wrong");
      },
    });
  };

  return (
    <>
      <Dialog open={showModal} onOpenChange={() => closeModal()}>
        <DialogContent className="!w-full !max-w-3xl !p-0 border-none overflow-hidden">
          <div className="grid grid-cols-2 items-center gap-2">
            <div className="h-96 relative flex items-end justify-start bg-muted overflow-hidden">
              <Image
                src={NewsletterBackground}
                alt="harmonybookme.com"
                className="object-cover"
                fill
              />
              <div className="absolute h-full w-full bg-gradient-to-b from-primary/30 to-primary/75"></div>
              <div className="relative z-10 p-4">
                <h1 className="text-white text-xl font-semibold">
                  Stay Updated
                </h1>
                <p className="text-white text-xs mt-1">
                  Ideas for your next holiday, every week in your inbox.
                </p>
              </div>
            </div>
            <div className="px-4">
              <DialogHeader className="gap-1.5">
                <DialogTitle className="text-primary text-lg">
                  Newsletter
                </DialogTitle>
                {/* <DialogDescription className="text-xs">
                  Ideas for your next holiday, every week in your inbox.
                </DialogDescription> */}
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-4 mt-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-[11px]">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-gray-900 !text-xs placeholder:text-[11px] placeholder:font-normal !h-0 py-5 border shadow-xs outline-none ring-0 focus:shadow-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            placeholder="John Doe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-[11px]">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-gray-700 !text-xs placeholder:text-[11px] placeholder:font-normal !h-0 py-5 border shadow-xs outline-none ring-0 focus:shadow-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            placeholder="you@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary text-xs !py-5 cursor-pointer"
                  >
                    {isPending ? (
                      <span>
                        <Loader2 className="animate-spin" />
                      </span>
                    ) : (
                      <span>Subscribe</span>
                    )}
                  </Button>
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => closeModal()}
                      className="inline-block mx-auto text-primary text-center text-[11px] font-medium cursor-pointer -mt-1"
                    >
                      No, Thanks
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewsletterSubscription;