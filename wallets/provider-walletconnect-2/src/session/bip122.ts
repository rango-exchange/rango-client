import type { SignClientInstance } from '../types.js';
import type { SessionTypes, SignClientTypes } from '@walletconnect/types';

import { debug } from '@rango-dev/logging-core';
import { CAIP_BITCOIN_CHAIN_ID } from '@rango-dev/wallets-core/namespaces/utxo';
import { AccountId } from 'caip';

import { BitcoinEvents, NAMESPACES } from '../wcConstants.js';

export function getBip122AccountsFromSession(
  session: SessionTypes.Struct
): string[] {
  return session.namespaces[NAMESPACES.BITCOIN]?.accounts ?? [];
}

export function filterBip122Accounts(session: SessionTypes.Struct) {
  return getBip122AccountsFromSession(session).map((account) => ({
    address: new AccountId(account).address,
  }));
}

export type Bip122AddressEntry = {
  address: string;
  intention?: 'payment' | 'ordinal';
};

/**
 * Every address a `bip122_addressesChanged` payload carries, in wallet order.
 * Unlike {@link pickPaymentAddress} it makes no guess about which one is active.
 */
export function getAnnouncedAddresses(
  data: Bip122AddressEntry[] | string[] | undefined
): string[] {
  if (!data?.length) {
    return [];
  }

  return data
    .map((entry) => (typeof entry === 'string' ? entry : entry?.address))
    .filter((address): address is string => !!address);
}

export function pickPaymentAddress(
  data: Bip122AddressEntry[] | string[] | undefined
): string | undefined {
  if (!data?.length) {
    return undefined;
  }

  const first = data[0];
  if (typeof first === 'string') {
    return first;
  }

  const entries = data as Bip122AddressEntry[];
  return (
    entries.find((entry) => entry.intention === 'payment')?.address ??
    entries[0]?.address
  );
}

export function patchBip122SessionAccount(
  session: SessionTypes.Struct,
  address: string
): SessionTypes.Struct {
  const btcNamespace = session.namespaces[NAMESPACES.BITCOIN];
  if (!btcNamespace) {
    return session;
  }

  const caipAccount = new AccountId({
    chainId: {
      namespace: NAMESPACES.BITCOIN,
      reference: CAIP_BITCOIN_CHAIN_ID,
    },
    address,
  }).toString();

  const accounts = btcNamespace.accounts ?? [];
  const hasAccount = accounts.some(
    (account) =>
      new AccountId(account).address.toLowerCase() === address.toLowerCase()
  );

  if (hasAccount) {
    return session;
  }

  return {
    ...session,
    namespaces: {
      ...session.namespaces,
      [NAMESPACES.BITCOIN]: {
        ...btcNamespace,
        accounts: [...accounts, caipAccount],
      },
    },
  };
}

const BIP122_ACCOUNT_TIMEOUT = 15_000;

/**
 * Bitcoin wallets often approve bip122 without accounts in the session object.
 * They emit bip122_addressesChanged or session_update shortly after approval.
 */
export async function resolveBip122Session(
  client: SignClientInstance,
  session: SessionTypes.Struct
): Promise<SessionTypes.Struct> {
  const existing = filterBip122Accounts(session);
  if (existing.length) {
    return session;
  }

  const freshSession = client.session.get(session.topic) ?? session;
  const freshAccounts = filterBip122Accounts(freshSession);
  if (freshAccounts.length) {
    return freshSession;
  }

  const { address, session: resolvedSession } =
    await waitForBip122PaymentAddress(client, freshSession);

  const patched = patchBip122SessionAccount(resolvedSession, address);
  await persistSessionNamespaces(client, patched);
  return patched;
}

/**
 * The address the wallet reports via `bip122_addressesChanged` lands only on our
 * patched copy, so write it back to `client.session` - the record that restore,
 * teardown and staleness checks all read. Left unpersisted, the stored session
 * keeps `bip122.accounts === []`: `cleanupStaleSessionsForNamespace` reads a live
 * session as stale and disconnects it, and a reload waits again for an event the
 * wallet only emits right after approval.
 */
async function persistSessionNamespaces(
  client: SignClientInstance,
  session: SessionTypes.Struct
): Promise<void> {
  try {
    await client.session.update(session.topic, {
      namespaces: session.namespaces,
    });
  } catch (error) {
    debug(error instanceof Error ? error : new Error(String(error)));
  }
}

async function waitForBip122PaymentAddress(
  client: SignClientInstance,
  session: SessionTypes.Struct,
  timeoutMs = BIP122_ACCOUNT_TIMEOUT
): Promise<{ address: string; session: SessionTypes.Struct }> {
  return await new Promise((resolve, reject) => {
    const topic = session.topic;
    let settled = false;

    const finish = (address: string, updatedSession: SessionTypes.Struct) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      resolve({ address, session: updatedSession });
    };

    const fail = (error: Error) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      reject(error);
    };

    const timer = setTimeout(() => {
      fail(
        new Error(
          'Timed out waiting for Bitcoin account from wallet. Please try reconnecting.'
        )
      );
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timer);
      client.off('session_event', onEvent);
      client.off('session_update', onUpdate);
    };

    const onEvent = (args: SignClientTypes.EventArguments['session_event']) => {
      if (args.topic !== topic) {
        return;
      }
      if (args.params.event.name !== BitcoinEvents.ADDRESSES_CHANGED) {
        return;
      }

      const address = pickPaymentAddress(
        args.params.event.data as Bip122AddressEntry[]
      );
      if (address) {
        finish(address, client.session.get(topic) ?? session);
      }
    };

    const onUpdate = (
      args: SignClientTypes.EventArguments['session_update']
    ) => {
      if (args.topic !== topic) {
        return;
      }

      const updatedSession = client.session.get(topic) ?? session;
      const accounts = filterBip122Accounts(updatedSession);
      if (accounts.length) {
        finish(accounts[0].address, updatedSession);
      }
    };

    client.on('session_event', onEvent);
    client.on('session_update', onUpdate);
  });
}
