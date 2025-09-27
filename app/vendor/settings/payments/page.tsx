"use client";

import React, { useState, useEffect } from "react";
import VendorSettingsLayout from "@/components/vendor/layouts/VendorSettingsLayout";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, Search, Loader2 } from "lucide-react";
import PaymentsSkeleton from "@/components/vendor/settings/PaymentsSkeleton";
import { useGetBanks } from "@/services/shared/banks";
import { 
  useCreatePaystackSubaccount, 
  useUpdatePaystackSubaccount, 
  usePaystackSubaccountStatus,
  useVerifyBankDetails 
} from "@/services/vendor/paystack-subaccount";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FormSchema = z.object({
  accountName: z.string().min(1, {
    message: "Account name is required.",
  }),
  bankCode: z.string().min(1, {
    message: "Bank is required.",
  }),
  bankName: z.string().min(1, {
    message: "Bank name is required.",
  }),
  accountNumber: z.string().min(1, {
    message: "Account number is required.",
  }),
});

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bankPopoverOpen, setBankPopoverOpen] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState("");
  const { data: banksData, isLoading: isBanksLoading } = useGetBanks();
  const { data: subaccountStatus } = usePaystackSubaccountStatus();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      accountName: "",
      bankCode: "",
      bankName: "",
      accountNumber: "",
    },
  });

  const selectedBank = banksData?.data?.find(
    (bank) => bank.code === form.watch("bankCode")
  );
  const filteredBanks =
    banksData?.data?.filter((bank) =>
      bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase())
    ) || [];

  // Hooks for subaccount operations
  const createSubaccount = useCreatePaystackSubaccount(
    () => {
      toast.success("Bank details saved and subaccount created successfully!");
      setIsLoading(false);
    },
    (error) => {
      toast.error(error?.message || "Failed to create subaccount");
      setIsLoading(false);
    }
  );

  const updateSubaccount = useUpdatePaystackSubaccount(
    () => {
      toast.success("Bank details updated successfully!");
      setIsLoading(false);
    },
    (error) => {
      toast.error(error?.message || "Failed to update subaccount");
      setIsLoading(false);
    }
  );

  const verifyBank = useVerifyBankDetails(
    (data) => {
      // Bank verification successful, proceed with subaccount operation
      const bankDetails = {
        accountNumber: form.getValues("accountNumber"),
        bankCode: form.getValues("bankCode"),
        accountName: data.accountName,
        bankName: data.bankName,
      };

      const subaccountData = {
        bankDetails,
        settlementBank: form.getValues("bankCode"),
        // commissionRate will be determined by the API based on vendor's account preference
      };

      if (subaccountStatus?.data?.hasSubaccount) {
        // Update existing subaccount
        updateSubaccount.mutate(subaccountData);
      } else {
        // Create new subaccount
        createSubaccount.mutate(subaccountData);
      }
    },
    (error) => {
      toast.error(error?.message || "Bank verification failed. Please check your details.");
      setIsLoading(false);
    }
  );

  // Populate form with existing bank details
  useEffect(() => {
    if (subaccountStatus?.data?.hasSubaccount && subaccountStatus.data.bankDetails) {
      const { bankDetails } = subaccountStatus.data;
      form.setValue("accountName", bankDetails.accountName || "");
      form.setValue("bankCode", bankDetails.bankCode || "");
      form.setValue("bankName", bankDetails.bankName || "");
      form.setValue("accountNumber", bankDetails.accountNumber || "");
    }
  }, [subaccountStatus, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    
    // First verify bank details
    verifyBank.mutate({
      accountNumber: data.accountNumber,
      bankCode: data.bankCode,
    });
  };

  return (
    <section className="h-full flex flex-col">
      <div className="border-b border-gray-200/80 p-4 md:px-5 md:py-6">
        <h3 className="text-primary text-lg font-semibold">Payments</h3>
        <p className="text-gray-500 text-xs mt-1">
          Manage your payment settings and set preferences
        </p>
      </div>

      <VendorSettingsLayout>
        <div className="px-6 py-5">
          {isLoading ? (
            <PaymentsSkeleton />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="bankCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 text-xs">
                        Bank
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={bankPopoverOpen}
                          onOpenChange={setBankPopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={bankPopoverOpen}
                              className={cn(
                                "w-full justify-between !py-6 !text-xs font-normal shadow-none border-input hover:bg-background focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 cursor-pointer",
                                !selectedBank && "text-muted-foreground"
                              )}
                              disabled={isLoading || isBanksLoading}
                            >
                              {isBanksLoading ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Loading banks...</span>
                                </div>
                              ) : selectedBank ? (
                                <span className="truncate">
                                  {selectedBank.name}
                                </span>
                              ) : (
                                <span className="text-gray-500">
                                  Select your bank
                                </span>
                              )}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] p-0"
                            align="start"
                          >
                            <div className="flex items-center border-b px-3 py-2">
                              <Search className="h-3 w-3 shrink-0 opacity-50" />
                              <Input
                                placeholder="Search bank here..."
                                value={bankSearchTerm}
                                onChange={(e) =>
                                  setBankSearchTerm(e.target.value)
                                }
                                className="!py-4 !text-xs font-normal border-none shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 transition-all ease-in-out duration-200"
                              />
                            </div>
                            <div className="max-h-[300px] overflow-auto p-2">
                              {filteredBanks.length === 0 ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                  No banks found.
                                </div>
                              ) : (
                                filteredBanks.map((bank, index) => (
                                  <Button
                                    key={`${bank.code}-${bank.name}-${index}`}
                                    variant="ghost"
                                    className="w-full justify-start px-3 py-3 h-auto font-normal cursor-pointer"
                                     onClick={() => {
                                       field.onChange(bank.code);
                                       form.setValue("bankName", bank.name);
                                       setBankPopoverOpen(false);
                                       setBankSearchTerm("");
                                     }}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex flex-col items-start">
                                        <span className="text-gray-600 text-xs">
                                          {bank.name}
                                        </span>
                                        {/* <span className="text-xs text-muted-foreground">
                                        Code: {bank.code}
                                      </span> */}
                                      </div>
                                      <Check
                                        className={cn(
                                          "ml-2 h-4 w-4",
                                          field.value === bank.code
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </div>
                                  </Button>
                                ))
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 text-xs">
                        Account name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                          placeholder="Enter account name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 text-xs">
                        Account number
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                          placeholder="Enter account number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                 <Button
                   type="submit"
                   disabled={isLoading || createSubaccount.isPending || updateSubaccount.isPending || verifyBank.isPending}
                   className="bg-primary text-xs float-end cursor-pointer transition-colors ease-in-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isLoading || createSubaccount.isPending || updateSubaccount.isPending || verifyBank.isPending ? (
                     <div className="flex items-center gap-2">
                       <Loader2 className="h-4 w-4 animate-spin" />
                       {subaccountStatus?.data?.hasSubaccount ? "Updating..." : "Creating..."}
                     </div>
                   ) : (
                     subaccountStatus?.data?.hasSubaccount ? "Update Bank Details" : "Save Bank Details"
                   )}
                 </Button>
              </form>
            </Form>
          )}
        </div>
      </VendorSettingsLayout>
    </section>
  );
};

export default Page;