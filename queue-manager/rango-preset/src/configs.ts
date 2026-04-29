import type { RouteExecutionEvents } from './types';

import { getApiKeyFromEnvOrNotSet } from './env';

interface Emitter<Events extends Record<string, unknown>> {
  emit<K extends keyof Events>(type: K, event: Events[K]): void;
}

export interface Configs {
  API_KEY: string;
  BASE_URL?: string;
  emitter?: Emitter<RouteExecutionEvents>;
}

let configs: Configs = {
  API_KEY: getApiKeyFromEnvOrNotSet(),
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
