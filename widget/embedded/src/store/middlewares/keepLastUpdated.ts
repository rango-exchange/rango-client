import type { StateCreator } from 'zustand';

/**
 * you can wrap your slice in this middleware, it will update `lastUpdatedAt` for that slice when a zustand's `set` is calling
 */
export const keepLastUpdated: <Store, Slice extends { lastUpdatedAt: number }>(
  config: StateCreator<Store, [], [], Slice>
) => StateCreator<Store, [], [], Slice> = (slice) => (set, get, api) => {
  const modifedSet: typeof set = (...params) => {
    const [partial, ...restParams] = params;
    set((state) => {
      // @see https://github.com/pmndrs/zustand/blob/90f8d592d4cde9aa15f236e320f17ccbc86cf0fb/src/vanilla.ts#L69-L72
      type State = ReturnType<typeof get>;
      const nextState =
        typeof partial === 'function'
          ? (partial as (s: State) => State)(state)
          : partial;

      return {
        ...nextState,
        lastUpdatedAt: +new Date(),
      };
    }, ...restParams);
  };
  return slice(modifedSet, get, api);
};
