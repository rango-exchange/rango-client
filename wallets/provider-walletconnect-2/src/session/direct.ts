import type { DirectConnectionUi, WalletConnectNamespace } from '../types.js';
import type { ISignClient, SessionTypes } from '@walletconnect/types';
import type { ChainIdParams } from 'caip';

import { Hub3Error } from '@hub3js/core';
import { debug } from '@rango-dev/logging-core';
import { getSdkError } from '@walletconnect/utils';

import { generateOptionalNamespace } from './proposals.js';

/** A host-owned QR view, using the same proposal and client as the hub adapter. */
export async function connectDirectSession(
  client: ISignClient,
  options: {
    chains: ChainIdParams[];
    namespace: WalletConnectNamespace;
    chainReference?: string;
    display: DirectConnectionUi;
    signal?: AbortSignal;
  }
): Promise<SessionTypes.Struct> {
  const { signal } = options;
  const cancelled = () =>
    new Hub3Error(
      'PROVIDER_USER_REJECTED_REQUEST',
      'Wallet connection cancelled.'
    );
  if (signal?.aborted) {
    throw cancelled();
  }
  let stopped = false;
  let approvedSession: SessionTypes.Struct | undefined;
  let view: ReturnType<DirectConnectionUi> | undefined;
  let topic: string | undefined;
  const reason = getSdkError('USER_DISCONNECTED');
  const disconnect = async (target: string) => {
    // Never log the URI or arbitrary error text containing the pairing secret.
    await client.disconnect({ topic: target, reason }).catch(() => {
      debug(new Error('Unable to remove cancelled WalletConnect attempt.'));
    });
  };
  let rejectCancellation: (error: Error) => void = () => undefined;
  const cancellation = new Promise<never>((_, reject) => {
    rejectCancellation = reject;
  });
  const onAbort = () => {
    stopped = true;
    rejectCancellation(cancelled());
  };
  signal?.addEventListener('abort', onAbort, { once: true });

  /*
   * Keep ownership of the pending operation even if the user closes before
   * client.connect returns. Its late URI/session must never be shown or adopted.
   */
  const connection = (async () => {
    const { uri, approval } = await client.connect({
      optionalNamespaces:
        generateOptionalNamespace(
          options.chains,
          [options.namespace],
          options.chainReference
        ) ?? {},
    });
    topic = uri?.match(/^wc:([^@]+)@2\?/u)?.[1];
    const approved = approval().then(async (session) => {
      approvedSession = session;
      if (stopped) {
        await disconnect(session.topic);
        throw cancelled();
      }
      return session;
    });
    // Attach rejection handling before any UI callback can throw.
    void approved.catch(() => undefined);
    if (stopped || signal?.aborted) {
      if (topic) {
        await disconnect(topic);
      }
      throw cancelled();
    }
    if (!uri || !topic) {
      throw new Error('No WalletConnect pairing URI was returned.');
    }
    view = options.display(uri);
    return Promise.race([
      approved,
      view.closed.then(() => {
        stopped = true;
        throw cancelled();
      }),
    ]);
  })();
  try {
    const session = await Promise.race([connection, cancellation]);
    if (stopped || signal?.aborted) {
      await disconnect(session.topic);
      throw cancelled();
    }
    return session;
  } catch (error) {
    stopped = true;
    if (approvedSession) {
      await disconnect(approvedSession.topic);
    }
    if (topic) {
      await disconnect(topic);
    }
    throw error;
  } finally {
    signal?.removeEventListener('abort', onAbort);
    view?.close();
  }
}
