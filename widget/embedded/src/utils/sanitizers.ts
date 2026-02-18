/**
 * Remove leading zeros when followed by another digit.
 * @example "000123" → "123"
 */
export function removeLeadingZeros(input: string): string {
  return input.replace(/^0+(?=\d)/g, '');
}

/**
 * Ensure a leading zero before a decimal point.
 * @example ".45" → "0.45"
 */
export function ensureLeadingZeroForDecimal(input: string): string {
  return input.replace(/^\.(\d+)/, '0.$1');
}

/**
 * Insert commas as thousand separators.
 * @example "1234567" → "1,234,567"
 */
export function formatThousandsWithCommas(input: string): string {
  return input.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Replace spaces (one or more) with a single dash.
 * @example "a b  c" → "a-b-c"
 */
export function replaceSpacesWithDash(input: string): string {
  return input.replace(/\s+/g, '-');
}

/**
 * Strip any trailing zeros in the fractional part, and remove a dangling decimal point.
 * @example "0.0010000" → "0.001"
 * @example "10.000"    → "10"
 */
export function stripTrailingZeros(input: string): string {
  const s = input.replace(/(\.\d*?[1-9])0+$/, '$1');
  return s.replace(/\.0+$/, '');
}

/**
 * Normalize a numeric input string by removing all non-numeric characters
 * except digits and a single decimal separator.
 *
 * This function:
 * - strips letters, spaces, commas, and symbols
 * - preserves digits (`0–9`)
 * - keeps only the first `.` as the decimal point
 *
 * @example "300,222"     → "300222"
 * @example "12a3.4b5"   → "123.45"
 * @example "1.2.3.4"    → "1.234"
 * @example ".5"         → ".5"
 */
export function parseNumericValue(value: string): string {
  value = value
    // 1. Remove everything except digits and dots
    .replace(/[^\d.]/g, '')
    // 2. Keep only the first dot
    .replace(/\./g, (_, offset, string) =>
      string.indexOf('.') === offset ? '.' : ''
    );

  return value;
}
