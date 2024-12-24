import type { GenericSigner, Transfer } from 'rango-types';

import { Networks } from '@rango-dev/wallets-shared';
import axios from 'axios';
import * as Bitcoin from 'bitcoinjs-lib';
import { SignerError } from 'rango-types';

type TransferExternalProvider = any;

const BTC_RPC_URL = 'https://rpc.ankr.com/btc';

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

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    const {
      fromWalletAddress,
      asset,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      psbt, // psbt in hex string format
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      signingIndexes, // index of inputs to sign in an array of number
    } = tx;

    if (asset.blockchain !== Networks.BTC) {
      throw new Error(
        `Signing ${asset.blockchain} transaction is not implemented by the signer.`
      );
    }

    const signedPSBTBytes = await this.provider.signPSBT(fromHexString(psbt), {
      inputsToSign: [
        {
          address: fromWalletAddress,
          signingIndexes: signingIndexes,
        },
      ],
    });

    // Finalize PSBT
    const finalPsbt = Bitcoin.Psbt.fromBuffer(Buffer.from(signedPSBTBytes));
    finalPsbt.finalizeAllInputs();
    console.log('finalPsbt', finalPsbt);

    const finalPsbtBaseHex = finalPsbt.toHex();

    console.log('finalPsbtBaseHex', finalPsbtBaseHex);

    // Broadcast PSBT to rpc node
    const hash = await axios.post<
      { id: string; method: string; params: string[] },
      string
    >(BTC_RPC_URL, {
      id: '1',
      method: 'sendrawtransaction',
      params: [finalPsbtBaseHex],
    });

    console.log('hash', hash);

    return { hash };
  }
}
