import type { ConfigSlice } from './slices/config';
import type { DataSlice } from './slices/data';

import { create } from 'zustand';

import createSelectors from './selectors';
import { createConfigSlice } from './slices/config';
import { createDataSlice } from './slices/data';

const store = create<DataSlice & ConfigSlice>()((...a) => ({
  ...createDataSlice(...a),
  ...createConfigSlice(...a),
}));

export const useAppStore = createSelectors(store);
