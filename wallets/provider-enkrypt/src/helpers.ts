import { getEvmInstanceFor } from '@rango-dev/wallets-shared';

const getEvmInstance = getEvmInstanceFor('Enkrypt');

export async function enkrypt() {
  const instance = await getEvmInstance();
  return instance;
}
