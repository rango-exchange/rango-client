/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { AccContract } from '../types';
import type { BIP44AddressKeyDeriver } from '@metamask/key-tree';

import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { utils } from 'ethers';
import { CallData, constants, ec, hash, num } from 'starknet';
import { number, ec as oldEC } from 'starknet_v4.22.0';

import { getAccounts } from '../helpers';

const MAX_SCAN = 20;
export const PROXY_CONTRACT_HASH =
  '0x25ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918'; // from argent-x repo
export const ACCOUNT_CLASS_HASH_V0 =
  '0x033434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2'; // from argent-x repo

export function isSameChainId(chainId1: string, chainId2: string) {
  return num.toBigInt(chainId1) === num.toBigInt(chainId2);
}

function hashKeyWithIndex(key: string, index: number) {
  const payload = utils.concat([utils.arrayify(key), utils.arrayify(index)]);
  const hash = utils.sha256(payload);
  return number.toBN(hash);
}

export function grindKey(keySeed: string, keyValueLimit = oldEC.ec.n): string {
  if (!keyValueLimit) {
    return keySeed;
  }
  const sha256EcMaxDigest = number.toBN(
    '1 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000',
    16
  );
  const maxAllowedVal = sha256EcMaxDigest.sub(
    sha256EcMaxDigest.mod(keyValueLimit)
  );

  /*
   * Make sure the produced key is devided by the Stark EC order,
   * and falls within the range [0, maxAllowedVal).
   */
  let i = 0;
  let key;
  do {
    key = hashKeyWithIndex(keySeed, i);
    i++;
  } while (!key.lt(maxAllowedVal));

  return '0x' + key.umod(keyValueLimit).toString('hex');
}

export const getNextAddressIndex = (
  chainId: string,
  addresses: AccContract[],
  derivationPath: string
) => {
  const accounts = addresses
    .filter((acc) => isSameChainId(acc.chainId, chainId))
    .sort((a: AccContract, b: AccContract) => a.addressIndex - b.addressIndex)
    .filter(
      (acc) => acc.derivationPath === derivationPath && acc.addressIndex >= 0
    );
  const uninitializedAccount = accounts.find(
    (acc) => !acc.publicKey || num.toBigInt(acc.publicKey) === constants.ZERO
  );

  return uninitializedAccount?.addressIndex ?? accounts.length;
};

export async function getAddressKey(
  keyDeriver: BIP44AddressKeyDeriver,
  addressIndex = 0
) {
  const privateKey = (await keyDeriver(addressIndex)).privateKey;
  const addressKey = grindKey(privateKey as string);
  return {
    addressKey,
    derivationPath: keyDeriver.path,
  };
}

export const getKeysFromAddressIndex = async (
  keyDeriver: BIP44AddressKeyDeriver,
  chainId: string,
  state: AccContract[],
  index: number
) => {
  let addressIndex = index;
  if (isNaN(addressIndex) || addressIndex < 0) {
    addressIndex = getNextAddressIndex(chainId, state, keyDeriver.path);
    console.log(`getKeysFromAddressIndex: addressIndex found: ${addressIndex}`);
  }

  const { addressKey, derivationPath } = await getAddressKey(
    keyDeriver,
    addressIndex
  );
  const starkKeyPub = ec.starkCurve.getStarkKey(addressKey);
  const starkKeyPrivate = num.toHex(addressKey);
  return {
    privateKey: starkKeyPrivate,
    publicKey: starkKeyPub,
    addressIndex,
    derivationPath,
  };
};

export const getAccContractAddressAndCallData = (publicKey: string) => {
  const callData = CallData.compile({
    implementation: ACCOUNT_CLASS_HASH_V0,
    selector: hash.getSelectorFromName('initialize'),
    calldata: CallData.compile({ signer: publicKey, guardian: '0' }),
  });
  let address = hash.calculateContractAddressFromHash(
    publicKey,
    PROXY_CONTRACT_HASH,
    callData,
    0
  );
  if (address.length < 66) {
    address = address.replace('0x', '0x' + '0'.repeat(66 - address.length));
  }
  return {
    address,
    callData,
  };
};

export async function getAddressKeyDeriver(provider: any) {
  const bip44Node = await provider.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 9004,
    },
  });

  /*
   * `m / purpose' / coin_type' / account' / change / address_index`
   * `m / 44' / 9004' / 0' / 0 / {index}`
   */
  return getBIP44AddressKeyDeriver(bip44Node);
}

export const getKeysFromAddress = async (
  provider: any,
  keyDeriver: BIP44AddressKeyDeriver,
  chainId: string,
  address: string,
  maxScan = MAX_SCAN
) => {
  let addressIndex;
  const addresses = await getAccounts(provider, chainId || '');

  const acc = addresses?.find(
    (acc) => acc.address === address && isSameChainId(acc.chainId, chainId)
  );
  if (acc) {
    addressIndex = acc.addressIndex;
  } else {
    const bigIntAddress = num.toBigInt(address);
    for (let i = 0; i < maxScan; i++) {
      const { publicKey } = await getKeysFromAddressIndex(
        keyDeriver,
        chainId,
        addresses,
        i
      );
      const { address: calculatedAddress } =
        getAccContractAddressAndCallData(publicKey);
      if (num.toBigInt(calculatedAddress) === bigIntAddress) {
        addressIndex = i;
        break;
      }
    }
  }

  if (addressIndex && !isNaN(addressIndex)) {
    return getKeysFromAddressIndex(
      keyDeriver,
      chainId,
      addresses,
      addressIndex
    );
  }
  throw new Error(`Address not found: ${address}`);
};
