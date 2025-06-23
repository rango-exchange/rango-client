import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  type Cluster,
  clusterApiUrl,
  Connection,
  type ConnectionConfig,
} from '@solana/web3.js';
import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter,
} from '@solana-mobile/wallet-adapter-mobile';

export type Provider = Map<string, unknown>;
const CLUSTER = WalletAdapterNetwork.Mainnet;
const CONNECTION_CONFIG: ConnectionConfig = { commitment: 'processed' };
const ENDPOINT = /*#__PURE__*/ clusterApiUrl(CLUSTER);
let _mobileWalletAdapter: SolanaMobileWalletAdapter;
let _connection: Connection;
export function connection(): Connection {
  if (!_connection) {
    _connection = new Connection(ENDPOINT, CONNECTION_CONFIG);
  }
  return _connection;
}
export function mobileWalletAdapter() {
  if (!_mobileWalletAdapter) {
    _mobileWalletAdapter = new SolanaMobileWalletAdapter({
      addressSelector: createDefaultAddressSelector(),
      appIdentity: {
        uri: getUriForAppIdentity(),
      },
      authorizationResultCache: createDefaultAuthorizationResultCache(),
      chain: getInferredClusterFromEndpoint(connection()?.rpcEndpoint),
      onWalletNotFound: createDefaultWalletNotFoundHandler(),
    });
  }
  return _mobileWalletAdapter;
}
function getUriForAppIdentity() {
  const location = globalThis.location;
  if (!location) {
    return;
  }
  return `${location.protocol}//${location.host}`;
}
function getInferredClusterFromEndpoint(endpoint?: string): Cluster {
  if (!endpoint) {
    return 'mainnet-beta';
  }
  if (/devnet/i.test(endpoint)) {
    return 'devnet';
  } else if (/testnet/i.test(endpoint)) {
    return 'testnet';
  }
  return 'mainnet-beta';
}
