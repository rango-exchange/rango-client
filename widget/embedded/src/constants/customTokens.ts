import { TransactionType } from 'rango-types';

export const ACTIVE_BLOCKCHAINS_FOR_CUSTOM_TOKENS: string[] = [
  TransactionType.EVM,
  TransactionType.SOLANA,
];

export const DEFAULT_TOKEN_IMAGE_SRC =
  'https://raw.githubusercontent.com/rango-exchange/assets/refs/heads/main/common/unknown-image.png';
