import type { Context, FunctionWithContext } from '@hub3js/core';
import type { SolanaActions } from '@hub3js/solana';

import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { SignerError, SignerErrorCode } from 'rango-types';

import { getDerivationPath } from '../state.js';
import {
  getLedgerError,
  transportConnect,
  transportDisconnect,
} from '../utils.js';

async function ledgerSolanaApp() {
  const transport = await transportConnect();
  const LedgerAppSolana = (await import('@ledgerhq/hw-app-solana')).default;
  return new LedgerAppSolana(transport);
}

/*
 * The device signs the transaction's message, and the signature is added to
 * the transaction it came in. A legacy message is handed over as a legacy
 * transaction, so its bytes stay what the caller built.
 */
async function signOnDevice(bytes: Uint8Array): Promise<Uint8Array> {
  const solana = await ledgerSolanaApp();
  const derivationPath = getDerivationPath();
  const { address } = await solana.getAddress(derivationPath);
  const publicKey = new PublicKey(address);

  const versioned = VersionedTransaction.deserialize(bytes);
  if (versioned.version !== 'legacy') {
    const { signature } = await solana.signTransaction(
      derivationPath,
      Buffer.from(versioned.message.serialize())
    );
    versioned.addSignature(publicKey, signature);
    return versioned.serialize();
  }

  const legacy = Transaction.from(bytes);
  const { signature } = await solana.signTransaction(
    derivationPath,
    legacy.serializeMessage()
  );
  legacy.addSignature(publicKey, signature);
  return new Uint8Array(
    legacy.serialize({ requireAllSignatures: false, verifySignatures: false })
  );
}

/**
 * Ledger has no injected provider, so it signs on the device. It only signs
 * with the account it derives itself, so an input's `account` is not used.
 */
export const signTransaction: FunctionWithContext<
  SolanaActions['signTransaction'],
  Context<SolanaActions>
> = async (_context, ...inputs) => {
  try {
    const outputs = [];
    for (const { transaction } of inputs) {
      outputs.push({ signedTransaction: await signOnDevice(transaction) });
    }
    return outputs;
  } catch (error) {
    throw getLedgerError(error);
  } finally {
    await transportDisconnect();
  }
};

export const signMessage: FunctionWithContext<
  SolanaActions['signMessage'],
  Context<SolanaActions>
> = async (_context, ...inputs) => {
  try {
    const solana = await ledgerSolanaApp();
    const outputs = [];
    for (const { message } of inputs) {
      const { signature } = await solana.signOffchainMessage(
        getDerivationPath(),
        Buffer.from(message)
      );
      outputs.push({ signedMessage: message, signature });
    }
    return outputs;
  } catch (error) {
    throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
  } finally {
    await transportDisconnect();
  }
};
