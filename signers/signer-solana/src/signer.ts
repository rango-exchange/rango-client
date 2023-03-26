import {
  ISigner,
  SignerError,
  SignerErrorCode,
  SolanaTransaction,
} from 'rango-types';
import { executeSolanaTransaction } from './helpers';

export interface ISolanaSigner extends ISigner<SolanaTransaction> {}

// TODO - replace with real type
// tslint:disable-next-line: no-any
type SolanaExternalSigner = any;

export class SolanaSigner implements ISolanaSigner {
  private signer: SolanaExternalSigner;

  constructor(signer: SolanaExternalSigner) {
    this.signer = signer;
  }

  async signMessage(msg: string): Promise<string> {
    try {
      const encodedMessage = new TextEncoder().encode(msg);
      const { signature } = await this.signer.request({
        method: 'signMessage',
        params: {
          message: encodedMessage,
        },
      });
      return signature;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<string> {
    try {
      return await executeSolanaTransaction(tx, this.signer);
    } catch (error) {
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }
  }
}
