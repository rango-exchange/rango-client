import { RANGO_PUBLIC_API_KEY } from '../constants';

export interface Configs {
  API_KEY: string;
}

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

/**
 * Getting new configs from params and reset the value of global `configs` with provided param.
 */
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

export const DEFAULT_PRIMARY_RADIUS = 20;
export const DEFAULT_SECONDARY_RADIUS = 25;
export const DEFAULT_FONT_FAMILY = 'Roboto';

export const THEME_CLASS_NAME_PREFIX = `theme-widget`;
