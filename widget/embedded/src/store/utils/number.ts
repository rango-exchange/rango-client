import {
  ALL_ZERO_REGEX,
  LEADING_DOT_REGEX,
  LEADING_ZEROS_REGEX,
  MAX_DECIMAL_PLACES,
} from '../../constants/numbers';

export function sanitizeInputNumber(inputAmount: string) {
  let sanitized = inputAmount;

  // truncate fraction to max places
  if (sanitized.includes('.')) {
    const [intPart, fracPart] = sanitized.split('.');
    sanitized = intPart + '.' + fracPart.slice(0, MAX_DECIMAL_PLACES);
  }

  if (!ALL_ZERO_REGEX.test(sanitized)) {
    // sanitize once a meaningful digit is entered (e.g. "00001" → "1")
    sanitized = sanitized.replace(LEADING_ZEROS_REGEX, '');
    sanitized = sanitized.replace(LEADING_DOT_REGEX, '0.$1');
  }

  return sanitized;
}
