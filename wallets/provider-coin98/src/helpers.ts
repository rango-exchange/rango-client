import { getEvmInstanceFor, Networks } from '@rango-dev/wallets-shared';

const getEvmInstance = getEvmInstanceFor('Coin98 Wallet');

export async function coin98() {
  const { coin98 } = window;
  const instances = new Map();

  if (coin98?.sol) {
    instances.set(Networks.SOLANA, coin98.sol);
  }

  const evmInstance = await getEvmInstance();
  if (evmInstance) {
    instances.set(Networks.ETHEREUM, evmInstance);
  }

  if (instances.size === 0) {
    return null;
  }

  return instances;
}

/*
 *This is how coin98 is getting solana accounts.
 *That's the reason we haven't moved it to `shared`
 */
export async function getSolanaAccounts(instance: any) {
  await instance.enable();
  const accounts = await instance.request({ method: 'sol_accounts' });
  return {
    accounts,
  };
}
