import { getEvmInstanceFor } from '@rango-dev/wallets-shared';

const getEvmInstance = getEvmInstanceFor('Trust Wallet');

export async function trustWallet() {
  const instance = await getEvmInstance();
  return instance;
}
