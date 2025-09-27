// Utility function to convert text to URL-safe format
export function toUrlSafe(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s._-]+/g, '-') // Replace spaces, dots, underscores with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove all non-alphanumeric characters except hyphens
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Utility function to generate random alphanumeric characters
export function generateRandomSuffix(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Utility function to generate unique username
export function generateUsername({
  role,
  businessName,
  firstName,
  lastName,
}: {
  role: string;
  businessName?: string;
  firstName?: string;
  lastName?: string;
}): string {
  let baseUsername: string;
  
  if (role === "vendor" && businessName) {
    // For vendors, use business name
    baseUsername = toUrlSafe(businessName);
  } else if (firstName && lastName) {
    // For other roles, use firstName and lastName
    baseUsername = `${toUrlSafe(firstName)}-${toUrlSafe(lastName)}`;
  } else {
    // Fallback to "user" if no valid name provided
    baseUsername = "user";
  }

  // Generate random characters and append
  const randomSuffix = generateRandomSuffix();
  return `${baseUsername}-${randomSuffix}`;
}

// Utility function to generate unique organization slug
export function generateOrganizationSlug(baseName: string): string {
  const baseSlug = toUrlSafe(baseName);
  const randomSuffix = generateRandomSuffix();
  return `${baseSlug}-${randomSuffix}`;
}
