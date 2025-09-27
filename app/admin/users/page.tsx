"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ExplorersTable from "@/components/admin/users/ExplorersTable";
import VendorsTable from "@/components/admin/users/VendorsTable";
import AdminsTable from "@/components/admin/users/AdminsTable";
import AddAdminModal from "@/components/admin/users/AddAdminModal";

const Page = () => {
  const [status, setStatus] = useState("active");
  const [addModal, setAddModal] = useState(false);

  return (
    <>
      <section className="p-6 h-full flex flex-col">
        <div>
          <h1 className="text-primary text-xl font-semibold">Users</h1>
          <p className="text-gray-500 text-xs mt-1.5">
            Track and manage users here
          </p>
        </div>

        <div className="h-full bg-white mt-6">
            <Tabs defaultValue="explorers">
              <div className="flex items-center justify-between">
                <TabsList className="h-fit">
                  <TabsTrigger
                    value="explorers"
                    className="text-gray-500 text-[12px] font-medium px-4 !py-2 cursor-pointer"
                  >
                    Explorers
                  </TabsTrigger>
                  <TabsTrigger
                    value="vendors"
                    className="text-gray-500 text-[12px] font-medium px-4 py-2 cursor-pointer"
                  >
                    Vendors
                  </TabsTrigger>
                  <TabsTrigger
                    value="admins"
                    className="text-gray-500 text-[12px] font-medium px-4 py-2 cursor-pointer"
                  >
                    Admins
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2.5">
                  <div className="relative hidden md:block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="absolute left-4 top-1/2 -translate-y-1/2 size-[13px] text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                    <Input
                      type="search"
                      className="w-[300px] bg-white !text-xs placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal shadow-xs outline-none ring-0 focus:shadow-xs px-4 !py-5 ps-9 border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                      placeholder="Search user here"
                      // value={searchQuery}
                      // onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value)}
                  >
                    <SelectTrigger className="w-[125px] text-gray-700 text-xs font-medium data-[placeholder]:!font-medium data-[placeholder]:text-gray-700 cursor-pointer !py-5">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="all"
                        className="text-gray-500 text-xs font-medium cursor-pointer"
                      >
                        All
                      </SelectItem>
                      <SelectItem
                        value="unread"
                        className="text-gray-500 text-xs font-medium cursor-pointer"
                      >
                        Active
                      </SelectItem>
                      <SelectItem
                        value="read"
                        className="text-gray-500 text-xs font-medium cursor-pointer"
                      >
                        Disabled
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => setAddModal(true)}
                    className="text-xs py-5 cursor-pointer"
                  >
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.1}
                      stroke="currentColor"
                      className="size-[15px]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg> */}
                    New admin
                  </Button>
                </div>
              </div>
              <TabsContent value="explorers">
                <ExplorersTable />
              </TabsContent>
              <TabsContent value="vendors">
                <VendorsTable />
              </TabsContent>
              <TabsContent value="admins">
                <AdminsTable />
              </TabsContent>
            </Tabs>
        </div>
      </section>
      <AddAdminModal
        showModal={addModal}
        toggleModal={() => setAddModal(!addModal)}
      />
    </>
  );
};

export default Page;