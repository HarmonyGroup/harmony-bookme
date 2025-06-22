import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import Organization from "@/models/organizations";
import { generateOrganizationSlug } from "@/utils/generateSlug";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      role,
      firstName,
      lastName,
      businessName,
      phone,
      email,
      password,
      avatar = "", // Default to empty string if not provided
      permissions = [],
    } = body;

    // Validate required fields
    if (!role || !email || !password) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: role, email, and password are required",
        },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["explorer", "vendor", "super_admin", "sub_admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    await connectToDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set default permissions based on role
    let finalPermissions = permissions;
    if (role === "super_admin") {
      finalPermissions = []; // Super admin has implicit full permissions
    } else if (role === "sub_admin" && permissions.length === 0) {
      return NextResponse.json(
        { message: "Permissions are required for sub_admin role" },
        { status: 400 }
      );
    }

    // Prepare user data
    const userData = {
      role,
      firstName: role === "explorer" ? firstName || "" : "",
      lastName: role === "explorer" ? lastName || "" : "",
      businessName: role === "vendor" ? businessName || "" : "",
      phone: role === "vendor" ? phone || "" : "",
      email,
      password: hashedPassword,
      avatar, // Include avatar URL if provided
      status: role === "explorer" || role === "vendor" ? "active" : "pending",
      permissions: finalPermissions,
      organizations: [],
    };

    // Create user
    const newUser = new User(userData);
    await newUser.save();

    // Create organization for vendor
    if (role === "vendor") {
      const orgSlug = await generateOrganizationSlug(businessName || email);
      const organization = new Organization({
        name: businessName || email,
        slug: orgSlug,
        vendor: newUser._id,
        teamMemberIds: [],
      });
      await organization.save();

      newUser.organizations.push(organization._id);
      await newUser.save();
    }

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          avatar: newUser.avatar,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
