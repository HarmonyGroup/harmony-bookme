import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  SmileyIcon,
  SmileyMehIcon,
  SmileySadIcon,
} from "@phosphor-icons/react";
import { useSubmitFeedback } from "@/services/shared/feedback";
import { SubmitFeedbackRequest } from "@/types/feedback";
import { toast } from "sonner";

const FormSchema = z.object({
  mood: z.enum(["happy", "normal", "sad"]),
  feedback: z
    .string()
    .min(1, "Feedback is required")
    .max(500, "Feedback must be 500 characters or less"),
});

const Feedback = () => {
  const { mutate: submitFeedback, isPending } = useSubmitFeedback();
  const [selectedMood, setSelectedMood] = useState("");

  const form = useForm({
    // @ts-expect-error will check later
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mood: "",
      feedback: "",
    },
  });

  const onSubmit = (data: SubmitFeedbackRequest) => {
    submitFeedback(data, {
      onSuccess: () => {
        toast.success("Thank you! We've received your feedback");
        form.reset();
        setSelectedMood("");
      },
      onError: (error) => {
        toast.error(error?.message ?? "Something went wrong");
      },
    });
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    form.setValue("mood", mood);
  };

  return (
    <div className="">
      <h3 className="text-primary text-base font-medium">Feedback</h3>

      <div className="mt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="mood"
              render={() => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-xs font-medium">
                    How would you describe your mood after using
                    harmonybookme.com?
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4 mt-2">
                      <div
                        className={`rounded-full p-1.5 cursor-pointer transition ease-in-out duration-200 ${
                          selectedMood === "happy"
                            ? "bg-muted"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleMoodSelect("happy")}
                        role="button"
                        aria-label="Select happy mood"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleMoodSelect("happy")
                        }
                      >
                        <SmileyIcon size={22} className="text-yellow-500" />
                      </div>
                      <div
                        className={`rounded-full p-1.5 cursor-pointer transition ease-in-out duration-200 ${
                          selectedMood === "normal"
                            ? "bg-muted"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleMoodSelect("normal")}
                        role="button"
                        aria-label="Select normal mood"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleMoodSelect("normal")
                        }
                      >
                        <SmileyMehIcon size={22} className="text-gray-500" />
                      </div>
                      <div
                        className={`rounded-full p-1.5 cursor-pointer transition ease-in-out duration-200 ${
                          selectedMood === "sad" ? "bg-muted" : "hover:bg-muted"
                        }`}
                        onClick={() => handleMoodSelect("sad")}
                        role="button"
                        aria-label="Select sad mood"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleMoodSelect("sad")
                        }
                      >
                        <SmileySadIcon size={22} className="text-blue-500" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-xs font-medium">
                    Your feedback
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Anything you'll like to add? Your input is valuable to us"
                      className="h-[194px] text-gray-700 text-xs font-medium placeholder:text-xs placeholder:font-normal border shadow-xs outline-none ring-0 p-3 focus:shadow-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-2.5">
              <Button
                type="submit"
                className="bg-primary text-white text-xs font-medium px-4 py-2 rounded-lg cursor-pointer"
                disabled={isPending}
              >
                {isPending ? "Submitting..." : "Submit feedback"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Feedback;