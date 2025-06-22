import { connectToDB } from "@/lib/mongoose";
import Organization from "@/models/organizations";

export async function generateOrganizationSlug(
  baseName: string
): Promise<string> {
  await connectToDB();

  // Convert to slug format: lowercase, remove special characters, replace spaces with hyphens
  const slug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  // Check if slug already exists
  let isUnique = false;
  let counter = 0;
  const maxAttempts = 10; // Limit attempts to avoid infinite loops

  while (!isUnique && counter < maxAttempts) {
    const candidateSlug =
      counter === 0 ? slug : `${slug}-${Math.floor(Math.random() * 1000)}`;
    const existingOrg = await Organization.findOne({ slug: candidateSlug });
    if (!existingOrg) {
      isUnique = true;
      return candidateSlug;
    }
    counter++;
  }

  // If all attempts fail, append a timestamp as a fallback
  return `${slug}-${Date.now()}`;
}