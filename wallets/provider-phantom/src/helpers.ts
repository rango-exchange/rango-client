import { type Connect, Networks } from '@rango-dev/wallets-shared';

export function phantom() {
  if ('phantom' in window) {
    const phantom: any = window.phantom;
    const instances = new Map();

    if (phantom?.solana?.isPhantom) {
      instances.set(Networks.SOLANA, phantom.solana);
    }

    if (phantom?.bitcoin?.isPhantom) {
      instances.set(Networks.BTC, phantom.bitcoin);
    }

    return instances;
  }

  return null;
}

export const getBTCAccounts: Connect = async ({ instance }) => {
  const accounts = await instance.requestAccounts();
  return {
    accounts: accounts.map(
      (account: {
        address: string;
        publicKey: string;
        addressType: 'p2tr' | 'p2wpkh' | 'p2sh' | 'p2pkh';
        purpose: 'payment' | 'ordinals';
      }) => account.address
    ),
    chainId: Networks.BTC,
  };
};
