import type { ProviderProps } from './types.js';

export function shouldTryAutoConnect(
  props: Pick<ProviderProps, 'allBlockChains' | 'autoConnect'>
): boolean {
  return !!props.allBlockChains?.length && !!props.autoConnect;
}
