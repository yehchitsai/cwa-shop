/**
 * Helper to coerce values to safe numbers, preventing NaN rendering
 * @param {*} v - Value to convert to a safe number
 * @returns {number} - A valid number or 0.0 if input is invalid
 */
const toSafeNumber = (v) => {
  if (v === null || v === undefined) return 0.0
  // handle strings with commas or whitespace
  const num = Number(String(v).replace(/,/g, '').trim())
  return Number.isFinite(num) ? num : 0.0
}

export default toSafeNumber
