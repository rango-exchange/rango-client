import type {
  Environments,
  TonAddressItemReply,
  TonConnectEvent,
  TonConnectEventSuccess,
} from './types.js';
import type { CaipAccount } from '@hub3js/std/types';

import { utils as tonCoreUtils } from '@hub3js/tvm';
import { dynamicImportWithRefinedError } from '@rango-dev/common-core';

export function isTonConnectEventSuccess(
  event: TonConnectEvent
): event is TonConnectEventSuccess {
  return (
    !!event && event.event === 'connect' && Array.isArray(event.payload?.items)
  );
}

export function isTonAddressItemReply(
  item: unknown
): item is TonAddressItemReply {
  return (
    typeof item === 'object' &&
    item !== null &&
    'name' in item &&
    item.name === 'ton_addr' &&
    'address' in item &&
    typeof item.address === 'string'
  );
}

let environments: Environments | undefined;

export function setEnvironments(env?: Environments) {
  environments = env;
}

export function getTonConnectManifestUrl(): string {
  const manifestUrl = environments?.tonConnectManifestUrl;
  if (!manifestUrl) {
    throw new Error(
      'OKX TON requires a TonConnect manifest URL. Please provide it through the provider environments.'
    );
  }
  return manifestUrl;
}

let tonRequestId = 0;

// TonConnect requires a unique string `id` on every request sent to the bridge.
export function nextTonRequestId(): string {
  tonRequestId += 1;
  return tonRequestId.toString();
}

// Convert a `ConnectEvent`'s raw `<workchain>:<hex>` address to user-friendly CAIP.
export async function connectEventToCAIP(
  connectEvent: TonConnectEvent
): Promise<CaipAccount[]> {
  if (!isTonConnectEventSuccess(connectEvent)) {
    return tonCoreUtils.formatAccountsToCAIP([]);
  }

  const addressItem = connectEvent.payload.items.find(isTonAddressItemReply);
  if (!addressItem) {
    return tonCoreUtils.formatAccountsToCAIP([]);
  }

  const { Address } = await dynamicImportWithRefinedError(
    async () => await import('@ton/core')
  );
  const userFriendlyAddress = Address.parseRaw(addressItem.address).toString({
    bounceable: false,
    urlSafe: true,
  });

  return tonCoreUtils.formatAccountsToCAIP([userFriendlyAddress]);
}
