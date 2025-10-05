import React from "react";
import VendorTransactionsTable from "@/components/vendor/transactions/VendorTransactionsTable";

const Page = () => {
  return (
    <section className="h-full flex flex-col bg-muted/60 p-4 md:p-6 overflow-y-auto">
      <div className="mt-4 md:mt-0">
        <h1 className="text-primary text-lg md:text-xl font-semibold">Transactions</h1>
        <p className="text-gray-700 text-[11px] md:text-xs mt-1">
          Manage all your payment transactions here
        </p>
      </div>

      <div className="h-full mt-6">
        <VendorTransactionsTable />
      </div>
      
    </section>
  );
};

export default Page;