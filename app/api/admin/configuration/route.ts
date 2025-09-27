import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Configuration from "@/models/configuration";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  useGetConfigurationResponse, 
  useUpdateConfigurationRequest, 
  useCreateConfigurationRequest,
  ApiError,
} from "@/types/admin/configuration";
import { ConfigurationData } from "@/types/shared/configuration";

export async function GET() {
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

    if (!["super_admin", "sub_admin"].includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message: "You don't have permission to view configurations. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    // Get the active configuration
    const configuration = await Configuration.findOne({ isActive: true })
      .populate("updatedBy", "firstName lastName email")
      .lean();

    const response: useGetConfigurationResponse = {
      success: true,
      data: configuration as ConfigurationData | null,
      message: configuration ? "Configuration fetched successfully" : "No active configuration found",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch configuration",
      },
      { status: 500 }
    );
  }
}

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
          message: "You don't have permission to create configurations. Only super admins can perform this action.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const body: useCreateConfigurationRequest = await request.json();

    // Validate commission rates
    const { commissionRates } = body;
    for (const [service, rate] of Object.entries(commissionRates)) {
      if (rate < 0 || rate > 100) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "VALIDATION_ERROR",
            message: `Commission rate for ${service} must be between 0 and 100`,
          },
          { status: 400 }
        );
      }
    }

    // Deactivate any existing active configuration
    await Configuration.updateMany({ isActive: true }, { isActive: false });

    // Create new configuration
    const configuration = new Configuration({
      commissionRates,
      isActive: true,
      updatedBy: session.user.id,
    });

    await configuration.save();

    const response = {
      success: true,
      data: configuration,
      message: "Configuration created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to create configuration",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    if (!["super_admin", "sub_admin"].includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message: "You don't have permission to update configurations. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const body: useUpdateConfigurationRequest = await request.json();

    // Validate commission rates
    const { commissionRates } = body;
    for (const [service, rate] of Object.entries(commissionRates)) {
      if (rate < 0 || rate > 100) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "VALIDATION_ERROR",
            message: `Commission rate for ${service} must be between 0 and 100`,
          },
          { status: 400 }
        );
      }
    }

    // Find the active configuration
    let configuration = await Configuration.findOne({ isActive: true });

    if (!configuration) {
      // If no active configuration exists, create one
      configuration = new Configuration({
        commissionRates,
        isActive: true,
        updatedBy: session.user.id,
      });
    } else {
      // Update existing configuration
      configuration.commissionRates = commissionRates;
      configuration.updatedBy = session.user.id;
    }

    await configuration.save();

    const response = {
      success: true,
      data: configuration,
      message: "Configuration updated successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to update configuration",
      },
      { status: 500 }
    );
  }
}
