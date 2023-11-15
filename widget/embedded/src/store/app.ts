import type { ConfigSlice } from './slices/config';
import type { DataSlice } from './slices/data';
import type { WidgetConfig } from '../types';
import type { StateCreator } from 'zustand';

import { create } from 'zustand';

import { createConfigSlice } from './slices/config';
import { createDataSlice } from './slices/data';

export type StateCreatorWithInitialData<
  T extends Partial<WidgetConfig>,
  R extends Record<string, unknown>,
  V extends Record<string, unknown>
> = (
  initialData: T | undefined,
  ...rest: Parameters<StateCreator<R, [], [], V>>
) => ReturnType<StateCreator<R, [], [], V>>;

export type AppStoreState = DataSlice & ConfigSlice;

export function createAppStore(initialData?: WidgetConfig) {
  return create<AppStoreState>()((...a) => ({
    ...createDataSlice(...a),
    ...createConfigSlice(initialData, ...a),
  }));
}
