import type { EIP_6963_ANNOUNCE_PROVIDER } from './src';
import type { EIP6963AnnounceProviderEvent } from './src/types';

declare global {
  interface WindowEventMap {
    [EIP_6963_ANNOUNCE_PROVIDER]: EIP6963AnnounceProviderEvent;
  }
}
