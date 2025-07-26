import { UI_ID } from '@rango-dev/ui';

export const RANGO_PUBLIC_API_KEY = 'c6381a79-2817-4602-83bf-6a641a409e32';
export const DEFAULT_BASE_URL = 'https://api.rango.exchange';
export const SCANNER_BASE_URL = 'https://explorer.rango.exchange';

export const WIDGET_UI_ID = {
  SWAP_BOX_ID: 'rango-swap-box',
  EXPANDED_BOX_ID: 'rango-expanded-box',
  ...UI_ID,
};

// Following constants will be removed after test.
export const DEEP_LINK_DEFAULT_TARGET_URL = 'https://app.rango.exchange/bridge';
export const DEEP_LINK_DEFAULT_APP_HOST = 'app.rango.exchange';
