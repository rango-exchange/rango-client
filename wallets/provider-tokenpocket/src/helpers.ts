import { getEvmInstanceFor } from '@rango-dev/wallets-shared';

const getEvmInstance = getEvmInstanceFor('TokenPocket');

export async function tokenpocket() {
  const instance = await getEvmInstance();
  return instance;
}
