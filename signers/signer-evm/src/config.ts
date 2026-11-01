import { DEFAULT_ETHEREUM_RPC_URL } from './constants.js';

type EvmSignerConfig = {
  customRPC?: string;
};

const evmSignerConfig: EvmSignerConfig = {};

export function setEvmSignerConfig<Key extends keyof EvmSignerConfig>(
  key: Key,
  value: EvmSignerConfig[Key]
) {
  evmSignerConfig[key] = value;

  return value;
}

export function getEvmSignerConfig<Key extends keyof EvmSignerConfig>(
  key: Key
): EvmSignerConfig[Key] {
  return evmSignerConfig[key];
}

export function getEthereumRpcUrl(): string {
  return getEvmSignerConfig('customRPC') || DEFAULT_ETHEREUM_RPC_URL;
}
