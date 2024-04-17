import type { GenericSigner, Transfer } from 'rango-types';

import { Networks } from '@rango-dev/wallets-shared';
import * as Bitcoin from 'bitcoinjs-lib';
import accumulative from 'coinselect/accumulative';
import { SignerError } from 'rango-types';

type TransferExternalProvider = any;

const MAX_MEMO_LENGTH = 80;
const FEE_RATE = 55;

const fromHexString = (hexString: string) =>
  Uint8Array.from(
    hexString
      .match(/.{1,2}/g)
      ?.map((byte) => parseInt(byte, 16)) as Iterable<number>
  );

const compileMemo = (memo: string): Buffer => {
  const data = Buffer.from(memo, 'utf8'); // converts MEMO to buffer
  return Bitcoin.script.compile([Bitcoin.opcodes.OP_RETURN, data]); // Compile OP_RETURN script
};

const isUtxoSegwit = (scriptPubKey: string) => {
  return scriptPubKey?.startsWith('0014');
};

export class PhantomTransferSigner implements GenericSigner<Transfer> {
  private provider: TransferExternalProvider;
  constructor(provider: TransferExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    const {
      memo,
      recipientAddress,
      amount,
      fromWalletAddress,
      asset,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      utxo: utxos,
    } = tx;

    if (asset.blockchain !== Networks.BTC) {
      throw new Error(
        `Signing ${asset.blockchain} transaction is not implemented by the signer.`
      );
    }

    // Check memo length
    if (memo && memo.length > MAX_MEMO_LENGTH) {
      throw new Error('memo too long, must not be longer than 80 chars.');
    }
    const compiledMemo = memo ? compileMemo(memo) : null;

    // Initialize an array to store the target outputs of the transaction.
    const targetOutputs = [];
    // 1. Add the recipient address and amount to the target outputs.
    targetOutputs.push({
      address: recipientAddress,
      value: parseInt(amount),
    });
    // 2. Add the compiled memo to the target outputs if it exists.
    if (compiledMemo) {
      targetOutputs.push({ script: compiledMemo, value: 0 });
    }

    // Use the coinselect library to determine the inputs and outputs for the transaction.
    const formattedUtxos = utxos.map((utxo: any) => {
      const fromattedUtxo: any = {
        txId: utxo.txId,
        vout: utxo.vout,
        value: parseInt(utxo.value),
      };

      if (isUtxoSegwit(utxo.script)) {
        // for segwit inputs, you only need the output script and value as an object.
        fromattedUtxo.witnessUtxo = {
          script: Buffer.from(utxo.script, 'hex'),
          value: parseInt(utxo.value),
        };
      } else {
        // for non segwit inputs, we must pass the full transaction buffer
        fromattedUtxo.nonWitnessUtxo = Buffer.from(utxo.txId, 'hex');
      }

      return fromattedUtxo;
    });

    const { inputs, outputs } = accumulative(
      formattedUtxos,
      targetOutputs,
      FEE_RATE
    );

    // If no suitable inputs or outputs are found, throw an error indicating insufficient balance.
    if (!inputs || !outputs) {
      throw new Error('Insufficient Balance for transaction');
    }

    // Initialize a new Bitcoin PSBT object.
    const psbt = new Bitcoin.Psbt({ network: Bitcoin.networks.bitcoin }); // Network-specific

    // Add inputs to the PSBT from the accumulated inputs.
    inputs.forEach((utxo: any) => {
      const input: any = {
        hash: utxo.txId,
        index: utxo.vout,
      };

      if (utxo.witnessUtxo) {
        input.witnessUtxo = utxo.witnessUtxo;
      } else {
        input.nonWitnessUtxo = utxo.nonWitnessUtxo;
      }

      psbt.addInput(input);
    });

    // Add outputs to the PSBT from the accumulated outputs.
    outputs.forEach((output: Bitcoin.PsbtTxOutput) => {
      // If the output address is not specified, it's considered a change address and set to the sender's address.
      if (!output.address) {
        //an empty address means this is the  change ddress
        output.address = fromWalletAddress;
      }
      // Add the output to the PSBT.
      if (!output.script) {
        psbt.addOutput(output);
      } else {
        // If the output is a memo, add it to the PSBT to avoid dust error.
        /*
         * if (compiledMemo) {
         *   psbt.addOutput({ script: compiledMemo, value: 0 });
         * }
         */
      }
    });

    // Sign psbt using provider
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
    const finalPsbt = Bitcoin.Psbt.fromBuffer(Buffer.from(signedPSBTBytes));
    finalPsbt.finalizeAllInputs();

    console.log('finalPsbt', finalPsbt.toBase64());

    return { hash: '' };
  }
}
