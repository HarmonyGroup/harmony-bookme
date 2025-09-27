import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAddUser } from "@/services/admin/users";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const FormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.string().min(2, "Account role is required"),
});

interface ModalProps {
  showModal: boolean;
  toggleModal: () => void;
}

const generateRandomPassword = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
};

const AddAdminModal: React.FC<ModalProps> = ({ showModal, toggleModal }) => {
  const { mutate, isPending } = useAddUser();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const handleGeneratePassword = () => {
    form.setValue("password", generateRandomPassword(), {
      shouldValidate: true,
    });
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    mutate(data, {
      onSuccess: (response) => {
        toast.success(response?.message ?? "Admin added successfully");
        toggleModal();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Something went wrong");
      },
    });
  };

  return (
    <Dialog open={showModal} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-primary text-[17px]">
            New Admin
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-xs -mt-1">
            Enter admin information and set credentials
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600 text-xs font-medium">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        {...field}
                        className="py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
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
                    <FormLabel className="text-gray-600 text-xs font-medium">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        {...field}
                        className="py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 text-xs font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email address"
                      {...field}
                      className="py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 text-xs font-medium">
                    Assign Role
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 cursor-pointer">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value="super_admin"
                        className="text-xs cursor-pointer p-3"
                      >
                        Super Admin
                      </SelectItem>
                      <SelectItem
                        value="sub_admin"
                        className="text-xs cursor-pointer p-3"
                      >
                        Sub Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 text-xs font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter password"
                      {...field}
                      className="py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    />
                  </FormControl>
                  <FormDescription
                    className="text-sky-700 text-xs cursor-pointer hover:underline transition-all ease-in-out duration-300"
                    onClick={handleGeneratePassword}
                  >
                    Autogenerate password
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full md:w-fit text-xs float-right mt-4 cursor-pointer py-5"
            >
              {isPending ? (
                <span>
                  <Loader2 className="animate-spin" />
                </span>
              ) : (
                <span>Add admin</span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdminModal;