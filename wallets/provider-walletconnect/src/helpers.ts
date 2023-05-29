import WalletConnectClient from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

const BRIDGE_URL = 'https://bridge.walletconnect.org';

export function supportsForSwitchNetworkRequest(provider: any): boolean {
  const wallets = ['metamask'];
  const connectedWallet = provider?.peerMeta?.name || '';

  return wallets.some((wallet) => {
    return connectedWallet.toLowerCase().includes(wallet);
  });
}

export function makeConnection(options: {
  force?: boolean;
  chainId?: number;
  provider: any;
}): Promise<any> {
  const { force = false, chainId, provider } = options;
  const clientOptions = {
    bridge: BRIDGE_URL,
    // This property will be filled when we are using `.setMeta` inside `provider.tsx`.
    rpc: [],
    qrcodeModal: QRCodeModal,
  };

  return new Promise((resolve, reject) => {
    /* 
        There are two types of making connection:
          1. Normal Connection: 
            Pickup the availabe session or create a new session if it's not connected yet.
          2. Forced Connection:
            In some cases like switching network, we need to create a new session anyways,
            Even the connection is already made.
      */
    (async () => {
      // If `force` is true, Creating a new instance,
      // Otherwise try to use old connection if availabe
      // (returns null if there is no old connection)
      let currentProvider = force
        ? new WalletConnectClient(clientOptions)
        : provider;
      const hasProvider = !!currentProvider;
      const onCloseModal = () => {
        reject(new Error('QRCode modal has been closed.'));
      };

      // If force is false, there are some cases that this.provider is null
      // Like connection for the first time.
      if (!hasProvider) {
        currentProvider = new WalletConnectClient(clientOptions);
      }

      // if a connection is not established, try to make a new session.
      if (!currentProvider.connected) {
        const session_options = chainId
          ? {
              chainId,
            }
          : undefined;

        // The current promise will be rejected if user close the modal.
        currentProvider.on('modal_closed', onCloseModal);

        /*
              `createSession` will make a new session, but it doesn't means
              the connection has been established. The only way we can make sure
              a session has been created and the connection is ready, 
              is using the `connect` event after successfully creating the session.
          */
        await currentProvider
          .createSession(session_options)
          .then(() => {
            currentProvider.on('connect', (error: any, _payload: any) => {
              if (error) {
                return reject(error);
              }

              currentProvider.off('modal_closed', onCloseModal);
              resolve(currentProvider);
            });
          })
          .catch(reject);
      } else {
        /* 
            Connection is established, we will use the current session without creating a new one.
          */
        resolve(currentProvider);
      }
    })();
  });
}
