import type { Connection } from '@solana/web3.js';

import { getSolanaSignerConfig } from '../config.js';

const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const SOLANA_RPC_URL = !IS_DEV
  ? 'https://purple-practical-friday.solana-mainnet.quiknode.pro/d94ab067f793d48c81354c78c86ae908d9fc1582/'
  : 'https://fluent-still-scion.solana-mainnet.discover.quiknode.pro/fc8be9b8ac7aea382ec591359628e16d8c52ef6a/';

export async function getSolanaConnection(): Promise<Connection> {
  const customRPC = getSolanaSignerConfig('customRPC');
  const { Connection } = await import('@solana/web3.js');

  return new Connection(customRPC || SOLANA_RPC_URL, {
    commitment: 'confirmed',
    disableRetryOnRateLimit: false,
  });
}

export const wait = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));
