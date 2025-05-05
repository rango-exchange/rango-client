import BigNumber from 'bignumber.js';

export const ZERO = new BigNumber(0);
export const MAX_DECIMAL_PLACES = 5;

// detect pure-zero inputs: "0", "000", "0.0000", etc.
export const ALL_ZERO_REGEX: RegExp = /^0+(\.0+)?$/;

// strip any leading zeros when followed by a digit
export const LEADING_ZEROS_REGEX: RegExp = /^0+(?=\d)/g;

// detect a leading dot plus digits (e.g. ".5")
export const LEADING_DOT_REGEX: RegExp = /^\.(\d+)/;
