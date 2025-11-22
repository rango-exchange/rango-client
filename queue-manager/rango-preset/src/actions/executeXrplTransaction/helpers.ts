// Extracting currency and account from the following format (it's a convention on rango's backend): currency-accountAddress
export function extractFromSymbolAddress(
  symbolAddress: string
): [string, string | undefined] {
  const [currency, account] = symbolAddress.split('-');

  return [currency, account];
}
