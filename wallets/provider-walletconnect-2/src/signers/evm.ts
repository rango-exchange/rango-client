import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import { SessionTypes } from '@walletconnect/types';
import { AccountId, ChainId } from 'caip';
import type { GenericSigner } from 'rango-types';
import { EvmTransaction } from 'rango-types/lib/api/main';
import * as encoding from '@walletconnect/encoding';
import { EthereumRPCMethods, NAMESPACES } from '../constants';

const NAMESPACE_NAME = NAMESPACES.ETHEREUM;

class EVMSigner implements GenericSigner<EvmTransaction> {
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
    const hexMsg = encoding.utf8ToHex(msg, true);

    const params = [hexMsg, address];

    // Send message to wallet (using relayer)
    const signature: string = await this.client.request({
      topic: this.session.topic,
      chainId: caipChainId.toString(),
      request: {
        method: EthereumRPCMethods.PERSONAL_SIGN,
        params,
      },
    });

    // TODO: We can also verify the signature here
    // Check web-examples: dapps/react-dapp-v2/src/contexts/JsonRpcContext.tsx

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

    const signedTx: string = await this.client.request({
      topic: this.session.topic,
      chainId: requestedFor.caipChainId,
      request: {
        method: EthereumRPCMethods.SEND_TRANSACTION,
        params: [tx],
      },
    });

    return {
      hash: signedTx,
    };
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

    const caipAddress = new AccountId({
      chainId: {
        namespace: NAMESPACE_NAME,
        reference: chainId,
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
        caipAddress.toString()
      );
      throw new Error(
        `Your requested address doesn't exist on your wallect connect session. Please reconnect your wallet.`
      );
    }

    const caipChainId = new ChainId({
      namespace: NAMESPACE_NAME,
      reference: chainId,
    });

    return { chainId, address, caipChainId: caipChainId.toString() };
  }
}

export default EVMSigner;
