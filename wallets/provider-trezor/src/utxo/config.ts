/*
 * Trezor needs the input `script_type` to sign a Bitcoin input. It is determined by the
 * BIP-43 `purpose` of the derivation path the address was derived from, so we expose the
 * four common address types and let the user connect whichever one they hold funds on.
 */
export type TrezorInputScriptType =
  | 'SPENDADDRESS'
  | 'SPENDP2SHWITNESS'
  | 'SPENDWITNESS'
  | 'SPENDTAPROOT';

export interface BitcoinAddressType {
  /** Stable id used in the derivationPath metadata entries. */
  id: 'legacy' | 'nested-segwit' | 'native-segwit' | 'taproot';
  label: string;
  /** BIP-43 purpose: 44 legacy, 49 nested segwit, 84 native segwit, 86 taproot. */
  purpose: number;
  inputScriptType: TrezorInputScriptType;
}

export const BITCOIN_COIN_NAME = 'btc';

export const BITCOIN_ADDRESS_TYPES: readonly BitcoinAddressType[] = [
  {
    id: 'native-segwit',
    label: 'Native SegWit',
    purpose: 84,
    inputScriptType: 'SPENDWITNESS',
  },
  {
    id: 'nested-segwit',
    label: 'Nested SegWit',
    purpose: 49,
    inputScriptType: 'SPENDP2SHWITNESS',
  },
  {
    id: 'legacy',
    label: 'Legacy',
    purpose: 44,
    inputScriptType: 'SPENDADDRESS',
  },
  {
    id: 'taproot',
    label: 'Taproot',
    purpose: 86,
    inputScriptType: 'SPENDTAPROOT',
  },
] as const;

/**
 * Resolve the Trezor input script type for a derivation path by reading its BIP-43
 * purpose (the first hardened level). The path always comes from one of our own
 * derivation templates, so an unknown purpose is a programming error.
 */
export function resolveBitcoinScriptType(path: string): TrezorInputScriptType {
  const purpose = Number.parseInt(
    path.replace(/^m\//, '').split('/')[0]?.replace(/['h]$/, '') ?? '',
    10
  );
  const addressType = BITCOIN_ADDRESS_TYPES.find(
    (type) => type.purpose === purpose
  );
  if (!addressType) {
    throw new Error(`Unsupported Bitcoin derivation path: ${path}`);
  }
  return addressType.inputScriptType;
}
