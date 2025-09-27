import AdminTransactionsTable from '@/components/admin/transactions/AdminTransactionsTable';
import React from 'react'

const Page = () => {
  return (
    <section className="h-full bg-gray-50/60 p-6">
      <div className="mb-6">
        <h1 className="text-primary text-xl font-semibold">Transactions</h1>
        <p className="text-gray-700 text-xs mt-1.5">
          Manage all your payment transactions here
        </p>
      </div>

      <AdminTransactionsTable />
      
    </section>
  )
}

export default Page;