import mongoose from "mongoose";
import { connectToDB } from "@/lib/mongoose";
import { Booking } from "@/models/booking";
import { Accommodation } from "@/models/accommodation";
import { emitNotification } from "@/lib/notificationService";
import { CreateBookingRequest, CreateBookingResponse } from "@/types/booking";

interface CreateAccommodationBookingRequestData {
  data: CreateBookingRequest;
  explorerId: string;
}

/**
 * Generates a unique booking code for accommodations
 */
async function generateBookingCode(
  accommodationTitle: string
): Promise<string> {
  const prefix =
    accommodationTitle?.length >= 2
      ? accommodationTitle.slice(0, 2).toUpperCase()
      : "AC";

  const digits = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");

  return `${prefix}-${digits}`;
}

/**
 * Creates a new accommodation booking request
 * This creates a booking with status "requested" and notifies the vendor
 */
export async function createAccommodationBookingRequest({
  data,
  explorerId,
}: CreateAccommodationBookingRequestData): Promise<CreateBookingResponse> {
  try {
    await connectToDB();

    // Start MongoDB transaction
    const sessionDB = await mongoose.startSession();

    try {
      const result = await sessionDB.withTransaction(async () => {
        // 1. Validate accommodation exists
        const accommodation = await Accommodation.findById(
          data.listing
        ).session(sessionDB);
        if (!accommodation) {
          throw new Error("Accommodation not found.");
        }

        // 2. Validate accommodation details
        if (
          !("checkInDate" in data.details) ||
          !("checkOutDate" in data.details) ||
          !("guests" in data.details)
        ) {
          throw new Error(
            "Accommodation bookings require checkInDate, checkOutDate, and guests in details"
          );
        }

        const { checkInDate, checkOutDate, guests, roomType } = data.details;

        // Validate dates
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
          throw new Error("Invalid checkInDate or checkOutDate");
        }

        if (checkOut <= checkIn) {
          throw new Error("Check-out date must be after check-in date");
        }

        // Validate guests against maxGuests
        if (guests > accommodation.maxGuests) {
          throw new Error(
            `Number of guests exceeds maximum allowed (${accommodation.maxGuests}).`
          );
        }

        // 3. Validate room selection based on accommodation type
        let selectedRoom: any = null;
        if (accommodation.accommodationType === "hotel") {
          if (!roomType) {
            throw new Error("Hotel bookings require room type selection");
          }

          selectedRoom = accommodation.rooms.find(
            (room: any) => room._id.toString() === roomType
          );
          if (!selectedRoom) {
            throw new Error("Selected room type not found");
          }

          // Validate room availability
          if (selectedRoom.availableRooms < 1) {
            throw new Error("Selected room type is not available");
          }

          // Validate guests against room capacity (if room has capacity info)
          // Note: You might want to add capacity field to room schema if needed
        } else if (accommodation.accommodationType === "shortlet") {
          if (roomType) {
            throw new Error(
              "Shortlet bookings should not include room type selection"
            );
          }
        }

        // 4. Calculate totals based on accommodation type
        const numberOfDays = Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        );

        let basePrice = 0;
        let subtotal = 0;

        if (accommodation.accommodationType === "shortlet") {
          // Shortlet pricing - use accommodation basePrice
          basePrice = accommodation.basePrice || 0;

          // Apply accommodation-level discount if applicable
          if (
            accommodation.hasDiscount &&
            accommodation.discountType &&
            accommodation.discountValue
          ) {
            if (accommodation.discountType === "percentage") {
              basePrice = basePrice * (1 - accommodation.discountValue / 100);
            } else {
              basePrice = Math.max(0, basePrice - accommodation.discountValue);
            }
          }

          subtotal = basePrice * numberOfDays;
        } else if (accommodation.accommodationType === "hotel") {
          // Hotel pricing - use selected room basePrice
          basePrice = selectedRoom.basePrice || 0;

          // Apply room-level discount if applicable
          if (
            selectedRoom.hasDiscount &&
            selectedRoom.discountType &&
            selectedRoom.discountValue
          ) {
            if (selectedRoom.discountType === "percentage") {
              basePrice = basePrice * (1 - selectedRoom.discountValue / 100);
            } else {
              basePrice = Math.max(0, basePrice - selectedRoom.discountValue);
            }
          }

          subtotal = basePrice * numberOfDays;
        }

        const serviceFee = 0; // No service fee for accommodation requests
        const totalAmount = subtotal;

        // 5. Update room availability for hotel bookings
        if (accommodation.accommodationType === "hotel" && selectedRoom) {
          selectedRoom.availableRooms -= 1;
          await accommodation.save({ session: sessionDB });
        }

        // 6. Generate booking code
        const bookingCode = await generateBookingCode(accommodation.title);

        // 7. Create booking with "requested" status
        const booking = new Booking({
          explorer: explorerId,
          type: "accommodations",
          listing: data.listing,
          details: data.details,
          totalAmount,
          serviceFee,
          coupon: {
            code: data.couponCode,
            discount: 0, // No coupon support for accommodation requests initially
            applied: false,
          },
          status: "requested",
          paymentStatus: "pending",
          payment: null,
          code: bookingCode,
          vendorApproval: {
            status: "pending",
          },
        });

        await booking.save({ session: sessionDB });

        // 8. Send notification to vendor
        await emitNotification("booking.request", {
          bookingId: booking._id.toString(),
          vendorId: accommodation.vendor.toString(),
          listingId: accommodation._id.toString(),
          listingTitle: accommodation.title,
          listingType: "accommodations",
          explorerId: explorerId,
        });

        return {
          booking,
          accommodation,
        };
      });

      // 9. Populate explorer for response
      await result.booking.populate("explorer");

      // 10. Return response without payment data
      return {
        success: true,
        data: {
          id: result.booking._id.toString(),
          explorer: result.booking.explorer,
          type: result.booking.type,
          listing: result.booking.listing,
          details: result.booking.details,
          totalAmount: result.booking.totalAmount,
          serviceFee: result.booking.serviceFee,
          status: result.booking.status,
          createdAt: result.booking.createdAt.toISOString(),
          code: result.booking.code,
          vendorApproval: result.booking.vendorApproval,
        },
        message:
          "Accommodation booking request submitted successfully. Vendor will review and respond.",
      };
    } finally {
      sessionDB.endSession();
    }
  } catch (error: any) {
    console.error("Error creating accommodation booking request:", error);
    throw error;
  }
}