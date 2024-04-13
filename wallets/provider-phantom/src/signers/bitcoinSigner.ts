import type { GenericSigner, Transfer } from 'rango-types';

import * as bitcoin from 'bitcoinjs-lib';
import { SignerError } from 'rango-types';

type TransferExternalProvider = any;

const fromHexString = (hexString: string) =>
  Uint8Array.from(
    hexString
      .match(/.{1,2}/g)
      ?.map((byte) => parseInt(byte, 16)) as Iterable<number>
  );

export class PhantomTransferSigner implements GenericSigner<Transfer> {
  private provider: TransferExternalProvider;
  constructor(provider: TransferExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    const psbt = new bitcoin.Psbt({ network: bitcoin.networks.bitcoin });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { utxo, recipientAddress, amount, fromWalletAddress } = tx;

    let utxoAmount = 0;

    for (let i = 0; i < utxo.length; i++) {
      const item = utxo[i];
      psbt.addInput({
        hash: item.txId,
        index: item.vout,
        witnessUtxo: {
          script: Buffer.from(item.script, 'hex'),
          value: parseInt(item.value),
        },
      });
      utxoAmount += parseInt(item.value);
      if (utxoAmount > parseInt(amount)) {
        break;
      }
    }

    psbt.addOutput({
      address: recipientAddress,
      value: parseInt(amount),
    });
    if (utxoAmount - parseInt(amount) > 0) {
      psbt.addOutput({
        address: fromWalletAddress,
        value: utxoAmount - parseInt(amount),
      });
    }
    const serializedPsbt = psbt.toHex();

    const signedPSBTBytes = await this.provider.signPSBT(
      fromHexString(serializedPsbt),
      {
        inputsToSign: [
          {
            address: tx.fromWalletAddress,
            signingIndexes: Array.from(
              { length: psbt.inputCount },
              (_, index) => index
            ),
            sigHash: 0,
          },
        ],
      }
    );

    const finalPsbt = bitcoin.Psbt.fromBuffer(Buffer.from(signedPSBTBytes));
    finalPsbt.finalizeAllInputs();
    console.log('finalPsbt', finalPsbt.toBase64());

    return { hash: '' };
  }
}
