import { Notification } from "@/models/notification";
// import { Booking } from "@/models/booking";
import {
  notificationEvents,
  NotificationEventData,
} from "@/lib/notificationEvents";
import mongoose from "mongoose";

// Direct notification handler (no EventEmitter for serverless compatibility)
async function handleNotificationEvent(
  event: string,
  data: NotificationEventData
) {
  try {
    const config = notificationEvents[event as keyof typeof notificationEvents];
    if (!config) {
      throw new Error(`Unknown event: ${event}`);
    }
    
    // Fetch additional data if needed
    const enhancedData = { ...data };
    // if (data.bookingId && !data.listingTitle) {
    //   const booking = await Booking.findById(data.bookingId).populate(
    //     "listing"
    //   );
    //   if (booking?.type && booking.listing) {
    //     const model = mongoose.model(booking.listingType);
    //     const listing = await model.findById(booking.listing);
    //     enhancedData.listingTitle = listing?.title || `Unknown ${booking.type}`;
    //     enhancedData.listingType = booking.type;
    //   }
    // }

    // Get recipients
    const recipients = config.recipients(enhancedData);

    // Create notifications
    const notifications = recipients
      .map((recipient) => {
        if (!recipient.id) {
          return null;
        }
        
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(recipient.id)) {
          return null;
        }
        
        const title = config.title(enhancedData);
        const subtext = config.subtext(enhancedData);
        const content = config.template(enhancedData);
        const link = config.link(enhancedData);
        const action = config.action(enhancedData);
        const metadata = config.metadata(enhancedData);
        
        const notification = {
          recipient: new mongoose.Types.ObjectId(recipient.id),
          type: config.type,
          title,
          subtext,
          content,
          link,
          action,
          metadata,
          status: "unread",
          isActive: true,
        };
        
        return notification;
      })
      .filter((n): n is NonNullable<typeof n> => n !== null);
    
    // Save notifications
    if (notifications.length > 0) {
      
      try {
        const result = await Notification.insertMany(notifications);
        console.log(`✅ Notifications saved:`, result);
      } catch (dbError) {
        throw dbError;
      }
    } else {
      console.log(`⚠️ No notifications to save`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${event}:`, error);
  }
}

// Direct notification function (no EventEmitter)
export async function emitNotification(event: string, data: NotificationEventData) {
  
  try {
    // Process notification directly instead of using EventEmitter
    await handleNotificationEvent(event, data);
  } catch (error) {
    console.error(`❌ Error processing event ${event}:`, error);
  }
}