import { tronTronlink } from '../utils.js';

const canEagerConnectAction = () => {
  const tronInstance = tronTronlink();
  // Making sure that the Tron instance is available first to prevent errors.
  if (!tronInstance) {
    throw new Error(
      'Trying to eagerly connect to your wallet, but seems its tron instance is not available.'
    );
  }
  return tronInstance.ready;
};
export const tronActions = { canEagerConnectAction };
