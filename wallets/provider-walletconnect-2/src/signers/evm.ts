import type { SignClient } from '@walletconnect/sign-client/dist/types/client';
import type { SessionTypes } from '@walletconnect/types';
import type { EvmTransaction } from 'rango-types/lib/api/main';

import { cleanEvmError } from '@rango-dev/signer-evm';
import * as encoding from '@walletconnect/encoding';
import { AccountId, ChainId } from 'caip';
import { type GenericSigner } from 'rango-types';

import { EthereumRPCMethods, NAMESPACES } from '../constants';

const NAMESPACE_NAME = NAMESPACES.ETHEREUM;

class EVMSigner implements GenericSigner<EvmTransaction> {
  private client: SignClient;
  private session: SessionTypes.Struct;

  constructor(client: SignClient, session: SessionTypes.Struct) {
    this.client = client;
    this.session = session;
  }

  static buildTx(evmTx: EvmTransaction, disableV2 = false) {
    let tx = {};
    if (evmTx.from) {
      tx = { ...tx, from: evmTx.from };
    }
    if (evmTx.to) {
      tx = { ...tx, to: evmTx.to };
    }
    if (evmTx.data) {
      tx = { ...tx, data: evmTx.data };
    }
    if (evmTx.value) {
      tx = { ...tx, value: evmTx.value };
    }
    if (evmTx.nonce) {
      tx = { ...tx, nonce: evmTx.nonce };
    }
    if (evmTx.gasLimit) {
      tx = { ...tx, gasLimit: evmTx.gasLimit };
    }
    if (evmTx.gasPrice) {
      const shift = 16;
      tx = {
        ...tx,
        gasPrice: '0x' + parseInt(evmTx.gasPrice).toString(shift),
      };
    }
    if (evmTx.maxFeePerGas && !disableV2) {
      tx = { ...tx, maxFeePerGas: evmTx.maxFeePerGas };
    }
    if (evmTx.maxPriorityFeePerGas && !disableV2) {
      tx = { ...tx, maxPriorityFeePerGas: evmTx.maxPriorityFeePerGas };
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
    const hexMsg = encoding.utf8ToHex(msg, true);

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
    const requestedFor = this.isNetworkAndAccountExistInSession({
      address,
      chainId,
    });
    try {
      const transaction = EVMSigner.buildTx(tx);
      const hash: string = await this.client.request({
        topic: this.session.topic,
        chainId: requestedFor.caipChainId,
        request: {
          method: EthereumRPCMethods.SEND_TRANSACTION,
          params: [transaction],
        },
      });
      return {
        hash,
      };
    } catch (error) {
      throw cleanEvmError(error);
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
      console.warn(
        'Available adresses and requested address:',
        addresses,
        caipAddress.toString(),
        chainId,
        address
      );
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
