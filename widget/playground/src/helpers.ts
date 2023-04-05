import { WalletType } from '@rango-dev/wallets-shared';

export const excludedWallets = [WalletType.UNKNOWN, WalletType.TERRA_STATION, WalletType.LEAP];

export const onChangeMultiSelects = (value, values, list, findIndex) => {
  if (value === 'empty') return [];
  else if (value === 'all') return 'all';
  if (values === 'all') {
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
