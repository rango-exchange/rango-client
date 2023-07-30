export interface Configs {
  API_KEY: string;
}

// this API key is limited and
// it is only for test purpose
const RANGO_PUBLIC_API_KEY = 'c6381a79-2817-4602-83bf-6a641a409e32';
export const WC_PROJECT_ID = 'f5196d081862c6f2b81c04520ea9301c';

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
  let clonedConfigs;
  if (typeof structuredClone === 'function') {
    clonedConfigs = structuredClone(nextConfigs);
  } else {
    clonedConfigs = JSON.parse(JSON.stringify(nextConfigs));
  }
  configs = clonedConfigs;
  return configs;
}
