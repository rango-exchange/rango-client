import { PendingSwap } from '@rango-dev/queue-manager-rango-preset';

export function timeSince(timeMillis: number): string {
  const seconds = Math.floor((new Date().getTime() - timeMillis) / 1000);
  let intervalType: string;

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'year';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'month';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'day';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = 'hour';
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = 'minute';
          } else {
            interval = seconds;
            intervalType = 'second';
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's';
  }

  return interval + ' ' + intervalType;
}

export function getSwapDate(pendingSwap: PendingSwap) {
  return pendingSwap.finishTime
    ? `Finished ${timeSince(parseInt(pendingSwap.finishTime))} ago @ ${new Date(
        parseInt(pendingSwap.finishTime)
      ).toLocaleString()}`
    : `Started ${timeSince(
        parseInt(pendingSwap.creationTime)
      )} ago @ ${new Date(
        parseInt(pendingSwap.creationTime)
      ).toLocaleString()}`;
}
