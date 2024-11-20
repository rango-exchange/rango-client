export interface Configs {
  API_KEY: string;
}

/*
 * this API key is limited and
 * it is only for test purpose
 */
const RANGO_PUBLIC_API_KEY = 'c6381a79-2817-4602-83bf-6a641a409e32';
export const WC_PROJECT_ID = 'e24844c5deb5193c1c14840a7af6a40b';
export const TREZOR_MANIFEST = {
  appUrl: 'https://widget.rango.exchange/',
  email: 'hi+trezorwidget@rango.exchange',
};
export const TON_CONNECT_MANIFEST_URL =
  'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/manifests/tonconnect-manifest.json';
let configs: Configs = {
  API_KEY: RANGO_PUBLIC_API_KEY,
};

export function getConfig(name: keyof Configs) {
  return configs[name];
}

export function setConfig(name: keyof Configs, value: any) {
  configs[name] = value;

  return value;
}

export function initConfig(nextConfigs: Configs) {
  configs = structuredClone(nextConfigs);
  return configs;
}
