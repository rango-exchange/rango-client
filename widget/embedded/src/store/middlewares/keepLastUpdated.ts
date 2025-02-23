import type { StateCreator } from 'zustand';

/**
 * you can wrap your slice in this middleware, it will update `lastUpdatedAt` for that slice when a zustand's `set` is calling
 */
export const keepLastUpdated: <Store, Slice extends { lastUpdatedAt: number }>(
  config: StateCreator<Store, [], [], Slice>
) => StateCreator<Store, [], [], Slice> = (slice) => (set, get, api) => {
  const modifedSet: typeof set = (...params) => {
    set((state) => {
      return {
        ...state,
        lastUpdatedAt: +new Date(),
      };
    });
    set(...params);
  };
  return slice(modifedSet, get, api);
};
