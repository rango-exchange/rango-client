import type Transport from '@ledgerhq/hw-transport';

const ETHEREUM_CHAIN_ID = '0x1';

export const ETH_BIP32_PATH = "44'/60'/0'/0/0";

const ledgerErrorMessages: { [statusCode: number | string]: string } = {
  21781: 'The device is locked',
  25871: 'Related application is not ready on your device',
  27013: 'Action denied by user',
  INSUFFICIENT_FUNDS: 'Insufficient funds for transaction',
};

export function getLedgerInstance() {
  /*
   * Instances have a required property which is `chainId` and is using in swap execution.
   * Here we are setting it as Ethereum always since we are supporting only eth for now.
   */
  return { chainId: ETHEREUM_CHAIN_ID };
}

export async function getLedgerAccounts(): Promise<{
  accounts: string[];
  chainId: string;
}> {
  try {
    const transport = await transportConnect();

    const eth = new (await import('@ledgerhq/hw-app-eth')).default(transport);

    const accounts: string[] = [];

    const result = await eth.getAddress(ETH_BIP32_PATH, false, true);
    accounts.push(result.address);

    return {
      accounts: accounts,
      chainId: ETHEREUM_CHAIN_ID,
    };
  } catch (error: any) {
    throw getLedgerError(error);
  } finally {
    await transportDisconnect();
  }
}

export function getLedgerError(error: any) {
  const errorCode = error?.statusCode || error?.code; // ledger error || broadcast error

  if (errorCode && !!ledgerErrorMessages[errorCode]) {
    return new Error(ledgerErrorMessages[errorCode]);
  }
  return error;
}

let transportConnection: Transport | null = null;

export async function transportConnect() {
  transportConnection = await (
    await import('@ledgerhq/hw-transport-webhid')
  ).default.create();

  return transportConnection;
}

export async function transportDisconnect() {
  if (transportConnection) {
    await transportConnection.close();
    transportConnection = null;
  }
}
