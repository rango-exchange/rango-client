import type { SolanaWeb3Signer } from '@rango-dev/signer-solana';
import type { Transaction, VersionedTransaction } from '@solana/web3.js';
import type { SignClient } from '@walletconnect/sign-client/dist/types/client';
import type { SessionTypes } from '@walletconnect/types';
import type { GenericSigner, SolanaTransaction } from 'rango-types';

import { generalSolanaTransactionExecutor } from '@rango-dev/signer-solana';
import { PublicKey } from '@solana/web3.js';
import base58 from 'bs58';
import { AccountId, ChainId } from 'caip';
import { SignerError, SignerErrorCode } from 'rango-types';

import { NAMESPACES, SolanaRPCMethods } from '../constants';

const NAMESPACE_NAME = NAMESPACES.SOLANA;
class SOLANASigner implements GenericSigner<SolanaTransaction> {
  private client: SignClient;
  private session: SessionTypes.Struct;

  constructor(client: SignClient, session: SessionTypes.Struct) {
    this.client = client;
    this.session = session;
  }

  public async signMessage(
    msg: string,
    address: string,
    chainId: string | null
  ): Promise<string> {
    const requestedFor = this.isNetworkAndAccountExistInSession({
      address,
      chainId,
    });

    const caipChainId = new ChainId({
      namespace: NAMESPACE_NAME,
      reference: requestedFor.chainId,
    });

    try {
      const message = base58.encode(new TextEncoder().encode(msg));
      const pubkey = new PublicKey(address);
      const { signature } = await this.client.request<{
        signature: string;
      }>({
        topic: this.session.topic,
        chainId: caipChainId.toString(),
        request: {
          method: SolanaRPCMethods.SIGN_MESSAGE,
          params: {
            message,
            pubkey,
          },
        },
      });

      return signature;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(
    tx: SolanaTransaction,
    address: string,
    chainId: string | null
  ): Promise<{ hash: string }> {
    const requestedFor = this.isNetworkAndAccountExistInSession({
      address,
      chainId,
    });
    const DefaultSolanaSigner: SolanaWeb3Signer = async (
      solanaWeb3Transaction: Transaction | VersionedTransaction
    ) => {
      const response: { signature: string } = await this.client.request({
        topic: this.session.topic,
        chainId: requestedFor.caipChainId,
        request: {
          method: SolanaRPCMethods.SIGN_TRANSACTION,
          params: solanaWeb3Transaction,
        },
      });

      const publicKey = new PublicKey(tx.from);
      const sign = base58.decode(response.signature);

      solanaWeb3Transaction.addSignature(publicKey, Buffer.from(sign));
      const raw = solanaWeb3Transaction.serialize();
      return raw;
    };

    const hash = await generalSolanaTransactionExecutor(
      tx,
      DefaultSolanaSigner
    );
    return { hash };
  }

  private isNetworkAndAccountExistInSession(requestedFor: {
    address: string;
    chainId: string | null;
  }) {
    const { address, chainId } = requestedFor;

    /*
     *  TODO: solana chain id in supported blockchains("mainnet-beta") is different from solana chain id is here ("5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp")
     * # Solana Mainnet
     *  solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvd
     *  refrence: https://github.com/ChainAgnostic/namespaces/blob/main/solana/caip2.md
     */

    let solana_chain_id = chainId;
    this.session.namespaces[NAMESPACE_NAME]?.accounts.map((account) => {
      const sol_account = account.split(':');
      if (sol_account[2] === address) {
        solana_chain_id = sol_account[1];
      }
    });

    if (!solana_chain_id) {
      throw new Error(
        'You need to set your chain for signing message/transaction.'
      );
    }
    const caipAddress = new AccountId({
      chainId: {
        namespace: NAMESPACE_NAME,
        reference: solana_chain_id,
      },
      address,
    });

    const addresses = this.session.namespaces[NAMESPACE_NAME]?.accounts.map(
      (address) => address
    );
    if (!addresses || !addresses.includes(caipAddress.toString())) {
      console.warn(
        'Available adresses and requested address:',
        addresses,
        caipAddress.toString()
      );
      throw new Error(
        `Your requested address doesn't exist on your wallect connect session. Please reconnect your wallet.`
      );
    }

    const caipChainId = new ChainId({
      namespace: NAMESPACE_NAME,
      reference: solana_chain_id,
    });

    return {
      chainId: solana_chain_id,
      address,
      caipChainId: caipChainId.toString(),
    };
  }
}

export default SOLANASigner;
