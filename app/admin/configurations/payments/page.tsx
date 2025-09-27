"use client";

import ConfigurationsLayout from "@/components/admin/layouts/ConfigurationsLayout";
import React, { useState, useEffect } from "react";
import { useGetConfiguration } from "@/services/shared/configuration";
import { useUpdateConfiguration } from "@/services/admin/configuration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ConfigurationSkeleton from "@/components/admin/configuration/ConfigurationSkeleton";

const Page = () => {
  const {
    data: configurationData,
    isLoading: loading,
  } = useGetConfiguration();
  const updateConfigurationMutation = useUpdateConfiguration();
  const [formData, setFormData] = useState({
    events: 0,
    accommodations: 0,
    leisure: 0,
    movies_and_cinema: 0,
  });

  useEffect(() => {
    if (configurationData?.data?.commissionRates) {
      setFormData(configurationData.data.commissionRates);
    }
  }, [configurationData]);

  const handleInputChange = (service: string, value: string) => {
    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        [service]: 0,
      }));
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setFormData((prev) => ({
        ...prev,
        [service]: numValue,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateConfigurationMutation.mutateAsync({
        commissionRates: formData,
      });
      toast.success("Commission rates updated successfully");
    } catch (error) {
      toast.error("Failed to update commission rates");
      console.log(error);
    }
  };

  const serviceLabels = {
    events: "Events",
    accommodations: "Accommodations",
    leisure: "Leisure",
    movies_and_cinema: "Movies & Cinema",
  };

  if (loading) {
    return (
      <section className="h-full flex flex-col">
        <div className="border-b border-gray-200/80 p-4 md:px-5 md:py-6">
          <h3 className="text-primary text-lg font-semibold">
            Commission Configuration
          </h3>
          <p className="text-gray-500 text-xs mt-1">
            Manage commission rates for different services
          </p>
        </div>
        <ConfigurationsLayout>
          <div className="px-6 py-5">
            <ConfigurationSkeleton />
          </div>
        </ConfigurationsLayout>
      </section>
    );
  }

  return (
    <section className="h-full flex flex-col">
      <div className="border-b border-gray-200/80 p-4 md:px-5 md:py-6">
        <h3 className="text-primary text-lg font-semibold">
          Commission Configuration
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          Manage commission rates for different services offered on the platform
        </p>
      </div>

        <ConfigurationsLayout>
          <div className="px-6 py-5">
            {!configurationData?.data && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-xs">
                  No commission rates have been set yet. Please configure the commission rates for each service below.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
            {Object.entries(serviceLabels).map(([service, label]) => (
              <div key={service} className="space-y-2">
                <Label htmlFor={service} className="text-gray-500 !text-xs">
                  {label} commission rate (%)
                </Label>
                 <Input
                   id={service}
                   type="number"
                   min="0"
                   max="100"
                   step="0.1"
                   value={formData[service as keyof typeof formData] || ""}
                   onChange={(e) => handleInputChange(service, e.target.value)}
                   className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                   placeholder="Enter commission rate"
                 />
              </div>
            ))}

            
              <Button
                type="submit"
                disabled={updateConfigurationMutation.isPending}
                className="bg-primary text-xs float-end cursor-pointer transition-colors ease-in-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {updateConfigurationMutation.isPending ? (
                  <>
                    Saving changes...
                  </>
                ) : (
                  <>
                    Save Changes
                  </>
                )}
              </Button>
            
          </form>
        </div>
      </ConfigurationsLayout>
    </section>
  );
};

export default Page;