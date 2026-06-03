import type { Network, ProviderConnectResult } from '@rango-dev/wallets-shared';

import { Networks } from '@rango-dev/wallets-shared';
import { SignerError, SignerErrorCode } from 'rango-types';

import { SUPPORTED_ETH_CHAINS, SUPPORTED_NETWORKS } from './constants.js';

interface XfiInstance {
  request: (
    payload: { method: string; params: unknown[] },
    callback: (error: unknown, result: unknown) => void
  ) => void;
}

type Provider = Map<Network, XfiInstance>;

export function xdefi() {
  const { xfi } = window;

  if (!xfi) {
    return null;
  }

  const instances = new Map();
  if (xfi.bitcoin) {
    instances.set(Networks.BTC, xfi.bitcoin);
  }
  if (xfi.litecoin) {
    instances.set(Networks.LTC, xfi.litecoin);
  }
  if (xfi.thorchain) {
    instances.set(Networks.THORCHAIN, xfi.thorchain);
  }
  if (xfi.bitcoincash) {
    instances.set(Networks.BCH, xfi.bitcoincash);
  }
  if (xfi.ethereum) {
    instances.set(Networks.ETHEREUM, xfi.ethereum);
  }
  if (xfi.dogecoin) {
    instances.set(Networks.DOGE, xfi.dogecoin);
  }
  if (xfi.solana) {
    instances.set(Networks.SOLANA, xfi.solana);
  }
  if (xfi.mayachain) {
    instances.set(Networks.MAYA, xfi.mayachain);
  }

  return instances;
}

export function getEthChainsInstance(netowrk: Network | null): Network | null {
  if (!netowrk) {
    return null;
  }
  return SUPPORTED_ETH_CHAINS.includes(netowrk as Networks)
    ? Networks.ETHEREUM
    : null;
}

export async function getNonEvmAccounts(
  instances: Provider
): Promise<ProviderConnectResult[]> {
  const nonEvmNetworks = SUPPORTED_NETWORKS.filter(
    (net: Network) => net !== Networks.ETHEREUM
  );
  const promises: Promise<ProviderConnectResult>[] = nonEvmNetworks
    .filter(
      (network: Network) =>
        // Ensure the instance is defined
        instances.get(network) !== undefined
    )
    .map(async (network: Network) => {
      return new Promise<ProviderConnectResult>((resolve, reject) => {
        const instance = instances.get(network);
        if (!instance) {
          reject(new Error(`No XDeFi instance for network ${network}`));
          return;
        }
        instance.request(
          {
            method: 'request_accounts',
            params: [],
          },
          (error, accounts) => {
            if (error) {
              reject(error);
              return;
            }

            const result = {
              accounts: accounts as string[],
              chainId: network,
            };

            resolve(result);
          }
        );
      });
    });

  const results = await Promise.all(promises);

  return results;
}

interface XdefiTransferParams {
  asset: { chain: string; symbol: string; ticker: string };
  from: string;
  amount: { amount: string; decimals: number };
  memo?: string;
  recipient?: string;
}

export async function xdefiTransfer(
  blockchain: string,
  ticker: string,
  from: string,
  amount: string,
  decimals: number,
  recipientAddress: string | null,
  provider: XfiInstance,
  method: string,
  memo?: string
): Promise<string> {
  return new Promise(function (resolve, reject) {
    const params: XdefiTransferParams = {
      asset: { chain: blockchain, symbol: ticker, ticker: ticker },
      from: from,
      amount: { amount: amount, decimals: decimals },
      memo: memo,
    };
    if (recipientAddress) {
      params.recipient = recipientAddress;
    }

    provider.request({ method: method, params: [params] }, (error, result) => {
      if (error) {
        reject(
          new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error)
        );
      } else {
        resolve(result as string);
      }
    });
  });
}
