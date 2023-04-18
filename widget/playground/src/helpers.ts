import { WalletType } from '@rango-dev/wallets-shared';
import { Token } from 'rango-sdk';

export const excludedWallets = [WalletType.UNKNOWN, WalletType.TERRA_STATION, WalletType.LEAP];

export const onChangeMultiSelects = (value, values, list, findIndex) => {
  if (value === 'empty') return [];
  else if (value === 'all') return null;
  if (!values) {
    values = [...list];
    const index = list.findIndex(findIndex);
    values.splice(index, 1);
    return values;
  } else {
    values = [...values];
    const index = values.findIndex(findIndex);
    if (index !== -1) values.splice(index, 1);
    else values.push(value);
    if (values.length === list.length) return 'all';
    else return values;
  }
};

export function tokensAreEqual(
  tokenA: Pick<Token, 'blockchain' | 'symbol' | 'address'> | null,
  tokenB: Pick<Token, 'blockchain' | 'symbol' | 'address'> | null,
) {
  return (
    tokenA?.blockchain === tokenB?.blockchain &&
    tokenA?.symbol === tokenB?.symbol &&
    tokenA?.address === tokenB?.address
  );
}
