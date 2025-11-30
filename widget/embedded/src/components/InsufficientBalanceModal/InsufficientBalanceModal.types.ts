import type { ConfirmSwapWarnings } from '../../types';
import type { WalletRequiredAssets } from 'rango-sdk';

export type WalletRequiredAssetReason = WalletRequiredAssets['reason'];

export type PropTypes = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  warnings?: NonNullable<ConfirmSwapWarnings['balance']>['messages'];
};
