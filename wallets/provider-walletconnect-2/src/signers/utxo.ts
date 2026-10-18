import type { ISignClient, SessionTypes } from '@walletconnect/types';
import type { GenericSigner, Transfer } from 'rango-types';

import * as secp256k1 from '@bitcoinerlab/secp256k1';
import { Networks } from '@rango-dev/internal-blockchains';
import { CAIP_BITCOIN_CHAIN_ID } from '@rango-dev/wallets-core/namespaces/utxo';
import * as bitcoin from 'bitcoinjs-lib';
import { AccountId, ChainId } from 'caip';
import { SignerError, SignerErrorCode } from 'rango-types';

import { BitcoinRPCMethods, NAMESPACES } from '../wcConstants.js';

const BTC_RPC_URL = 'https://go.getblock.io/f37bad28a991436483c0a3679a3acbee';

type SignPsbtResponse = {
  psbt: string;
  txid?: string;
};

type SessionGetter = () => SessionTypes.Struct | null;

class UtxoSigner implements GenericSigner<Transfer> {
  private client: ISignClient;
  private getSession: SessionGetter;

  constructor(client: ISignClient, getSession: SessionGetter) {
    this.client = client;
    this.getSession = getSession;
  }

  private get session(): SessionTypes.Struct {
    const session = this.getSession();
    if (!session) {
      throw new Error('UTXO WalletConnect session is not available.');
    }
    return session;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(
    tx: Transfer,
    address: string,
    _chainId: string | null
  ): Promise<{ hash: string }> {
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

    this.assertAccountInSession(address);

    const signInputs = psbt.inputsToSign.flatMap(
      ({ address: inputAddress, signingIndexes }) =>
        signingIndexes.map((index) => ({ address: inputAddress, index }))
    );

    const caipChainId = new ChainId({
      namespace: NAMESPACES.BITCOIN,
      reference: CAIP_BITCOIN_CHAIN_ID,
    }).toString();

    try {
      const response: SignPsbtResponse = await this.client.request({
        topic: this.session.topic,
        chainId: caipChainId,
        request: {
          method: BitcoinRPCMethods.SIGN_PSBT,
          params: {
            account: address,
            psbt: psbt.unsignedPsbtBase64,
            signInputs,
            broadcast: true,
          },
        },
      });

      if (response.txid) {
        // signer wallet already broadcasted the transaction
        return { hash: response.txid };
      }

      return await this.broadcastSignedPsbt(response.psbt);
    } catch (error) {
      if (typeof error === 'string') {
        throw new SignerError(
          SignerErrorCode.UNEXPECTED_BEHAVIOUR,
          error,
          undefined
        );
      }
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }
  }

  private assertAccountInSession(address: string) {
    const caipAddress = new AccountId({
      chainId: {
        namespace: NAMESPACES.BITCOIN,
        reference: CAIP_BITCOIN_CHAIN_ID,
      },
      address,
    }).toString();

    const accounts = this.session.namespaces[NAMESPACES.BITCOIN]?.accounts;
    if (!accounts?.includes(caipAddress)) {
      throw new Error(
        'Your requested address does not exist in your WalletConnect session. Please reconnect your wallet.'
      );
    }
  }

  private async broadcastSignedPsbt(signedPsbtBase64: string) {
    bitcoin.initEccLib(secp256k1);

    const finalPsbt = bitcoin.Psbt.fromBase64(signedPsbtBase64);

    if (finalPsbt.data.inputs.some((input) => !input.finalScriptWitness)) {
      finalPsbt.finalizeAllInputs();
    }

    const finalPsbtBaseHex = finalPsbt.extractTransaction().toHex();

    const response = await fetch(BTC_RPC_URL, {
      method: 'POST',
      body: JSON.stringify({
        method: 'sendrawtransaction',
        params: [finalPsbtBaseHex],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error broadcasting transaction: ${errorText}`);
    }

    const data = await response.json();

    if (!data.result) {
      throw new Error(
        `Error broadcasting transaction. Error Code ${data.error.code}: ${data.error.message}`
      );
    }

    return { hash: data.result };
  }
}

export default UtxoSigner;
