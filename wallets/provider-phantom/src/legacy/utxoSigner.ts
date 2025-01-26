import type { GenericSigner, Transfer } from 'rango-types';

import * as secp256k1 from '@bitcoinerlab/secp256k1';
import { Networks } from '@rango-dev/wallets-shared';
import axios from 'axios';
import * as bitcoin from 'bitcoinjs-lib';
import { SignerError } from 'rango-types';

type TransferExternalProvider = any;

const BTC_RPC_URL = 'https://go.getblock.io/f37bad28a991436483c0a3679a3acbee';

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
  psbtInputs: PSBTInput[];
  // ouputs is either PSBTOutputToAddress or PSBTOutputToScript
  psbtOutputs: PSBTOutput[];
  // psbt in hex
  psbt: string;
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

    const signedPSBTBytes = await this.provider.signPSBT(
      fromHexString(apiObj.psbt),
      {
        inputsToSign: [
          {
            address: fromWalletAddress,
            // TODO: Should we sign all the inputs?
            signingIndexes: apiObj.psbtInputs.map((_, i) => i),
          },
        ],
      }
    );

    // Finalize PSBT
    const finalPsbt = bitcoin.Psbt.fromBuffer(Buffer.from(signedPSBTBytes));
    finalPsbt.finalizeAllInputs();

    const finalPsbtBaseHex = finalPsbt.extractTransaction().toHex();

    // Broadcast PSBT to rpc node
    const response = await axios.post(BTC_RPC_URL, {
      id: 'test',
      method: 'sendrawtransaction',
      params: [finalPsbtBaseHex],
    });

    if (!response.data.result) {
      throw new Error(response.data.error?.message);
    }

    return { hash: response.data.result };
  }
}
