import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useUpdatePersonalDetails } from "@/services/explorer/account";
import { useUploadImage } from "@/services/shared/image-upload";
import { useUpdateAvatar } from "@/services/shared/avatar";
import { toast } from "sonner";
import Image from "next/image";

const FormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  username: z.string().min(1, { message: "Username is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
});

const PersonalDetails = () => {
  const { data: session, status, update } = useSession();
  const { mutate: updatePersonalDetails, isPending: isDetailsPending } =
    useUpdatePersonalDetails();
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();
  const { mutate: updateAvatar, isPending: isAvatarPending } =
    useUpdateAvatar();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      form.reset({
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        username: session.user.username || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
      });
    }
  }, [session, status, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, or GIF files are allowed.");
        return;
      }
      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      uploadImage(formData, {
        onSuccess: (response) => {
          updateAvatar(
            { avatar: response.data.url },
            {
              onSuccess: async () => {
                toast.success("Avatar updated successfully");
                await update();
              },
              onError: (error) => {
                toast.error(error.message || "Failed to update avatar");
              },
            }
          );
        },
        onError: (error) => {
          toast.error(error.message || "Failed to upload image");
        },
      });
    }
  };

  const handleAvatarDelete = () => {
    updateAvatar(
      { avatar: null as any }, // eslint-disable-line @typescript-eslint/no-explicit-any
      {
        onSuccess: async () => {
          toast.success("Avatar removed successfully");
          await update();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to remove avatar");
        },
      }
    );
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    updatePersonalDetails(data, {
      onSuccess: async (response) => {
        toast.success(
          response?.message ?? "Personal details updated successfully"
        );
        await update();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Something went wrong");
      },
    });
  };

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4 mb-6">
          <Skeleton className="size-32 rounded-lg" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-8 w-32 rounded-md" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex items-center justify-end gap-2.5">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-primary text-base font-semibold">Personal details</h3>
      <div className="flex items-center gap-6 mb-8 mt-8">
        <div className="relative size-36 bg-muted rounded-lg overflow-hidden">
          {session?.user?.avatar && (
            <Image
              src={session.user.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
              width={144}
              height={144}
              priority
            />
          )}
        </div>
        <div className="space-y-4">
          <p className="text-gray-500 text-[11px]">
            We support PNG, JPEG formats up to 5MB
          </p>
          <div className="flex items-center gap-4">
            <Button
              className="bg-white border border-primary text-primary text-[11px] h-fit w-fit px-3 py-1.5 hover:bg-muted/70 cursor-pointer transition-all ease-in-out duration-300"
              onClick={() => document.getElementById("avatar-upload")?.click()}
              disabled={isUploading || isAvatarPending}
            >
              {isUploading || isAvatarPending
                ? "Uploading..."
                : "Upload Picture"}
            </Button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isUploading || isAvatarPending}
            />
            <Button
              variant={"link"}
              className="text-red-600 text-[11px] h-fit w-fit !p-0 hover:no-underline cursor-pointer"
              onClick={handleAvatarDelete}
              disabled={
                isUploading || isAvatarPending || !session?.user?.avatar
              }
            >
              Remove
            </Button>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-xs font-medium">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-gray-700 !text-xs font-medium placeholder:text-xs !h-0 !py-6 border shadow-xs outline-none ring-0 focus:shadow-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                      placeholder="Enter first name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-xs font-medium">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-gray-700 !text-xs font-medium placeholder:text-xs !h-0 !py-6 border shadow-xs outline-none ring-0 focus:shadow-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                      placeholder="Enter last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 text-xs font-medium">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-gray-700 !text-xs font-medium placeholder:text-xs !h-0 !py-6 border shadow-xs outline-none ring-0 focus:shadow-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    placeholder="Enter username"
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
                <FormLabel className="text-gray-700 text-xs font-medium">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-gray-700 !text-xs font-medium placeholder:text-xs !h-0 !py-6 border shadow-xs outline-none ring-0 focus:shadow-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    placeholder="Enter email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 text-xs font-medium">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-gray-700 !text-xs font-medium placeholder:text-xs !h-0 !py-6 border shadow-xs outline-none ring-0 focus:shadow-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    placeholder="Enter phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-2.5">
            {/* <Button
              className="bg-white text-red-600 text-xs border-red-600 hover:bg-red-50/60 cursor-pointer"
              type="button"
              onClick={() => form.reset()}
            >
              Cancel
            </Button> */}
            <Button
              type="submit"
              className="bg-primary text-white text-xs cursor-pointer"
              disabled={isDetailsPending}
            >
              {isDetailsPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PersonalDetails;