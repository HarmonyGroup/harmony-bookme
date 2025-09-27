import ConfigurationsLayout from "@/components/admin/layouts/ConfigurationsLayout";
import React from "react";

const Page = () => {
  return (
    <section className="h-full flex flex-col">

      <div className="border-b border-gray-200/80 p-4 md:px-5 md:py-6">
        <h3 className="text-primary text-lg font-semibold">Configurations</h3>
        <p className="text-gray-500 text-xs mt-1">
          Manage all system configurations here
        </p>
      </div>

      <ConfigurationsLayout>
        <div className="px-6 py-5">
            
        </div>
      </ConfigurationsLayout>
    </section>
  );
};

export default Page;