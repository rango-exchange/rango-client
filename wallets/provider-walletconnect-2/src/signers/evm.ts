import type { ISignClient, SessionTypes } from '@walletconnect/types';
import type { EvmTransaction } from 'rango-types/mainApi';

import { cleanEvmError, toHexQuantity } from '@rango-dev/signer-evm';
import { AccountId, ChainId } from 'caip';
import { type GenericSigner, SignerError, SignerErrorCode } from 'rango-types';

import { utf8ToHex } from '../utils.js';
import { EthereumRPCMethods, NAMESPACES } from '../wcConstants.js';

const NAMESPACE_NAME = NAMESPACES.ETHEREUM;

type SessionGetter = () => SessionTypes.Struct | null;

type WalletConnectEvmTx = {
  from?: string;
  to?: string;
  data: string;
  value: string;
  gas?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  nonce?: string;
};

class EVMSigner implements GenericSigner<EvmTransaction> {
  private client: ISignClient;
  private getSession: SessionGetter;

  constructor(client: ISignClient, getSession: SessionGetter) {
    this.client = client;
    this.getSession = getSession;
  }

  private get session(): SessionTypes.Struct {
    const session = this.getSession();
    if (!session) {
      throw new Error('EVM WalletConnect session is not available.');
    }
    return session;
  }

  /**
   * Map Rango's EvmTransaction to WalletConnect eth_sendTransaction params.
   *
   * Unlike DefaultEvmSigner.buildTx (ethers TransactionRequest with gasLimit +
   * decimal fee strings), WC sends params raw over the relay. Wallets like
   * Ledger Live parse QUANTITY as hex, so decimal fees get inflated (~40x+).
   *
   * This builder:
   *  - uses `gas` (JSON-RPC), not ethers' `gasLimit`
   *  - hex-encodes gas, fees, value, and nonce
   */
  static buildTx(evmTx: EvmTransaction): WalletConnectEvmTx {
    const tx: WalletConnectEvmTx = {
      data: evmTx.data || '0x',
      /*
       * Approvals and many contract calls have value=null from the API.
       * Some WC wallets reject missing value; send 0x0 explicitly.
       */
      value: evmTx.value ? toHexQuantity(evmTx.value) : '0x0',
    };

    if (evmTx.from) {
      tx.from = evmTx.from;
    }
    if (evmTx.to) {
      tx.to = evmTx.to;
    }
    if (evmTx.nonce) {
      tx.nonce = toHexQuantity(evmTx.nonce);
    }
    if (evmTx.gasLimit) {
      tx.gas = toHexQuantity(evmTx.gasLimit);
    }
    if (evmTx.maxFeePerGas && evmTx.maxPriorityFeePerGas) {
      tx.maxFeePerGas = toHexQuantity(evmTx.maxFeePerGas);
      tx.maxPriorityFeePerGas = toHexQuantity(evmTx.maxPriorityFeePerGas);
    } else if (evmTx.gasPrice) {
      tx.gasPrice = toHexQuantity(evmTx.gasPrice);
    }

    return tx;
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
    const hexMsg = utf8ToHex(msg, true);

    const params = [hexMsg, address];

    let signature: string;
    try {
      // Send message to wallet (using relayer)
      signature = await this.client.request({
        topic: this.session.topic,
        chainId: caipChainId.toString(),
        request: {
          method: EthereumRPCMethods.PERSONAL_SIGN,
          params,
        },
      });
    } catch (error) {
      throw cleanEvmError(error);
    }

    /*
     * TODO: We can also verify the signature here
     * Check web-examples: dapps/react-dapp-v2/src/contexts/JsonRpcContext.tsx
     */

    return signature;
  }

  async signAndSendTx(
    tx: EvmTransaction,
    address: string,
    chainId: string | null
  ): Promise<{ hash: string }> {
    try {
      const requestedFor = this.isNetworkAndAccountExistInSession({
        address,
        chainId,
      });
      const transaction = EVMSigner.buildTx(tx);
      const hash: string = await this.client.request({
        topic: this.session.topic,
        chainId: requestedFor.caipChainId,
        request: {
          method: EthereumRPCMethods.SEND_TRANSACTION,
          params: [transaction],
        },
      });
      // Some wallets e.g. Rainbow wallet are returning invalid hash (e.g. 'null') in case of the rejection
      if (!hash?.startsWith('0x')) {
        throw new Error(
          `Received an invalid hash on signing the transaction. (hash=${hash})`
        );
      }

      return {
        hash,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const modifiedError = cleanEvmError(error);
      const session = this.session;
      const context = {
        namspaces: session?.namespaces,
        peering: session?.peer?.metadata,
        code: error?.code,
      };
      modifiedError.context = context;
      throw modifiedError;
    }
  }

  private isNetworkAndAccountExistInSession(requestedFor: {
    address: string;
    chainId: string | null;
  }) {
    const { address, chainId } = requestedFor;

    if (!chainId) {
      console.log('isNetworkAndAccountExistInSession', requestedFor);
      throw new Error(
        'You need to set your chain for signing message/transaction.'
      );
    }

    /*
     * TODO: We need to make sure we are using a single format for chain ids, it should be hex or number.
     * This is a quick fix for evm.
     */
    const chainIdNumber = chainId.startsWith('0x')
      ? String(parseInt(chainId))
      : chainId;

    const caipAddress = new AccountId({
      chainId: {
        namespace: NAMESPACE_NAME,
        reference: chainIdNumber,
      },
      address,
    });
    const addresses = this.session.namespaces[NAMESPACE_NAME]?.accounts.map(
      (address) => address.toLowerCase()
    );

    if (!addresses || !addresses.includes(caipAddress.toString())) {
      throw new Error(
        `Your requested address doesn't exist on your wallect connect session. Please reconnect your wallet.`
      );
    }

    const caipChainId = new ChainId({
      namespace: NAMESPACE_NAME,
      reference: chainIdNumber,
    });

    return {
      chainId: chainIdNumber,
      address,
      caipChainId: caipChainId.toString(),
    };
  }
}

export default EVMSigner;
