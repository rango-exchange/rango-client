import { BigNumber } from 'bignumber.js';
import { BestRouteResponse } from 'rango-sdk';

export const percentToString = (p: number, fractions = 0): string =>
  (p * 100).toFixed(fractions);
export const secondsToString = (s: number): string => {
  const seconds = (s % 60).toString().padStart(2, '0');
  const minutes = parseInt((s / 60).toString())
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const numberToString = (
  number: BigNumber | string | null | undefined,
  minDecimals: number | null = null,
  maxDecimals: number | null = null
): string => {
  if (number === null || number === undefined) return '';
  if (number === '') return '';
  const n = new BigNumber(number);
  const roundingMode = 1;
  let maxI = 1000;
  for (let i = 0; i < 60; i++) {
    if (new BigNumber(n.toFixed(i, roundingMode)).eq(n)) {
      maxI = i;
      break;
    }
  }

  if (n.gte(10000)) return n.toFormat(0, roundingMode);
  if (n.gte(1000))
    return n.toFormat(
      Math.min(
        maxI,
        Math.min(maxDecimals || 100, Math.max(minDecimals || 0, 1))
      ),
      roundingMode
    );
  if (n.gte(100))
    return n.toFormat(
      Math.min(
        maxI,
        Math.min(maxDecimals || 100, Math.max(minDecimals || 0, 1))
      ),
      roundingMode
    );
  if (n.gte(1))
    return n.toFormat(
      Math.min(
        maxI,
        Math.min(maxDecimals || 100, Math.max(minDecimals || 0, 2))
      ),
      roundingMode
    );
  if (n.gte(0.01))
    return n.toFormat(
      Math.min(
        maxI,
        Math.min(maxDecimals || 100, Math.max(minDecimals || 0, 4))
      ),
      roundingMode
    );
  for (let i = minDecimals || 4; i < 17; i++)
    if (n.gte(Math.pow(10, -i)))
      return n.toFormat(
        Math.min(
          maxI,
          Math.min(maxDecimals || 100, Math.max(minDecimals || 0, i))
        ),
        roundingMode
      );
  if (n.isEqualTo(0)) return '0';

  return n.toFormat(
    Math.min(maxI, Math.min(maxDecimals || 100, Math.max(minDecimals || 0, 8))),
    roundingMode
  );
};

export const convertBigNumberToHex = (
  value: BigNumber,
  decimals: number
): string => {
  return '0x' + value.shiftedBy(decimals).toString(16);
};

export const uint8ArrayToHex = (buffer: Uint8Array): string => {
  // buffer is an ArrayBuffer
  // @ts-ignore
  return [...buffer].map((x) => x.toString(16).padStart(2, '0')).join('');
};

export function dollarToConciseString(num: number | undefined): string {
  if (!num) return '-';
  if (num < 1) return ' < 1$';
  if (num < 1000) return numberToString(new BigNumber(num)) + '$';
  if (num < 10_000) return parseInt((num / 100).toString()) / 10 + 'K';
  if (num < 1_000_000) return parseInt((num / 1000).toString()) + 'K';
  if (num < 100_000_000) return parseInt((num / 100000).toString()) / 10 + 'M';
  return parseInt((num / 1000000).toString()) + 'M';
}

export function removeExtraDecimals(num: string, maxDecimals: number): string {
  try {
    if (!num.includes('.')) return num;
    const [b, f] = num.split('.');
    if (f && f.length > maxDecimals) {
      return `${b}.${f.substring(0, maxDecimals)}`;
    }
    return num;
  } catch (e) {
    return num;
  }
}

export const totalArrivalTime = (data: BestRouteResponse | null) =>
  data?.result?.swaps?.reduce((a, b) => a + b.estimatedTimeInSeconds, 0) || 0;

export const rawFees = (data: BestRouteResponse): string =>
  (
    data?.result?.swaps?.flatMap((s) =>
      s.fee.map((f) => ({ swapperId: s.swapperId, fee: f }))
    ) || []
  )
    .reduce((partialSum, a) => partialSum + parseFloat(a.fee.amount), 0)
    .toFixed(3);

export const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

export const isPositiveNumber = (text?: string) =>
  !!text && parseFloat(text) > 0;
10;
