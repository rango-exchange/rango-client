import { Connection } from '@solana/web3.js';

const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const SOLANA_RPC_URL = !IS_DEV
  ? 'https://icy-crimson-wind.solana-mainnet.quiknode.pro/c83f94ebeb39a6d6a9d2ab03d4cba2c2af83c5c0/'
  : 'https://fluent-still-scion.solana-mainnet.discover.quiknode.pro/fc8be9b8ac7aea382ec591359628e16d8c52ef6a/';

export function getSolanaConnection(): Connection {
  return new Connection(SOLANA_RPC_URL, {
    commitment: 'confirmed',
    disableRetryOnRateLimit: false,
  });
}

export const wait = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));
