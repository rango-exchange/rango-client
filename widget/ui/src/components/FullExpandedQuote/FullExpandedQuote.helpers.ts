import type { I18n } from '@lingui/core';
import type { Tag } from 'rango-sdk';

export const ITEM_SKELETON_COUNT = 3;
export const TOOLTIP_SIDE_OFFSET = 10;
const MAX_AMOUNT_LENGTH_DISPLAY = 4;
const MAX_NAME_LENGTH_DISPLAY = 6;

export function shortenAmount(amount: string) {
  if (!amount || amount.length <= MAX_AMOUNT_LENGTH_DISPLAY) {
    return amount;
  }
  return amount.slice(0, MAX_AMOUNT_LENGTH_DISPLAY) + '...';
}

export function shortenDisplayName(name: string) {
  if (!name || name.length <= MAX_NAME_LENGTH_DISPLAY) {
    return name;
  }
  return name.slice(0, MAX_NAME_LENGTH_DISPLAY) + '...';
}

export function getTagLabel(tag: Tag, t: I18n['t']): string {
  const data: Record<Tag, string> = {
    CENTRALIZED: t('Centralized'),
    FASTEST: t('Fastest'),
    HIGH_IMPACT: t('High Impact'),
    LOWEST_FEE: t('Lowest Fee'),
    RECOMMENDED: t('Recommended'),
  };
  return data[tag];
}
