import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  const baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  // Generate a random 7-character string
  const randomSuffix = Math.random().toString(36).substring(2, 9);

  return `${baseSlug}-${randomSuffix}`;
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const copyToClipboard = async (value: string) => {
  if (!value) {
    toast.error("Something went wrong");
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  } catch (error) {
    toast.error("Failed to copy to clipboard");
    console.error(error);
  }
};

export const formatNotificationTime = (
  createdAt: string,
  currentTime: moment.Moment
): string => {
  const created = moment(createdAt);
  const diffInSeconds = currentTime.diff(created, "seconds");
  const diffInMinutes = currentTime.diff(created, "minutes");
  const diffInHours = currentTime.diff(created, "hours");
  const isSameDay = currentTime.isSame(created, "day");
  const isYesterday = currentTime
    .clone()
    .subtract(1, "day")
    .isSame(created, "day");

  if (diffInSeconds < 60) {
    return `${diffInSeconds}sec ago`;
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes}min ago`;
  }
  if (isSameDay && diffInHours < 24) {
    return `${diffInHours}hr ago`;
  }
  if (isYesterday) {
    return `Yesterday at ${created.format("h:mma")}`;
  }
  return created.format("MMM D, YYYY");
};

export const formatMovieDuration = (duration?: number): string => {
  if (!duration || duration <= 0) {
    return "Unknown";
  }

  if (duration < 60) {
    return `${duration} min`;
  }

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const hoursPart = `${hours} hr`;
  const minutesPart = minutes > 0 ? ` ${minutes} min` : "";
  return `${hoursPart}${minutesPart}`;
};

export async function generateUsername({
  role,
  businessName,
  firstName,
  lastName,
}: {
  role: string;
  businessName?: string;
  firstName?: string;
  lastName?: string;
}): Promise<string> {
  // Generate 5 random alphanumeric characters
  const generateRandomChars = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  let baseUsername: string;
  if (role === "vendor" && businessName) {
    // For vendors, use business name + random chars
    baseUsername = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20);
  } else if (firstName && lastName) {
    // For other roles, use firstName-lastName + random chars
    baseUsername = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`.replace(
      /[^a-z0-9]/g,
      ""
    );
  } else {
    // Fallback to user + random chars if no valid name provided
    baseUsername = "user";
  }

  // Generate random characters and append to base username
  const randomChars = generateRandomChars();
  const username = `${baseUsername}-${randomChars}`;
  
  return username;
}