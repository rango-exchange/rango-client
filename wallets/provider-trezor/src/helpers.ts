/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ETH_CHAIN_ID, Networks } from '@rango-dev/wallets-shared';
import TrezorConnect from '@trezor/connect-web';

export const ETH_BIP32_PATH = "m/44'/60'/0'/0/0";

export function getTrezorInstance() {
  /*
   * Instances have a required property which is `chainId` and is using in swap execution.
   * Here we are setting it as Ethereum always since we are supporting only eth for now.
   */
  const instances = new Map();

  instances.set(Networks.ETHEREUM, { chainId: ETH_CHAIN_ID });

  return instances;
}

export async function getEthereumAccounts(): Promise<{
  accounts: string[];
  chainId: string;
}> {
  try {
    const result = await TrezorConnect.ethereumGetAddress({
      path: ETH_BIP32_PATH,
      showOnTrezor: true,
    });

    if (!result.success) {
      throw new Error(result.payload.error);
    }

    return {
      accounts: [result.payload.address],
      chainId: ETH_CHAIN_ID,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const toHexString = (value: bigint) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return value > 0n ? `0x${value.toString(16)}` : '0x0';
};
