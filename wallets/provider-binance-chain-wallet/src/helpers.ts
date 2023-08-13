import type { RequestedAccount } from './types';
import type { SignInputOutput } from '@binance-chain/javascript-sdk/lib/types/index.js';
import type { Network, ProviderConnectResult } from '@rango-dev/wallets-shared';

import { SendMsg } from '@binance-chain/javascript-sdk/lib/types/index.js';
import { Networks } from '@rango-dev/wallets-shared';

export function binance() {
  const { BinanceChain } = window;
  if (BinanceChain) {
    if (BinanceChain.isCoin98) {
      return null;
    }
    return BinanceChain;
  }
  return null;
}

export function addressTypeToNetwork(type: string): Network {
  switch (type) {
    case 'eth':
      return Networks.ETHEREUM;
    case 'bbc-mainnet':
      return Networks.BINANCE;
    case 'bsc-mainnet':
      return Networks.BSC;
    default:
      return Networks.Unknown;
  }
}
export function getAllAccounts(
  account: RequestedAccount
): ProviderConnectResult[] {
  const output: ProviderConnectResult[] = [];
  account.addresses
    .filter((address) => !address.type.includes('testnet'))
    .forEach((address) => {
      output.push({
        accounts: [address.address],
        chainId: addressTypeToNetwork(address.type),
      });
    });

  return output;
}

export function findActiveAccount(
  accounts: RequestedAccount[],
  currentEthAddress: string
): RequestedAccount | undefined {
  return accounts.find((account) => {
    const searchForAddress = account.addresses.find((addressData) => {
      return addressData.address == currentEthAddress;
    });
    const foundAddress = !!searchForAddress;

    return foundAddress;
  });
}

type Coin = {
  denom: string;
  amount: string;
};

type InputOutput = { address: string; coins: Coin[] };

type MsgSend = {
  inputs: InputOutput[];
  outputs: InputOutput[];
  aminoPrefix: string;
};

export function cosmosMessageToBCSendMsg(msg: MsgSend): SendMsg {
  const msgCopy = msg;

  if (msgCopy.inputs.length !== 1) {
    throw Error('Multi input coins for binance chain not supported');
  }
  if (msgCopy.outputs.length !== 1) {
    throw Error('Multi output coins for binance chain not supported');
  }
  if (msgCopy.inputs[0].coins.length !== 1) {
    throw Error('Multi input coins for binance chain not supported');
  }
  if (msgCopy.outputs[0].coins.length !== 1) {
    throw Error('Multi output coins for binance chain not supported');
  }

  const outputs: SignInputOutput[] = [
    {
      address: msgCopy.outputs[0].address,
      coins: [
        {
          denom: msgCopy.outputs[0].coins[0].denom.toUpperCase(),
          amount: parseInt(msgCopy.outputs[0].coins[0].amount),
        },
      ],
    },
  ];

  return new SendMsg(msgCopy.inputs[0].address, outputs);
}

export async function accountsForActiveWallet(
  instance: any,
  currentEthAddress: string
) {
  const allAvailableAccounts =
    (await instance.requestAccounts()) as RequestedAccount[];
  const activeAccount = findActiveAccount(
    allAvailableAccounts,
    currentEthAddress
  );
  const accounts = activeAccount ? getAllAccounts(activeAccount) : [];
  return accounts;
}

export const BINANCE_CHAIN_WALLET_SUPPORTED_CHAINS = [
  Networks.ETHEREUM,
  Networks.BSC,
  Networks.BINANCE,
];
