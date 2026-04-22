/**
 * Standard success response
 */
function successResponse(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

/**
 * Standard error response
 */
function errorResponse(res, message = 'Server Error', statusCode = 500) {
  return res.status(statusCode).json({ success: false, message });
}

/**
 * Check if two date ranges overlap (used for double-booking prevention)
 * @param {string} startA - Check-in A
 * @param {string} endA   - Check-out A
 * @param {string} startB - Check-in B
 * @param {string} endB   - Check-out B
 * @returns {boolean}
 */
function datesOverlap(startA, endA, startB, endB) {
  return new Date(startA) < new Date(endB) && new Date(startB) < new Date(endA);
}

module.exports = { successResponse, errorResponse, datesOverlap };
