import { getInstance as getMetaMaskInstance } from '@rango-dev/provider-metamask';
import SolflareMetaMask from '@solflare-wallet/metamask-sdk';

export function getSolflareSnapInstance() {
  const metamaskInstance = getMetaMaskInstance();
  if (metamaskInstance) {
    const solflareMetaMask = new SolflareMetaMask();

    return solflareMetaMask;
  }

  return null;
}
