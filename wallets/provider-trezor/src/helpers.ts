import { cleanEvmError } from '@rango-dev/signer-evm';
import { ETHEREUM_CHAIN_ID, Networks } from '@rango-dev/wallets-shared';

export const ETHEREUM_BIP32_PATH = "m/44'/60'/0'/0/0";

export function getTrezorErrorMessage(error: any) {
  if (error?.shortMessage) {
    /*
     * Some error signs have lengthy, challenging-to-read messages.
     * shortMessage is used because it is shorter and easier to understand.
     */
    return new Error(error.shortMessage, { cause: error });
  }
  return cleanEvmError(error);
}

export function getTrezorInstance() {
  /*
   * Instances have a required property which is `chainId` and is using in swap execution.
   * Here we are setting it as Ethereum always since we are supporting only eth for now.
   */
  const instances = new Map();

  instances.set(Networks.ETHEREUM, { chainId: ETHEREUM_CHAIN_ID });

  return instances;
}

export async function getEthereumAccounts(path: string): Promise<{
  accounts: string[];
  chainId: string;
}> {
  const { default: TrezorConnect } = await import('@trezor/connect-web');
  const result = await TrezorConnect.ethereumGetAddress({
    path,
  });

  if (!result.success) {
    throw new Error(result.payload.error);
  }

  return {
    accounts: [result.payload.address],
    chainId: ETHEREUM_CHAIN_ID,
  };
}

/*
 * Using BigInt in the valueToHex function ensures that the function
 * can handle very large integer values that exceed the range of standard JavaScript number types.
 */
export const valueToHex = (value: string) => {
  const ZERO_BIGINT = BigInt(0);
  const HEX_BASE = 16;
  return BigInt(value) > ZERO_BIGINT
    ? `0x${BigInt(value).toString(HEX_BASE)}`
    : '0x0';
};
