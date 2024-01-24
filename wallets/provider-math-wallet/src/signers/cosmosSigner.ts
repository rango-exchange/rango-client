import type { StdFee } from '@cosmjs/stargate';
import type { CosmosTransaction, GenericSigner } from 'rango-types';

import { SigningStargateClient } from '@cosmjs/stargate';
import { DEFAULT_COSMOS_RPC_URL } from '@rango-dev/wallets-shared';
import { SignerError, SignerErrorCode } from 'rango-types';

const COSMOS_MESSAGE_TRANSFER_TYPE_URL =
  '/ibc.applications.transfer.v1.MsgTransfer';

export class MathWalletCosmosSigner
  implements GenericSigner<CosmosTransaction>
{
  private provider: any;

  constructor(provider: any) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: CosmosTransaction): Promise<{ hash: string }> {
    if (!this.provider) {
      throw SignerError.AssertionFailed('wallet is null!');
    }
    try {
      const {
        memo,
        sequence,
        account_number,
        chainId,
        msgs,
        fee,
        signType,
        rpcUrl,
      } = tx.data;

      if (!chainId) {
        throw SignerError.AssertionFailed('chainId is undefined from server');
      }
      if (!account_number) {
        throw SignerError.AssertionFailed(
          'account_number is undefined from server'
        );
      }
      if (!sequence) {
        throw SignerError.AssertionFailed('sequence is undefined from server');
      }

      if (signType === 'AMINO') {
        const signingStargateClient =
          await SigningStargateClient.connectWithSigner(
            rpcUrl || DEFAULT_COSMOS_RPC_URL,
            this.provider
          );

        const processedMsgs = msgs.map((msg: any) => ({
          typeUrl: COSMOS_MESSAGE_TRANSFER_TYPE_URL,
          value: {
            sourcePort: msg.value?.source_port,
            sourceChannel: msg.value?.source_channel,
            sender: msg.value?.sender,
            receiver: msg.value?.receiver,
            token: msg.value?.token,
            timeoutHeight: msg.value?.timeout_height,
            timeoutTimestamp: msg.value?.timeout_timestamp,
          },
        }));

        const signAndBroadcastResult =
          await signingStargateClient.signAndBroadcast(
            tx.fromWalletAddress,
            processedMsgs,
            fee as StdFee,
            memo as string
          );

        return { hash: signAndBroadcastResult.transactionHash };
      } else if (signType === 'DIRECT') {
        throw SignerError.UnimplementedError('signMessage');
      }
      throw new SignerError(
        SignerErrorCode.OPERATION_UNSUPPORTED,
        `Sign type for cosmos not supported, type: ${signType}`
      );
    } catch (err) {
      if (SignerError.isSignerError(err)) {
        throw err;
      } else {
        throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, err);
      }
    }
  }
}
