import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { useAddUserRequest } from "@/types/admin/users";
import bcrypt from "bcryptjs";
import { generateUsername } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Authentication required. Please log in to continue.",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "super_admin") {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to add users. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const body: useAddUserRequest = await request.json();

    const existingUser = await User.findOne({ email: body?.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(body?.password, 10);

    const user = { ...body, password: hashedPassword, username: await generateUsername(body) };

    const userDoc = new User(user);
    await userDoc.save();

    const response = {
      success: true,
      message: "User added successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to add user",
      },
      { status: 500 }
    );
    console.error(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    // const search = searchParams.get("search") || "";
    const roleParam = searchParams.get("role");
    const skip = (page - 1) * limit;

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Authentication required. Please log in to continue.",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "super_admin") {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to view this resource. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    const query: Record<string, unknown> = {};

    if (roleParam) {
      // Handle multiple roles - if roleParam contains commas, split it into an array
      const roles = roleParam.includes(',') ? roleParam.split(',').map(r => r.trim()) : [roleParam];
      
      if (roles.length === 1) {
        query.role = roles[0];
      } else {
        query.role = { $in: roles };
      }
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      message: "Users fetched successfully",
    });
  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch users",
      },
      { status: 500 }
    );
    console.error(error);
  }
}