import type Transport from '@ledgerhq/hw-transport';

import { getAltStatusMessage } from '@ledgerhq/errors';
import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { ETHEREUM_CHAIN_ID } from '@rango-dev/wallets-shared';
import bs58 from 'bs58';

import { HEXADECIMAL_BASE } from './constants.js';
import { getDerivationPath } from './state.js';

export type Provider = Map<string, unknown>;

export function ledger(): Provider | null {
  /*
   * Instances have a required property which is `chainId` and is using in swap execution.
   * Here we are setting it as Ethereum always since we are supporting only eth for now.
   */
  const instances = new Map();

  instances.set(LegacyNetworks.ETHEREUM, { chainId: ETHEREUM_CHAIN_ID });
  instances.set(LegacyNetworks.SOLANA, { chainId: LegacyNetworks.SOLANA });

  return instances;
}

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLedgerError(error: any) {
  if (error?.statusCode) {
    return new Error(getLedgerErrorMessage(error.statusCode));
  }

  if (error?.code === 'INSUFFICIENT_FUNDS') {
    return new Error('Insufficient funds for transaction');
  }
  return error;
}

export function standardizeAndThrowLedgerError(_: unknown, error: unknown) {
  throw getLedgerError(error);
}

export async function getEthereumAccounts(): Promise<{
  accounts: string[];
  chainId: string;
}> {
  try {
    const transport = await transportConnect();

    const eth = new (await import('@ledgerhq/hw-app-eth')).default(transport);

    const accounts: string[] = [];

    const result = await eth.getAddress(getDerivationPath(), false, true);
    accounts.push(result.address);

    return {
      accounts: accounts,
      chainId: ETHEREUM_CHAIN_ID,
    };
  } catch (error: unknown) {
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

    const result = await solana.getAddress(getDerivationPath());
    accounts.push(bs58.encode(result.address));

    return {
      accounts: accounts,
      chainId: LegacyNetworks.SOLANA,
    };
  } catch (error: unknown) {
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
