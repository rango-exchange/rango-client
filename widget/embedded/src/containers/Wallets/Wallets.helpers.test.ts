import type { EventInfo, WalletState } from '@rango-dev/wallets-react';

import { AutoConnectionAttemptError, Events } from '@rango-dev/wallets-react';
import { describe, expect, it, vi } from 'vitest';

import { propagateEvents } from './Wallets.helpers';

const CORE_STATE: WalletState = {
  connected: false,
  connecting: false,
  reachable: false,
  installed: true,
  accounts: null,
  network: null,
};

const INFO: EventInfo = {
  supportedBlockchains: [],
  isContractWallet: false,
  isHub: true,
};

describe('propagating events to the integrator', () => {
  it('passes an event on, unchanged', () => {
    const onUpdateState = vi.fn();

    propagateEvents(onUpdateState, [
      'metamask',
      Events.CONNECTED,
      true,
      CORE_STATE,
      INFO,
    ]);

    expect(onUpdateState).toHaveBeenCalledWith(
      'metamask',
      Events.CONNECTED,
      true,
      CORE_STATE,
      INFO
    );
  });

  it('keeps provider disconnected and auto-connect failed events from the integrator', () => {
    const onUpdateState = vi.fn();

    propagateEvents(onUpdateState, [
      'metamask',
      Events.PROVIDER_DISCONNECTED,
      undefined,
      CORE_STATE,
      INFO,
    ]);
    propagateEvents(onUpdateState, [
      'metamask',
      Events.AUTO_CONNECT_FAILED,
      new AutoConnectionAttemptError({
        errors: [new Error('boom')],
        requestedNamespaces: [{ namespace: 'EVM', network: undefined }],
      }),
      CORE_STATE,
      INFO,
    ]);

    expect(onUpdateState).not.toHaveBeenCalled();
  });
});
