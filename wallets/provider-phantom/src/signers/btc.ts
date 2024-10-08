import type { GenericSigner, Transfer } from 'rango-types';

import { Networks } from '@rango-dev/wallets-shared';
import * as Bitcoin from 'bitcoinjs-lib';
import { SignerError } from 'rango-types';

type TransferExternalProvider = any;

const MAX_MEMO_LENGTH = 80;

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

export class BTCSigner implements GenericSigner<Transfer> {
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
      psbt,
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

    // Initialize a new Bitcoin PSBT object.
    const generatedPsbt = new Bitcoin.Psbt({
      network: Bitcoin.networks.bitcoin,
    }); // Network-specific

    // Add inputs to the PSBT from the accumulated inputs.
    psbt?.inputs.forEach((input: any) => {
      const formattedInput: any = {};
      formattedInput.hash = input.hash;
      formattedInput.index = input.index;

      if (input.witnessUtxo) {
        formattedInput.witnessUtxo = {
          value: parseInt(input.witnessUtxo.value),
          script: Buffer.from(input.witnessUtxo.script, 'hex'),
        };
      }
      generatedPsbt.addInput(formattedInput);
    });

    // Add outputs to the PSBT from the accumulated outputs.
    psbt?.outputs.forEach((output: any) => {
      output.value = parseInt(output.value);
      if (output.script) {
        output.script = Buffer.from(output.script, 'hex');
      }
      if (!output.address) {
        //an empty address means this is the source address
        output.address = fromWalletAddress;
      }
      generatedPsbt.addOutput(output);
    });

    console.log({ generatedPsbt });

    // Sign psbt using provider
    const serializedPsbt = generatedPsbt.toHex();
    const signedPSBTBytes = await this.provider.signPSBT(
      fromHexString(serializedPsbt),
      {
        inputsToSign: [
          {
            address: tx.fromWalletAddress,
            signingIndexes: Array.from(
              { length: generatedPsbt.inputCount },
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
