import { ChangeAccountSubscriberBuilder } from '@rango-dev/wallets-core/namespaces/common';
import {
  type ProviderAPI,
  type SolanaActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/solana';

const changeAccountSubscriber = (getInstance: () => ProviderAPI) =>
  new ChangeAccountSubscriberBuilder<string[], ProviderAPI, SolanaActions>()
    .getInstance(getInstance)
    /*
     * Coin98 returns EVM addresses on account change instead of Solana addresses even though
     * we are listening to the changes on the Solana instance.
     * But if we get the EVM address, it means that we also have permission to eagerly get
     * the Solana address of the new account. After getting the address,
     * we manually update the `accounts` state and pass an empty function to the `format` because
     * we are preventing it from being used.
     */
    .onSwitchAccount(async (event, context) => {
      event.preventDefault();
      if (event.payload && event.payload.length !== 0) {
        const [, setState] = context.state();
        const solanaInstance = getInstance();
        const result = await solanaInstance.connect({ onlyIfTrusted: true });
        setState('accounts', utils.formatAccountsToCAIP(result));
      } else {
        context.action('disconnect');
      }
    })
    .format(async () => [])
    .addEventListener((instance, callback) => {
      instance.on('accountsChanged', callback);
    })
    .removeEventListener((instance, callback) => {
      instance.off('accountsChanged', callback);
    });

export const solanaBuilders = { changeAccountSubscriber };
