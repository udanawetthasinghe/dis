// src/utils/dateUtils.js

/**
 * Returns the ISO week number for a given date.
 * Weeks start on Monday and the first week of the year is the one that contains January 4th.
 *
 * @param {Date} date - The date object for which to calculate the week number.
 * @returns {number} The ISO week number.
 */
export function getWeekNumber(date) {
    // Copy the date to avoid modifying the original
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // (Sunday is 0, so we convert it to 7)
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    // Calculate the first day of the year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate the week number
    const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNumber;
  }
  