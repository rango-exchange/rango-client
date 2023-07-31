import {
  Network,
  Networks,
  ProviderConnectResult,
} from '@rango-dev/wallets-shared';
import { SUPPORTED_ETH_CHAINS, SUPPORTED_NETWORKS } from './constants';
import { SignerError, SignerErrorCode } from 'rango-types';

type Provider = Map<Network, any>;

export function xdefi() {
  const { xfi, ethereum } = window;

  if (!xfi) return null;

  const instances = new Map();
  if (xfi.bitcoin) instances.set(Networks.BTC, xfi.bitcoin);
  if (xfi.litecoin) instances.set(Networks.LTC, xfi.litecoin);
  if (xfi.thorchain) instances.set(Networks.THORCHAIN, xfi.thorchain);
  if (xfi.bitcoincash) instances.set(Networks.BCH, xfi.bitcoincash);
  if (xfi.binance) instances.set(Networks.BINANCE, xfi.binance);
  if (ethereum?.__XDEFI) instances.set(Networks.ETHEREUM, ethereum);
  if (xfi.dogecoin) instances.set(Networks.DOGE, xfi.dogecoin);
  if (xfi.solana) instances.set(Networks.SOLANA, xfi.solana);

  return instances;
}

export function getEthChainsInstance(netowrk: Network | null): Network | null {
  if (!netowrk) return null;
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
  const promises: Promise<ProviderConnectResult>[] = nonEvmNetworks.map(
    (network: Network) => {
      return new Promise((resolve, reject) => {
        const instance = instances.get(network);
        instance.request(
          {
            method: 'request_accounts',
            params: [],
          },
          (error: any, accounts: any) => {
            if (error) {
              reject(error);
              return error;
            }

            const result = {
              accounts,
              chainId: network,
            };

            resolve(result);
          }
        );
      });
    }
  );

  const results = await Promise.all(promises);

  return results;
}

export function xdefiTransfer(
  blockchain: string,
  ticker: string,
  from: string,
  amount: string,
  decimals: number,
  recipientAddress: string | null,
  provider: any,
  method: string,
  memo: string | null
): Promise<string> {
  return new Promise(function (resolve, reject) {
    const params = {
      asset: { chain: blockchain, symbol: ticker, ticker: ticker },
      from: from,
      amount: { amount: amount, decimals: decimals },
      memo: memo,
      // recipient: to,
    } as any;
    if (recipientAddress) params.recipient = recipientAddress;

    provider.request(
      { method: method, params: [params] },
      (error: any, result: any) => {
        if (error)
          reject(
            new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error)
          );
        else resolve(result);
      }
    );
  });
}
