import type Transport from '@ledgerhq/hw-transport';

import { getAltStatusMessage } from '@ledgerhq/errors';
import { ETHEREUM_CHAIN_ID, Networks } from '@rango-dev/wallets-shared';
import bs58 from 'bs58';

export const ETH_BIP32_PATH = "44'/60'/0'/0/0";
export const SOLANA_BIP32_PATH = "44'/501'/0'";

export const HEXADECIMAL_BASE = 16;

const ledgerFrequentErrorMessages: { [statusCode: number]: string } = {
  0x5515: 'The device is locked',
  0x650f: 'Related application is not ready on your device',
  0x6985: 'Action denied by user',
};

function getLedgerErrorMessage(statusCode: number): string {
  if (ledgerFrequentErrorMessages[statusCode]) {
    return ledgerFrequentErrorMessages[statusCode];
  } else if (getAltStatusMessage(statusCode)) {
    return getAltStatusMessage(statusCode) as string;
  }

  return `Ledger device unknown error 0x${statusCode.toString(
    HEXADECIMAL_BASE
  )}`; // Hexadecimal numbers are more commonly recognized and utilized for representing ledger error codes
}

export function getLedgerError(error: any) {
  if (error?.statusCode) {
    return new Error(getLedgerErrorMessage(error.statusCode));
  }

  if (error?.code === 'INSUFFICIENT_FUNDS') {
    return new Error('Insufficient funds for transaction');
  }
  return error;
}

export function getLedgerInstance() {
  /*
   * Instances have a required property which is `chainId` and is using in swap execution.
   * Here we are setting it as Ethereum always since we are supporting only eth for now.
   */
  const instances = new Map();

  instances.set(Networks.ETHEREUM, { chainId: ETHEREUM_CHAIN_ID });
  instances.set(Networks.SOLANA, { chainId: Networks.SOLANA });

  return instances;
}

export async function getEthereumAccounts(): Promise<{
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

export async function getSolanaAccounts(): Promise<{
  accounts: string[];
  chainId: string;
}> {
  try {
    const transport = await transportConnect();

    const solana = new (await import('@ledgerhq/hw-app-solana')).default(
      transport
    );

    const accounts: string[] = [];

    const result = await solana.getAddress(SOLANA_BIP32_PATH);
    accounts.push(bs58.encode(result.address));

    return {
      accounts: accounts,
      chainId: Networks.SOLANA,
    };
  } catch (error: any) {
    throw getLedgerError(error);
  } finally {
    await transportDisconnect();
  }
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
