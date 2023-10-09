import type { Status } from './SwapListItem.types';

import { i18n } from '@lingui/core';

export function getStatus(status: Status): string {
  switch (status) {
    case 'failed':
      return i18n.t('Failed');
    case 'success':
      return i18n.t('Complete');
    default:
      return i18n.t('In progress');
  }
}

export function formattedDateAndTime(
  time: string,
  onlyShowTime?: boolean
): string {
  if (!time) {
    return '';
  }

  const date = new Date(Number(time));
  const HOURS_IN_HALF_DAY = 12; // Constant for 12 hours
  const MINUTES_IN_SINGLE_DIGIT = 10; // Constant for 10 minutes

  if (!onlyShowTime) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= HOURS_IN_HALF_DAY ? 'pm' : 'am';

  const formattedHours =
    hours % HOURS_IN_HALF_DAY === 0
      ? HOURS_IN_HALF_DAY
      : hours % HOURS_IN_HALF_DAY;
  const formattedMinutes =
    minutes < MINUTES_IN_SINGLE_DIGIT ? `0${minutes}` : minutes;

  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

  return formattedTime;
}
