/**
 * Utility functions for calculating ticket prices with discounts
 */

export interface TicketWithDiscount {
  basePrice: number;
  hasDiscount?: boolean;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
}

/**
 * Calculate the final price of a ticket after applying discounts
 * @param ticket - The ticket object with pricing and discount information
 * @returns The final price after discount is applied
 */
export function calculateTicketPrice(ticket: TicketWithDiscount): number {
  if (!ticket.hasDiscount || !ticket.discountType || !ticket.discountValue) {
    return ticket.basePrice;
  }

  if (ticket.discountType === 'percentage') {
    // Percentage discount: reduce by percentage
    return ticket.basePrice * (1 - ticket.discountValue / 100);
  } else {
    // Fixed discount: subtract fixed amount
    return Math.max(0, ticket.basePrice - ticket.discountValue);
  }
}

/**
 * Calculate the total price for multiple tickets of the same type
 * @param ticket - The ticket object with pricing and discount information
 * @param quantity - The number of tickets
 * @returns The total price for all tickets of this type
 */
export function calculateTicketTotal(ticket: TicketWithDiscount, quantity: number): number {
  const unitPrice = calculateTicketPrice(ticket);
  return unitPrice * quantity;
}

/**
 * Format a price value for display
 * @param price - The price value to format
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}



