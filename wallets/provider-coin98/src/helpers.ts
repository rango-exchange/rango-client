import { Networks } from '@rango-dev/wallets-shared';

export function coin98() {
  const { coin98, ethereum } = window;

  if (!coin98) {
    return null;
  }

  const instances = new Map();

  // When disabled overring metamask
  if (coin98.provider) {
    instances.set(Networks.ETHEREUM, coin98.provider);
  }
  if (ethereum && ethereum.isCoin98) {
    instances.set(Networks.ETHEREUM, ethereum);
  }
  if (coin98.sol) {
    instances.set(Networks.SOLANA, coin98.sol);
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
