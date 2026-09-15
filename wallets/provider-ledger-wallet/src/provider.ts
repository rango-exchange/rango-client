import type { Environments } from './types.js';
import type { ProviderAPI } from '@hub3js/evm';
import type { EIP6963ProviderDetail } from '@ledgerhq/ledger-wallet-provider';

import { ProviderBuilder } from '@hub3js/core';

import { metadata, WALLET_ID } from './constants.js';
import { setProvider } from './ledgerProvider.js';
import { evm } from './namespaces/evm.js';

const LEDGER_PROVIDER_NAME = 'Ledger Wallet';

const buildProvider = () =>
  new ProviderBuilder(WALLET_ID)
    .init(function (context, environments: Environments) {
      const [, setState] = context.state();

      const handleAnnounceProvider = (
        e: CustomEvent<EIP6963ProviderDetail>
      ) => {
        const { provider, info } = e.detail;

        if (info.name === LEDGER_PROVIDER_NAME) {
          /*
           * hub3 actions/signer consume the EIP-1193 provider as `ProviderAPI`.
           * Ledger's EIP1193Provider and hub3's don't structurally overlap, so
           * cast through `unknown`.
           */
          setProvider(provider as unknown as ProviderAPI);
          setState('installed', true);
        }
      };

      if (!environments?.dAppIdentifier || !environments?.apiKey) {
        throw new Error(
          'Ledger Wallet dApp identifier and API key are required'
        );
      }

      const initializeProvider = async () => {
        /*
         * Load Ledger's runtime and its stylesheet lazily (both resolved from
         * the external `@ledgerhq/ledger-wallet-provider` dependency by the host
         * bundler) so we only pull them in when the provider initializes.
         */
        await import('@ledgerhq/ledger-wallet-provider/styles.css');
        const { initializeLedgerProvider } = await import(
          '@ledgerhq/ledger-wallet-provider'
        );

        /*
         * Attach the listener BEFORE initializing so we don't race the
         * provider's immediate announce that fires during initialization.
         */
        window.addEventListener(
          'eip6963:announceProvider',
          handleAnnounceProvider as EventListener
        );

        const cleanup = initializeLedgerProvider({
          dAppIdentifier: environments.dAppIdentifier,
          apiKey: environments.apiKey,
          loggerLevel: environments.loggerLevel || 'info',
          hideButton: environments.hideButton,
        });

        /*
         * Ask every EIP-6963 provider to (re-)announce itself. Without this
         * request the listener only ever sees the one-shot announce above.
         */
        window.dispatchEvent(new Event('eip6963:requestProvider'));

        return cleanup;
      };

      let cleanup: (() => void) | undefined;

      initializeProvider()
        .then((cleanupFn) => {
          cleanup = cleanupFn;
        })
        .catch((error) => {
          console.error('[ledger-wallet] failed to initialize provider', error);
        });

      return () => {
        cleanup?.();
        window.removeEventListener(
          'eip6963:announceProvider',
          handleAnnounceProvider as EventListener
        );
      };
    })
    .config('metadata', metadata)
    .add('evm', evm)
    .build();

export { buildProvider };
