import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import { SessionTypes } from '@walletconnect/types';
import { AccountId, ChainId } from 'caip';
import type { GenericSigner, SolanaTransaction } from 'rango-types';
import {
  SignerError,
  SignerErrorCode,
  SignerError as SignerErrorType,
} from 'rango-types';
import { NAMESPACES, SolanaRPCMethods } from '../constants';
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  VersionedTransaction,
  Connection,
} from '@solana/web3.js';
import base58 from 'bs58';
import { getProviderUrl } from '../helpers';
const NAMESPACE_NAME = NAMESPACES.SOLANA;
function getFailedHash(tx: SolanaTransaction) {
  const random = Math.floor(Math.random() * 9000) + 1000;
  return 'failed::' + tx.identifier + '::' + random;
}
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
      console.log({ signature });

      return signature;
    } catch (error) {
      console.log({ error });

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
    const connection = new Connection(getProviderUrl(requestedFor.chainId));
    const { blockhash } = await connection.getLatestBlockhash();
    console.log({ blockhash });

    const transaction = new Transaction({
      feePayer: new PublicKey(tx.from),
      recentBlockhash: blockhash,
    });
    let versionedTransaction: VersionedTransaction | undefined = undefined;

    if (!!tx.serializedMessage) {
      if (tx.txType === 'VERSIONED') {
        versionedTransaction = VersionedTransaction.deserialize(
          new Uint8Array(tx.serializedMessage)
        );
        console.log({ versionedTransaction });
      } else if (tx.txType === 'LEGACY') {
        transaction.add(
          Transaction.from(Buffer.from(new Uint8Array(tx.serializedMessage)))
        );
      }
    } else {
      tx.instructions.forEach((instruction) => {
        transaction?.add(
          new TransactionInstruction({
            keys: instruction.keys.map((accountMeta) => ({
              pubkey: new PublicKey(accountMeta.pubkey),
              isSigner: accountMeta.isSigner,
              isWritable: accountMeta.isWritable,
            })),
            programId: new PublicKey(instruction.programId),
            data: Buffer.from(instruction.data),
          })
        );
      });
      tx.signatures.forEach(function (signatureItem) {
        const signature = Buffer.from(new Uint8Array(signatureItem.signature));
        const publicKey = new PublicKey(signatureItem.publicKey);
        transaction?.addSignature(publicKey, signature);
      });
    }

    try {
      const { signature }: { signature: string } = await this.client.request({
        topic: this.session.topic,
        chainId: requestedFor.caipChainId,
        request: {
          method: SolanaRPCMethods.SIGN_TRANSACTION,
          params: {},
        },
      });
      console.log({ signature, tx });

      const publicKey = new PublicKey(tx.from);
      transaction.addSignature(
        publicKey,
        Buffer.from(base58.decode(signature))
      );
      const valid = transaction.verifySignatures();
      console.log({ valid });

      if (!valid)
        throw new Error('tx cant send to blockchain. signature=' + signature);

      return { hash: signature };
    } catch (e) {
      if (
        e &&
        SignerError.isSignerError(e) &&
        (e as SignerErrorType).code === SignerErrorCode.REJECTED_BY_USER
      )
        throw e;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-prototype-builtins
      if (e && (e as any).hasOwnProperty('code') && (e as any).code === 4001)
        throw new SignerError(SignerErrorCode.REJECTED_BY_USER, undefined, e);

      return { hash: getFailedHash(tx) };
    }
  }

  private isNetworkAndAccountExistInSession(requestedFor: {
    address: string;
    chainId: string | null;
  }) {
    const { address, chainId } = requestedFor;

    // TODO: solana chain id in supported blockchains("mainnet-beta") is different from solana chain id is here ("4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ")
    // Solana Mainnet
    // solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ
    // refrence: https://github.com/ChainAgnostic/namespaces/blob/main/solana/caip2.md

    let solana_chain_id = chainId;
    this.session.namespaces[NAMESPACE_NAME]?.accounts.map((account) => {
      const sol_account = account.split(':');
      if (sol_account[2] === address) solana_chain_id = sol_account[1];
    });
    console.log({ solana_chain_id });

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
    console.log(
      { caipAddress },
      this.session.namespaces[NAMESPACE_NAME]?.accounts
    );

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
