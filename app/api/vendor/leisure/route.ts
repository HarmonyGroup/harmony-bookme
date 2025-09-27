import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDB } from '@/lib/mongoose';
import { Leisure } from '@/models/leisure';
import { generateSlug } from '@/lib/utils';
import { emitNotification } from '@/lib/notificationService';

async function generateLeisureCode(title: string): Promise<string> {
  const prefix =
    title.length >= 2
      ? title.slice(0, 2).toUpperCase()
      : title[0].toUpperCase() + title[0].toUpperCase();
  const digits = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `${prefix}-${digits}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
            success: false,
            error: "UNAUTHORIZED",
            message: "Authentication required. Please log in to continue.",
          },
          { status: 401 }
      );
    };

    if (!session.user.role) {
        return NextResponse.json(
          {
            success: false,
            error: "INVALID_SESSION",
            message: "Invalid session data. Please log in again.",
          },
          { status: 401 }
        );
      }
  
      if (session.user.role !== "vendor") {
        return NextResponse.json(
          {
            success: false,
            error: "FORBIDDEN",
            message:
              "You don't have permission to create leisure listings. Please contact support if you believe this is an error.",
          },
          { status: 403 }
        );
      }

    await connectToDB();
    
    const body = await request.json();

    const uniqueSlug = generateSlug(body?.title);

    const leisureCode = await generateLeisureCode(body.title);
    
    // Validate required fields
    const requiredFields = [
      'title', 'description', 'shortSummary', 'category', 'subcategory',
      'highlights', 'eventDateType', 'startDate', 'startTime', 'endDate', 'endTime',
      'venueName', 'country', 'state', 'city', 'zipcode', 'addressDetails',
      'tickets', 'images', 'ageRestriction', 'requirements', 'tags',
      'dressCode', 'inclusions', 'childrenPolicy', 'petPolicy',
      'accessibilityFeatures', 'termsAndConditions'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate tickets array
    if (!Array.isArray(body.tickets) || body.tickets.length === 0) {
      return NextResponse.json(
        { error: 'At least one ticket is required' },
        { status: 400 }
      );
    }

    // Validate images array
    if (!Array.isArray(body.images) || body.images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    // Create the leisure listing
    const leisureListing = new Leisure({
      ...body,
      slug: uniqueSlug,
      leisureCode,
      vendor: session.user.id,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      status: 'active',
      isApproved: true,
    });

    await leisureListing.save();

    emitNotification("leisure.created", {
      leisureId: leisureListing._id.toString(),
      title: body.title,
      slug: uniqueSlug,
      vendorId: session.user.id,
    });

    return NextResponse.json(
      { 
        message: 'Leisure listing created successfully',
        data: leisureListing 
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('Error creating leisure listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const query: Record<string, unknown> = { vendor: session.user.id };
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { leisureCode: { $regex: search, $options: 'i' } }
      ];
    }

        const skip = (page - 1) * limit;
    
    const [listings, total] = await Promise.all([
      Leisure.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Leisure.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: listings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error: unknown) {
    console.error('Error fetching leisure listings:', error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch leisure listings",
      },
      { status: 500 }
    );
  }
}