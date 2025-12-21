import type { WalletRequiredAssetReason } from './InsufficientBalanceModal.types';

const reasonPriority: Record<WalletRequiredAssetReason, number> = {
  FEE_AND_INPUT_ASSET: 0,
  INPUT_ASSET: 1,
  FEE: 2,
};

export function sortByReason(
  a: { reason: WalletRequiredAssetReason },
  b: { reason: WalletRequiredAssetReason }
) {
  return reasonPriority[a.reason] - reasonPriority[b.reason];
}
