export type BookingStatusValue =
  | "requested"
  | "pending"
  | "confirmed"
  | "checked-in"
  | "cancelled"
  | "no-show"
  | "refunded";

export interface BookingStatus {
  value: BookingStatusValue;
  label: string;
  colorClass: string;
}

export const BOOKING_STATUSES: BookingStatus[] = [
  {
    value: "requested",
    label: "Requested",
    colorClass: "bg-orange-100 text-orange-800",
  },
  {
    value: "pending",
    label: "Pending",
    colorClass: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    colorClass: "bg-green-100 text-green-800",
  },
  {
    value: "checked-in",
    label: "Checked In",
    colorClass: "bg-blue-100 text-blue-800",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    colorClass: "bg-red-100 text-red-800",
  },
  {
    value: "no-show",
    label: "No Show",
    colorClass: "bg-gray-100 text-gray-800",
  },
  {
    value: "refunded",
    label: "Refunded",
    colorClass: "bg-purple-100 text-purple-800",
  },
];

// Map for quick lookup by value
export const BOOKING_STATUS_MAP: Record<BookingStatusValue, BookingStatus> =
  Object.fromEntries(
    BOOKING_STATUSES.map((status) => [status.value, status])
  ) as Record<BookingStatusValue, BookingStatus>;