import { Network, ProviderConnectResult } from '@rangodev/wallets-shared';
import { RequestedAccount } from './types';
import {
  SignInputOutput,
  SendMsg,
} from '@binance-chain/javascript-sdk/lib/types';

export function binance() {
  const { BinanceChain } = window;
  if (!!BinanceChain) {
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
      return Network.ETHEREUM;
    case 'bbc-mainnet':
      return Network.BINANCE;
    case 'bsc-mainnet':
      return Network.BSC;
    default:
      return Network.Unknown;
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

function isMsgSend(msg: any) {
  return msg.__type === 'MsgSend';
}

export function cosmosMessageToBCSendMsg(msg: any): SendMsg {
  if (isMsgSend(msg)) {
    const msgCopy = msg;

    if (msgCopy.inputs.length !== 1)
      throw Error('Multi input coins for binance chain not supported');
    if (msgCopy.outputs.length !== 1)
      throw Error('Multi output coins for binance chain not supported');
    if (msgCopy.inputs[0].coins.length !== 1)
      throw Error('Multi input coins for binaisMsgSendnce chain not supported');
    if (msgCopy.outputs[0].coins.length !== 1)
      throw Error('Multi output coins for binance chain not supported');

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

  throw Error(
    `Cosmos message with type ${msg.__type} not supported in Terra Station`
  );
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
  Network.ETHEREUM,
  Network.BSC,
  Network.BINANCE,
];
