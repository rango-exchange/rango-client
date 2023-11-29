export const DEFAULT_SNAP_ID = 'npm:@cosmsnap/snap';

export const isCosmosSnapInstalled = async (instance: any) => {
  const result = await instance.request({ method: 'wallet_getSnaps' });
  const installed = Object.keys(result).includes(DEFAULT_SNAP_ID);

  return installed;
};

export const isCosmosSnapInitialized = async (
  instance: any
): Promise<boolean> => {
  const initialized = await instance.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: 'initialized',
      },
    },
  });

  return initialized.data.initialized;
};

export const installCosmosSnap = async (instance: any) => {
  let installed = await isCosmosSnapInstalled(instance);
  if (!installed) {
    await instance
      .request({
        method: 'wallet_requestSnaps',
        params: {
          [DEFAULT_SNAP_ID]: {
            version: '^0.1.0',
          },
        },
      })
      .then(() => {
        installed = true;
      })
      .catch((error: any) => {
        console.log('Error while installing Cosmos Snap', error);
        installed = false;
      });
  }

  if (installed) {
    const initialized = await isCosmosSnapInitialized(instance);
    if (!initialized) {
      await instance.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: DEFAULT_SNAP_ID,
          request: {
            method: 'initialize',
          },
        },
      });
    }
  }
};

export const getAddresses = async (
  instance: any
): Promise<
  {
    chain_id: string;
    address: string;
  }[]
> => {
  const result = await instance.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: 'getChainAddresses',
      },
    },
  });
  return result.data.addresses;
};
