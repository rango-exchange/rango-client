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
