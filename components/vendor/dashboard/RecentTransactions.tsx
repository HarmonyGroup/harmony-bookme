import React from "react";

const RecentTransactions = () => {
  return (
    <div className="bg-white border border-gray-100/80 rounded-lg shadow-xs p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-primary text-[13px] font-semibold">Transactions</h1>
      </div>
      <div className="flex flex-col gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-sky-800 size-8 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.6"
              stroke="currentColor"
              className="text-white size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-700 text-xs font-medium">
              You received a new booking - #RODX45
            </p>
            <p className="text-gray-500 text-[10px]">2h ago</p>
          </div>
        </div>

        {/* <Separator /> */}

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-primary size-8 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="text-white size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-700 text-xs font-medium">
              You updated your password
            </p>
            <p className="text-gray-500 text-[10px]">2h ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;