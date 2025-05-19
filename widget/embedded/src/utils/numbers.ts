/* eslint-disable @typescript-eslint/no-magic-numbers */

import type { BestRouteResponse } from 'rango-sdk';

import { BigNumber } from 'bignumber.js';

import { stripTrailingZeros } from './sanitizers';
import { isZeroValue } from './validation';

/*
 * if time > 1h -> rounded with 5 minutes precision
 * if time < 1h -> rounded with 15 seconds precision
 */
export const roundedSecondsToString = (s: number): string => {
  const seconds = Math.floor((s % 60) / 15) * 15;
  const minutes = parseInt((s / 60).toString());
  if (minutes >= 60) {
    return `${Math.floor(minutes / 5) * 5}:00`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

export const numberToString = (
  number: BigNumber | string | number | null | undefined,
  minDecimals: number | null = null,
  maxDecimals: number | null = null
): string => {
  if (number === null || number === undefined) {
    return '';
  }
  if (number === '') {
    return '';
  }
  const n = new BigNumber(number);
  const roundingMode = 1;
  let maxI = 1000;
  for (let i = 0; i < 60; i++) {
    if (new BigNumber(n.toFixed(i, roundingMode)).eq(n)) {
      maxI = i;
      break;
    }
  }

  if (n.gte(10000)) {
    return n.toFormat(0, roundingMode);
  }
  if (n.gte(1000)) {
    return n.toFormat(
      Math.min(
        maxI,
        Math.min(maxDecimals || 100, Math.max(minDecimals || 0, 1))
      ),
      roundingMode
    );
  }
  if (n.gte(100)) {
    return n.toFormat(
      Math.min(
        maxI,
        Math.min(maxDecimals || 100, Math.max(minDecimals || 0, 1))
      ),
      roundingMode
    );
  }
  if (n.gte(1)) {
    return n.toFormat(
      Math.min(
        maxI,
        Math.min(maxDecimals || 100, Math.max(minDecimals || 0, 2))
      ),
      roundingMode
    );
  }
  if (n.gte(0.01)) {
    return n.toFormat(
      Math.min(
        maxI,
        Math.min(maxDecimals || 100, Math.max(minDecimals || 0, 4))
      ),
      roundingMode
    );
  }
  for (let i = minDecimals || 4; i < 17; i++) {
    if (n.gte(Math.pow(10, -i))) {
      return n.toFormat(
        Math.min(
          maxI,
          Math.min(maxDecimals || 100, Math.max(minDecimals || 0, i))
        ),
        roundingMode
      );
    }
  }
  if (n.isEqualTo(0)) {
    return '0';
  }

  return n.toFormat(
    Math.min(maxI, Math.min(maxDecimals || 100, Math.max(minDecimals || 0, 8))),
    roundingMode
  );
};

export const uint8ArrayToHex = (buffer: Uint8Array): string => {
  // buffer is an ArrayBuffer
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return [...buffer].map((x) => x.toString(16).padStart(2, '0')).join('');
};

export const totalArrivalTime = (
  data: { estimatedTimeInSeconds: number | null }[] | undefined
) => data?.reduce((a, b) => a + (b.estimatedTimeInSeconds ?? 0), 0) || 0;

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

export function sanitizeInputAmount(amount: string): string {
  if (isZeroValue(amount)) {
    return '0';
  }

  return stripTrailingZeros(amount);
}
