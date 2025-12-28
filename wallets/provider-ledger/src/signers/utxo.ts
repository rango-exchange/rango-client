import type { CreateTransactionArg } from '@ledgerhq/hw-app-btc/lib-es/createTransaction';
import type { Transaction, VersionedTransaction } from '@solana/web3.js';
import type { GenericSigner, SolanaTransaction, Transfer } from 'rango-types';

import { generalSolanaTransactionExecutor } from '@rango-dev/signer-solana';
import {
  dynamicImportWithRefinedError,
  Networks,
} from '@rango-dev/wallets-shared';
import { PublicKey } from '@solana/web3.js';
import { SignerError, SignerErrorCode } from 'rango-types';

import { getDerivationPath } from '../state.js';
import {
  getLedgerError,
  transportConnect,
  transportDisconnect,
} from '../utils.js';

type TransferExternalProvider = any;

export class BtcSigner implements GenericSigner<Transfer> {
  async signMessage(msg: string): Promise<string> {
    try {
      const transport = await transportConnect();

      if (!transport) {
        throw new Error('whatever btc');
      }

      const LedgerAppBitcoin = (
        await dynamicImportWithRefinedError(
          async () => await import('@ledgerhq/hw-app-btc')
        )
      ).default;
      const bitcoin = new LedgerAppBitcoin({ transport, currency: 'bitcoin' });

      const result = await bitcoin
        .signMessage(getDerivationPath(), Buffer.from(msg).toString('hex'))
        .then(function (result) {
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          const v = result['v'] + 27 + 4;
          const signature = Buffer.from(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            v.toString(16) + result['r'] + result['s'],
            'hex'
          ).toString('base64');
          return signature;
        });
      return result;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    const { asset, psbt } = tx;

    if (!psbt) {
      throw new Error(
        'No PSBT found to sign. Ensure a valid PSBT is provided.'
      );
    }

    if (asset.blockchain !== Networks.BTC) {
      throw new Error(
        `Signing ${asset.blockchain} transaction is not implemented by the signer.`
      );
    }

    try {
      const transport = await transportConnect();

      if (!transport) {
        throw new Error('whatever sol');
      }
      const LedgerAppBitcoin = (
        await dynamicImportWithRefinedError(
          async () => await import('@ledgerhq/hw-app-btc')
        )
      ).default;
      const bitcoin = new LedgerAppBitcoin({
        transport,
        currency: 'bitcoin',
      });

      const tx: CreateTransactionArg = {
        inputs: [],
        segwit: true,
      };

      const signResult = await bitcoin.createPaymentTransaction(tx);

      const hash = signResult;
      return { hash };
    } catch (error) {
      throw getLedgerError(error);
    } finally {
      await transportDisconnect();
    }
  }
}
