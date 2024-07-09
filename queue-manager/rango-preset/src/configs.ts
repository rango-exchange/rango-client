import type { RouteExecutionEvents } from './types';

interface Emitter<Events extends Record<string, unknown>> {
  emit<K extends keyof Events>(type: K, event: Events[K]): void;
}

export interface Configs {
  API_KEY: string;
  BASE_URL?: string;
  emitter?: Emitter<RouteExecutionEvents>;
}

/*
 * this API key is limited and
 * it is only for test purpose
 */

const RANGO_PUBLIC_API_KEY = 'c6381a79-2817-4602-83bf-6a641a409e32';

let configs: Configs = {
  API_KEY: RANGO_PUBLIC_API_KEY,
  BASE_URL: '',
};

export function getConfig<K extends keyof Configs>(name: K): Configs[K] {
  return configs[name];
}

export function setConfig(name: keyof Configs, value: any) {
  configs[name] = value;

  return value;
}

export function initConfig(nextConfigs: Configs) {
  configs = nextConfigs;
  return configs;
}
