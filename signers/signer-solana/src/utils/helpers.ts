import type { RpcNodeUrls } from './types.js';

import { Connection } from '@solana/web3.js';

import { getSolanaSignerConfig } from '../config.js';

const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
// This main rpc url is used to fetch latest blockhash, simulate transaction, etc
const DEFAULT_SOLANA_RPC_URL = !IS_DEV
  ? 'https://purple-practical-friday.solana-mainnet.quiknode.pro/d94ab067f793d48c81354c78c86ae908d9fc1582/'
  : 'https://fluent-still-scion.solana-mainnet.discover.quiknode.pro/fc8be9b8ac7aea382ec591359628e16d8c52ef6a/';

export function getSolanaConnection(url: string): Connection {
  return new Connection(url, {
    commitment: 'confirmed',
    disableRetryOnRateLimit: false,
  });
}

export function getSolanaRpcNodes(): RpcNodeUrls {
  const customRPC = getSolanaSignerConfig('customRPC');
  let list: string[] = [];

  if (customRPC) {
    if (!Array.isArray(customRPC)) {
      list = [customRPC];
    } else if (customRPC.length) {
      list = customRPC;
    }
  } else {
    list = [DEFAULT_SOLANA_RPC_URL];
  }

  return { main: list[0], list };
}

export const wait = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));
