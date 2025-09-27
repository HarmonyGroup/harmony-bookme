import { type NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { ApiError } from "@/types/accommodation";

interface UploadImageResponse {
  success: true;
  data: {
    url: string;
  };
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
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

    // Validate environment variables
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "SERVER_CONFIG_ERROR",
          message: "AWS credentials are not configured properly.",
        },
        { status: 500 }
      );
    }

    const data = await req.formData();
    const file = data.get("file");

    // Validate file
    if (!file || !(file instanceof File)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "No file provided or invalid file format.",
        },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Only JPEG, PNG, or GIF files are allowed.",
        },
        { status: 400 }
      );
    }
    if (file.size > maxSize) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "File size exceeds 5MB limit.",
        },
        { status: 400 }
      );
    }

    // Initialize S3 client
    const s3Client = new S3Client({
      region: "eu-north-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Generate unique file name using uuid
    const ext = file.name.split(".").pop()?.toLowerCase();
    const newFileName = `${uuidv4()}.${ext}`;

    // Convert file stream to buffer
    const chunks: Uint8Array[] = [];
    const stream = file.stream().getReader();
    while (true) {
      const { done, value } = await stream.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    const buffer = Buffer.concat(chunks);

    // Upload to S3
    const bucket = "harmony-bookme";
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: newFileName,
        ACL: 'public-read',
        ContentType: file.type,
        Body: buffer,
      })
    );

    // Generate public URL
    const url = `https://${bucket}.s3.eu-north-1.amazonaws.com/${newFileName}`;

    const response: UploadImageResponse = {
      success: true,
      data: { url },
      message: "Image uploaded successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error uploading image to S3:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload image to S3",
      },
      { status: 500 }
    );
  }
}