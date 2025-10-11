import type { XrplTransactionDataIssuedCurrencyAmount } from 'rango-types';

export function isIssuedCurrencyAmount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  amount: any
): amount is XrplTransactionDataIssuedCurrencyAmount {
  return (
    typeof amount === 'object' &&
    typeof amount.currency === 'string' &&
    typeof amount.issuer === 'string' &&
    typeof amount.value === 'string'
  );
}
