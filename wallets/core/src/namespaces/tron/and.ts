import { connectAndUpdateStateForSingleNetwork } from '../common/mod.js';

export const recommended = [
  ['connect', connectAndUpdateStateForSingleNetwork] as const,
];
