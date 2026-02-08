 

/**
 * Format a price as a string with the Tunisian Dinar symbol and thousands separator
 * @param price - The price to format
 * @returns Formatted price string with DT symbol and thousands separator (e.g., "1,234.50 DT")
 */
export function formatPriceWithSeparator(price: number): string {
  return `${price.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} DT`;
}
