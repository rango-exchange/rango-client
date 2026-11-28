import type { EvmRpcUrls } from '@hub3js/evm';
import type { NamespacesRPCUrls } from '@hub3js/namespaces';

/**
 * RPC urls as an app configures them. An EVM url serves one chain, so EVM urls
 * are keyed by chain id, e.g. `{ evm: { 1: ['https://…'], 56: ['https://…'] } }`.
 */
export type RpcUrlsConfig = {
  evm?: Record<number, string[]>;
};

/**
 * Turns configured RPC urls into the shape providers are built with. Each EVM
 * chain gets a minimal viem chain: its id and urls are what reads need. Chains
 * without urls are left out, so reads on them reject instead of going to a url
 * we don't control.
 */
export function toNamespacesRPCUrls(config?: RpcUrlsConfig): NamespacesRPCUrls {
  const evm: EvmRpcUrls = [];

  for (const [key, urls] of Object.entries(config?.evm ?? {})) {
    const id = Number(key);
    const rpcUrls = urls.filter(Boolean);

    if (!Number.isInteger(id) || id <= 0 || rpcUrls.length === 0) {
      continue;
    }

    evm.push({
      chain: {
        id,
        name: `EVM chain ${id}`,
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: { default: { http: rpcUrls } },
      },
      rpcUrls,
    });
  }

  return evm.length ? { evm } : {};
}
