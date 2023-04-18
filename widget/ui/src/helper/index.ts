export function containsText(text: string, searchText: string): boolean {
  return text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
}

export function getConciseAddress(
  address: string | null,
  maxChars = 8,
  ellipsisLength = 3
): string | null {
  if (!address) return null;
  if (address.length < 2 * maxChars + ellipsisLength) return address;
  const start = Math.ceil((address.length - maxChars) / 2);
  const end = address.length - maxChars;
  return `${address.substr(start, maxChars)}${'.'.repeat(
    ellipsisLength
  )}${address.substr(end)}`;
}

export function limitDecimalPlaces(
  numberString: string,
  maxDecimalPlaces = 4
): string {
  const number = parseFloat(numberString);
  if (isNaN(number))
    return numberString; // Return the original string if it's not a valid number
  else {
    const multiplier = Math.pow(10, maxDecimalPlaces);
    const roundedNumber = Math.round(number * multiplier) / multiplier;
    return roundedNumber.toString();
  }
}
