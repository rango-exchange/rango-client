export const ITEM_SKELETON_COUNT = 3;
export const TOOLTIP_SIDE_OFFSET = 5;
const MAX_AMOUNT_LENGTH_DISPLAY = 4;
export function shortenAmount(amount: string) {
  if (!amount || amount.length <= MAX_AMOUNT_LENGTH_DISPLAY) {
    return amount;
  }
  return amount.slice(0, MAX_AMOUNT_LENGTH_DISPLAY) + '...';
}
