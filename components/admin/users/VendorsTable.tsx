import React, { useState } from "react";
import { useGetUsers, useUpdateAccountStatus } from "@/services/admin/users";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import moment from "moment";
import { toast } from "sonner";
import { ActionModal } from "@/components/vendor/shared/ActionModal";
import EmptyIcon from "@/public/assets/empty-data-icon.png";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
  isActive: boolean;
}

const ExplorersTable: React.FC = () => {
  const [page] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [search] = useState<string>("");
  const [activateModal, setActivateModal] = useState<boolean>(false);
  const [deactivateModal, setDeactivateModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading } = useGetUsers({
    page,
    limit,
    role: "vendor",
    search,
  });

  const { mutate: updateStatus, isPending: updatingStatus } =
    useUpdateAccountStatus();

  const handleUpdateStatus = () => {
    if (!selectedUser) return;

    updateStatus(
      {
        id: selectedUser._id,
        status: selectedUser.isActive ? "disable" : "enable",
      },
      {
        onSuccess: () => {
          toast.success("User account updated successfully");
          setSelectedUser(null);
          setActivateModal(false);
          setDeactivateModal(false);
        },
        onError: (error) => {
          toast.error(error?.message ?? "Failed to update user account");
        },
      }
    );
  };

  const renderTableSkeleton = () => (
    <Table className="mt-4 px-10">
      <TableHeader>
        <TableRow className="bg-muted/90 text-xs">
          {[
            "Name",
            "Email",
            "Phone Number",
            "Date Joined",
            "Account Level",
            "Status",
            "Action",
          ].map((header) => (
            <TableHead
              key={header}
              className="text-gray-700 font-medium py-5 px-4"
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(7)].map((_, index) => (
          <TableRow key={index}>
            <TableCell className="py-5 px-4">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-6 w-6 bg-gray-200 rounded-sm" />
                <Skeleton className="h-4 w-[200px] bg-gray-200 rounded-sm" />
              </div>
            </TableCell>
            {[...Array(4)].map((_, i) => (
              <TableCell key={i}>
                <Skeleton className="h-4 w-[100px] bg-gray-200 rounded-sm" />
              </TableCell>
            ))}
            <TableCell className="text-right px-4">
              <Skeleton className="h-4 w-4 ml-auto bg-gray-200 rounded-sm" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderTableContent = () => (
    <Table className="mt-2 px-10">
      <TableHeader>
        <TableRow className="bg-muted/90 text-xs">
          {[
            "Name",
            "Email",
            "Phone Number",
            "Date Joined",
            "Account Level",
            "Status",
            "Action",
          ].map((header, index) => (
            <TableHead
              key={header}
              className={`text-gray-700 font-medium py-5 ${
                index === 0 ? "pl-4" : ""
              } ${index === 6 ? "pr-4 text-right" : ""}`}
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data?.map((user: User) => (
          <TableRow key={user._id}>
            <TableCell className="text-xs font-medium py-6 px-4">
              {user.firstName} {user.lastName}
            </TableCell>
            <TableCell className="text-gray-500 text-xs font-medium">
              {user.email}
            </TableCell>
            <TableCell className="text-gray-500 text-xs font-medium">
              {user.phone || "Not provided"}
            </TableCell>
            <TableCell className="text-gray-500 text-xs font-medium">
              {moment(user.createdAt).format("ll")}
            </TableCell>
            <TableCell className="text-gray-500 text-xs font-medium">
              Beginner
            </TableCell>
            <TableCell className="text-xs">
              <span
                className={`inline-block px-3 py-1 font-medium rounded-md border cursor-default ${
                  user.isActive
                    ? "bg-green-50 text-green-700 border-green-700"
                    : "bg-red-50 text-red-700 border-red-700"
                }`}
              >
                {user.isActive ? "Active" : "Disabled"}
              </span>
            </TableCell>
            <TableCell className="text-right px-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer hover:bg-muted rounded-md transition-colors ease-in-out duration-300 p-1 focus-visible:outline-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="text-gray-500 size-[21px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedUser(user);
                      if (user.isActive) {
                        setDeactivateModal(true);
                      } else {
                        setActivateModal(true);
                      }
                    }}
                    className="text-gray-500 text-xs font-medium cursor-pointer transition-colors ease-in-out duration-300 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.1}
                      stroke="currentColor"
                      className="size-[14px]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                    {user.isActive ? "Disable" : "Enable"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center gap-2 py-20 min-h-[400px]">
      <Image
        src={EmptyIcon}
        className="size-14"
        alt="No users found"
        loading="lazy"
      />
      <h1 className="text-gray-700 text-sm font-semibold">No vendor</h1>
      <p className="text-gray-500 text-xs text-center max-w-md">
        Registered vendors will show up here
      </p>
    </div>
  );

  return (
    <>
      {isLoading
        ? renderTableSkeleton()
        : data?.data?.length
        ? renderTableContent()
        : renderEmptyState()}
      <ActionModal
        heading="Disable User"
        description="Are you sure you want to disable this user account?"
        variant="delete"
        showModal={deactivateModal}
        toggleModal={() => {
          setDeactivateModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleUpdateStatus}
        loading={updatingStatus}
      />
      <ActionModal
        heading="Enable User"
        description="Are you sure you want to enable this user account?"
        variant="confirmation"
        showModal={activateModal}
        toggleModal={() => {
          setActivateModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleUpdateStatus}
        loading={updatingStatus}
      />
    </>
  );
};

export default ExplorersTable;