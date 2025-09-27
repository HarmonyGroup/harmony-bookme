import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDB } from '@/lib/mongoose';
import { Leisure } from '@/models/leisure';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();
    
    const { id } = await params;
    const leisureListing = await Leisure.findOne({
      _id: id,
      vendor: session.user.id,
    }).lean();

    if (!leisureListing) {
      return NextResponse.json(
        { error: 'Leisure listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: leisureListing
    });

  } catch (error: unknown) {
    console.error('Error fetching leisure listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();
    
    const body = await request.json();
    const { id } = await params;
    
    // Check if the listing exists and belongs to the vendor
    const existingListing = await Leisure.findOne({
      _id: id,
      vendor: session.user.id,
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Leisure listing not found' },
        { status: 404 }
      );
    }

    // Update the listing
    const updatedListing = await Leisure.findByIdAndUpdate(
      id,
      {
        ...body,
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.endDate && { endDate: new Date(body.endDate) }),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'Leisure listing updated successfully',
      data: updatedListing
    });

  } catch (error: unknown) {
    console.error('Error updating leisure listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();
    const { id } = await params;
    
    // Check if the listing exists and belongs to the vendor
    const existingListing = await Leisure.findOne({
      _id: id,
      vendor: session.user.id,
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Leisure listing not found' },
        { status: 404 }
      );
    }

    // Delete the listing
    await Leisure.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Leisure listing deleted successfully'
    });

  } catch (error: unknown) {
    console.error('Error deleting leisure listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
