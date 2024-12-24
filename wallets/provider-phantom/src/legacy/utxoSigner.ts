import type { GenericSigner, Transfer } from 'rango-types';

import * as secp256k1 from '@bitcoinerlab/secp256k1';
import { Networks } from '@rango-dev/wallets-shared';
import * as bitcoin from 'bitcoinjs-lib';
import { SignerError } from 'rango-types';

type TransferExternalProvider = any;

const _BTC_RPC_URL = 'https://rpc.ankr.com/btc';

interface PSBTInput {
  hash: string;
  index: number;
  witnessUtxo: {
    // BigInteger
    value: string;
    script: string;
  } | null;
  nonWitnessUtxo: string | null;
}

interface PSBTOutput {
  // BigInteger
  value: string;
  address?: string;
  script?: string;
}

interface PSBT {
  // inputs is list of PSBTInput, which have witnessUtxo or nonWitnessUtxo
  inputs: PSBTInput[];
  // ouputs is either PSBTOutputToAddress or PSBTOutputToScript
  outputs: PSBTOutput[];
}
interface TransferNext extends Transfer {
  utxo: any; // TODO: I think this will be removed from server, if not, we can define the type.
  psbt: PSBT | null;
}

const fromHexString = (hexString: string) =>
  Uint8Array.from(
    hexString
      .match(/.{1,2}/g)
      ?.map((byte) => parseInt(byte, 16)) as Iterable<number>
  );

export class BTCSigner implements GenericSigner<Transfer> {
  private provider: TransferExternalProvider;
  constructor(provider: TransferExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: TransferNext): Promise<{ hash: string }> {
    const { fromWalletAddress, asset, psbt: apiObj } = tx;

    if (!apiObj) {
      throw new Error('TODO');
    }

    if (asset.blockchain !== Networks.BTC) {
      throw new Error(
        `Signing ${asset.blockchain} transaction is not implemented by the signer.`
      );
    }
    // Initialize ECC library
    bitcoin.initEccLib(secp256k1);

    const psbt = new bitcoin.Psbt({
      network: bitcoin.networks.bitcoin,
    });

    apiObj.inputs.forEach((input) => {
      const { hash, index, witnessUtxo, nonWitnessUtxo } = input;
      // TODO: use proper type
      const payload: any = {
        hash,
        index,
      };

      if (witnessUtxo) {
        payload.witnessUtxo = {
          script: Buffer.from(witnessUtxo.script, 'hex'),
          value: Number(witnessUtxo.value),
        };
      }

      if (nonWitnessUtxo) {
        payload.nonWitnessUtxo = Buffer.from(nonWitnessUtxo, 'hex');
      }

      psbt.addInput(payload);
    });

    apiObj.outputs.forEach((output) => {
      if (output.script) {
        psbt.addOutput({
          value: Number(output.value),
          script: Buffer.from(output.script, 'hex'),
        });
      } else if (output.address) {
        psbt.addOutput({
          address: output.address,
          value: Number(output.value),
        });
      } else {
        throw new Error('Invalid output in your UTXO.');
      }
    });

    const hex = psbt.toHex();

    const signedPSBTBytes = await this.provider.signPSBT(fromHexString(hex), {
      inputsToSign: [
        {
          address: fromWalletAddress,
          // TODO: Should we sign all the inputs?
          signingIndexes: apiObj.inputs.map((_, i) => i),
        },
      ],
    });

    // Finalize PSBT
    const finalPsbt = bitcoin.Psbt.fromBuffer(Buffer.from(signedPSBTBytes));
    finalPsbt.finalizeAllInputs();

    const finalPsbtBaseHex = finalPsbt.toHex();

    console.log('finalPsbtBaseHex', {
      hex: finalPsbt.toHex(),
      base64: finalPsbt.toBase64(),
    });

    return { hash: finalPsbtBaseHex };
    /*
     * // Broadcast PSBT to rpc node
     *const hash = await axios.post<
     *  { id: string; method: string; params: string[] },
     *  string
     *>(BTC_RPC_URL, {
     *  id: '1',
     *  method: 'sendrawtransaction',
     *  params: [finalPsbtBaseHex],
     *});
     *
     *console.log('hash', hash);
     *
     *return { hash };
     *
     */
  }
}
