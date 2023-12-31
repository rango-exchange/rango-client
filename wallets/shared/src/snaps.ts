export const walletRequestSnaps = async ({
  instance,
  snapId,
  version,
}: {
  instance: any;
  snapId: string;
  version?: string;
}): Promise<any> => {
  if (instance === undefined) {
    throw new Error('Could not get MetaMask provider');
  }
  if (instance.request === undefined) {
    throw new Error('MetaMask provider does not define a .request() method');
  }

  try {
    const ret = await instance.request({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: { version },
      },
    });
    return ret;
  } catch (error) {
    console.log('wallet_requestSnaps RPC call failed.', error);
    return Promise.reject(error);
  }
};

export const walletInvokeSnap = async ({
  instance,
  params,
}: {
  instance: any;
  params?: any;
}): Promise<any> => {
  if (instance === undefined) {
    throw new Error('Could not get MetaMask provider');
  }
  if (instance.request === undefined) {
    throw new Error('MetaMask provider does not define a .request() method');
  }
  try {
    const ret = await instance.request({
      method: 'wallet_invokeSnap',
      params,
    });
    return ret;
  } catch (error) {
    console.log('wallet_invokeSnap RPC call failed.', error);
    return Promise.reject(error);
  }
};
