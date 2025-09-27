import React, { useState } from "react";
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
import NewsletterSubscription from "../shared/NewsletterSubscription";
import { ActionModal } from "@/components/vendor/shared/ActionModal";
import { useNewsletterSubscription } from "@/services/shared/newsletter";
import { toast } from "sonner";

const FormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});

const Preferences = () => {
  const isNewsletterSubscribed = true;

  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [unsubscribeNewsletter, setUnsubscribeNewsletter] = useState(false);
  const { mutate: unsubscribe, isPending } = useNewsletterSubscription();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      security_emails: true,
    },
  });

  const handleUnsubscribeNewsletter = () => {
    const payload = {
      isNewsletterSubscribed: false,
    };
    unsubscribe(payload, {
      onSuccess: (response) => {
        toast.success(
          response?.message ?? "Unsubscribed to newsletter successfully"
        );
        setUnsubscribeNewsletter(false);
      },
      onError: (error) => {
        toast.error(error?.message ?? "Something went wrong");
      },
    });
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <>
      <div>
        <h3 className="text-primary text-base font-semibold">Preferences</h3>
        <p className="text-gray-500 text-[12px] mt-1">Lorem ipsum, dolor sit amet consectetur adipisicing elit</p>

        <div className="mt-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8"
            >
              <FormField
                control={form.control}
                name="marketing_emails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-1">
                      <FormLabel className="text-gray-700 text-[13px]">
                        Marketing emails
                      </FormLabel>
                      <FormDescription className="text-[11px]">
                        Receive marketing emails from vendors
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
                    Subscription
                  </Label>
                  <p className="text-gray-500 text-[11px]">
                    Subscribe to our newsletter
                  </p>
                </div>

                {isNewsletterSubscribed ? (
                  <Button
                    type="button"
                    onClick={() => setUnsubscribeNewsletter(true)}
                    className="text-primary text-[11px] bg-white hover:bg-muted cursor-pointer border border-primary !h-fit !w-fit !px-3 !py-1.5"
                  >
                    Unsubscribe
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setSubscribeNewsletter(true)}
                    className="text-primary text-[11px] bg-white hover:bg-muted cursor-pointer border border-primary !h-fit !w-fit !px-3 !py-1.5"
                  >
                    Subscribe
                  </Button>
                )}
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

      <NewsletterSubscription
        showModal={subscribeNewsletter}
        toggleModal={() => setSubscribeNewsletter(!subscribeNewsletter)}
      />

      <ActionModal
        heading="Unsubscribe"
        description="Are you sure you want to unsubscribe to our newsletter?"
        showModal={unsubscribeNewsletter}
        toggleModal={() => setUnsubscribeNewsletter(!unsubscribeNewsletter)}
        onConfirm={handleUnsubscribeNewsletter}
        loading={isPending}
        variant="delete"
      />
    </>
  );
};

export default Preferences;