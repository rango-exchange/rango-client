/**
 * Check if a string is composed only of zeros, optionally with decimal zeros.
 * @param input - string to test, e.g. "0", "000.00"
 * @returns true when input represents zero, otherwise false
 */
export function isZeroValue(input: string) {
  const zeroPattern = /^0+(?:\.0+)?$/;
  return zeroPattern.test(input);
}

/**
 * Validate currency-style input: up to `maxDecimals` places after the decimal point.
 * @param input - string to test, e.g. "0", "10.25"
 * @param maxDecimals - maximum digits allowed after the decimal (default: 2)
 * @returns true for valid money formats, false otherwise
 */
export function isValidCurrencyFormat(
  input: string,
  maxDecimals: number = 2
): boolean {
  // construct pattern like ^(?:0|[1-9]\d*)(?:\.\d{1,2})?$
  const pattern = `^(?:0|[1-9]\\d*)(?:\\.\\d{1,${maxDecimals}})?$`;
  const regex = new RegExp(pattern);
  return regex.test(input);
}

/**
 * Test if a string is a numeric literal (integers or decimals), allows leading zeros.
 * @param input - string to test, e.g. "00.5", "123"
 * @returns true when string is numeric, false otherwise
 */
export function isNumeric(input: string): boolean {
  const numericPattern = /^\d+(?:\.\d+)?$/;
  return numericPattern.test(input);
}

/**
 * Detect if a color key name ends with digits (overriding default shades).
 * @param key - color key, e.g. "primary", "secondary100"
 * @returns true when key has numeric suffix, false otherwise
 */
export function isColorKeyOverridden(key: string): boolean {
  const overridePattern = /\d+$/;
  return overridePattern.test(key);
}
