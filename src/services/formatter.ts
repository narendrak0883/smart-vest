// src/services/formatter.ts

/**
 * Formats a number as currency in Indian format (with lakhs and crores)
 * @param value - The number to format
 * @param currency - The currency symbol (default: ₹)
 * @param minimumFractionDigits - Minimum fraction digits (default: 0)
 * @returns Formatted currency string
 */
export const formatCurrency = (
    value: number,
    currency: string = '₹',
    minimumFractionDigits: number = 0
  ): string => {
    // For values greater than or equal to 1 crore (10 million)
    if (value >= 10000000) {
      const crores = value / 10000000;
      return `${currency} ${crores.toFixed(minimumFractionDigits)}Cr`;
    }
    
    // For values greater than or equal to 1 lakh (100,000)
    if (value >= 100000) {
      const lakhs = value / 100000;
      return `${currency} ${lakhs.toFixed(minimumFractionDigits)}L`;
    }
    
    // For smaller values, use regular Indian number formatting
    return `${currency} ${value.toLocaleString('en-IN', {
      minimumFractionDigits,
      maximumFractionDigits: 2
    })}`;
  };
  
  /**
   * Formats a percentage value
   * @param value - The percentage value
   * @param includeSign - Whether to include + sign for positive values
   * @param decimalPlaces - Number of decimal places
   * @returns Formatted percentage string
   */
  export const formatPercentage = (
    value: number,
    includeSign: boolean = true,
    decimalPlaces: number = 2
  ): string => {
    const sign = includeSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(decimalPlaces)}%`;
  };
  
  /**
   * Truncates text to a specified length and adds ellipsis if needed
   * @param text - The text to truncate
   * @param maxLength - Maximum length before truncation
   * @returns Truncated text with ellipsis if needed
   */
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };
  
  /**
   * Formats a date in Indian style (DD-MMM-YYYY)
   * @param date - Date object or string representation
   * @returns Formatted date string
   */
  export const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = dateObj.toLocaleString('en', { month: 'short' });
    const year = dateObj.getFullYear();
    
    return `${day}-${month}-${year}`;
  };