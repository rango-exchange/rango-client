import type { AppKitNetwork, CaipNetwork } from '@reown/appkit-common';

/*
 * The two networks AppKit renders the modal for, defined here instead of
 * imported from `@reown/appkit/networks`.
 *
 * That entry point is `export * from 'viem/chains'` plus AppKit's own non-EVM
 * chains, so importing a single name off it pulls every viem chain definition
 * into the consumer's bundle. One of them (`tempo`) re-exports viem's tempo
 * chainConfig, which reaches `ox`'s salt-mining worker pool - and that module
 * routes `await import(id)` through a variable so bundlers skip
 * `node:worker_threads` in the browser. webpack can't resolve the expression
 * and warns "Critical dependency: the request of a dependency is an
 * expression"; react-scripts promotes warnings to errors on CI, which fails
 * the build for anyone consuming the widget through Create React App.
 *
 * viem publishes no per-chain subpath (`./chains` is the only export), so
 * there is no narrower import to reach for - the definitions are plain data,
 * so we carry the two we need.
 *
 * Keep these in sync with upstream if AppKit's `bitcoin` or viem's `mainnet`
 * changes: `@reown/appkit/dist/esm/src/networks/bitcoin.js` and
 * `viem/_esm/chains/definitions/mainnet.js`.
 */

/**
 * Mirrors `defineChain` from both `viem/chains` and AppKit's networks module -
 * they are the same three-key spread. Declaring the viem-only formatter fields
 * keeps the objects structurally identical to the ones AppKit used to receive.
 */
function defineChain<const chain extends AppKitNetwork>(chain: chain) {
  return {
    formatters: undefined,
    fees: undefined,
    serializers: undefined,
    ...chain,
  };
}

/** viem's `mainnet`, the only EVM network we register. */
export const mainnet = defineChain({
  id: 1,
  caipNetworkId: 'eip155:1',
  chainNamespace: 'eip155',
  name: 'Ethereum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://eth.merkle.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
      apiUrl: 'https://api.etherscan.io/api',
    },
  },
  contracts: {
    ensUniversalResolver: {
      address: '0xeeeeeeee14d718c2b47d9923deab1335e144eeee',
      blockCreated: 23_085_558,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14_353_601,
    },
  },
} satisfies CaipNetwork);

/** AppKit's `bitcoin`, the only UTXO network we register. */
export const bitcoin = defineChain({
  id: '000000000019d6689c085ae165831e93',
  caipNetworkId: 'bip122:000000000019d6689c085ae165831e93',
  chainNamespace: 'bip122',
  name: 'Bitcoin',
  nativeCurrency: {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
  },
  rpcUrls: {
    default: { http: ['https://rpc.walletconnect.org/v1'] },
  },
} satisfies CaipNetwork);
