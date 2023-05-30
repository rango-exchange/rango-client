import { allProviders } from '@rango-dev/provider-all';

export function removeDuplicateFrom<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function areEqual(
  array1: (number | string)[],
  array2: (number | string)[]
) {
  return (
    array1.length === array2.length && array1.every((v, i) => v === array2[i])
  );
}

export function debounce(fn: Function, time: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null;
  return wrapper;
  function wrapper(...args: any) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, time);
  }
}

export function getProviders(wallets, externalProviders) {
  let providers = allProviders();
  if (!!externalProviders) providers = externalProviders;
  if (!!wallets) {
    providers = providers.filter((provider) => {
      const type = provider.config.type;
      return wallets.find((w) => w === type);
    });
  }

  return providers;
}
