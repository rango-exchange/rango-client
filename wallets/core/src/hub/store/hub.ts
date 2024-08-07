/************ Hub ************/

import type { State } from './mod.js';
import type { StateCreator } from 'zustand';

type HubConfig = object;

export interface HubStore {
  config: HubConfig;
}

type HubStateCreator = StateCreator<State, [], [], HubStore>;

const hubStore: HubStateCreator = () => ({
  config: {},
});

export { hubStore };
