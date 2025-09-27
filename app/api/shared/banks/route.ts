import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

interface PaystackBank {
  name: string;
  code: string;
  slug: string;
  currency: string;
  type: string;
  active: boolean;
  is_deleted: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "nigeria";

    // Fetch banks from Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/bank?country=${country}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error("Paystack banks fetch failed:", paystackData);
      return NextResponse.json(
        { 
          success: false, 
          message: paystackData.message || "Failed to fetch banks",
          details: paystackData
        },
        { status: 400 }
      );
    }

    // Filter only active banks and format for frontend
    const banks = paystackData.data
      .filter((bank: PaystackBank) => bank.active && !bank.is_deleted)
      .map((bank: PaystackBank) => ({
        name: bank.name,
        code: bank.code,
        slug: bank.slug,
        currency: bank.currency,
        type: bank.type,
      }))
      .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      message: "Banks retrieved successfully",
      data: banks,
    });

  } catch (error) {
    console.error("Banks fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
