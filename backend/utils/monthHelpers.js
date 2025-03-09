import Month from '../models/monthsModel.js';
/**
 * Returns the monthIndex for a given month name.
 * @param {String} monthName - e.g., "January"
 * @returns {Number|null} - monthIndex or null if not found
 */
export const getMonthIndexByName = async (monthName) => {
  const monthDoc = await Month.findOne({ month: monthName });
  return monthDoc ? monthDoc.monthIndex : null;
};


/**
 * Returns the month name for a given monthIndex.
 * @param {Number} index - e.g., 1
 * @returns {String|null} - month name or null if not found
 */
export const getMonthNameByIndex = async (index) => {
  const monthDoc = await Month.findOne({ monthIndex: index });
  return monthDoc ? monthDoc.month : null;
};
