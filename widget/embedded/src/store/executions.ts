import type { SwapExecution } from '@rango-dev/sdk';

import { create } from 'zustand';

import createSelectors from './selectors';

export interface ExecutionsState {
  /** Whether the executions on record have been read once; pages show a skeleton until then. */
  loaded: boolean;
  /** Every execution on record, keyed by request id. */
  executions: Record<string, SwapExecution>;
  /**
   * Replaces the list with what the store holds, except that a record already
   * here at a higher version wins: an event can land before a read of the
   * store comes back.
   */
  setAll: (executions: SwapExecution[]) => void;
  /** Takes the record after a transition; an older version than the one here is ignored. */
  upsert: (execution: SwapExecution) => void;
  remove: (requestId: string) => void;
  /** For a read that failed: the pages render what there is instead of a skeleton forever. */
  markLoaded: () => void;
}

export const useExecutionStore = createSelectors(
  create<ExecutionsState>()((set, get) => ({
    loaded: false,
    executions: {},
    setAll: (list) => {
      const current = get().executions;
      const executions: Record<string, SwapExecution> = {};
      for (const execution of list) {
        const known = current[execution.requestId];
        executions[execution.requestId] =
          known && known.version > execution.version ? known : execution;
      }
      set({ executions, loaded: true });
    },
    upsert: (execution) => {
      set((state) => {
        const known = state.executions[execution.requestId];
        if (known && known.version >= execution.version) {
          return state;
        }
        return {
          executions: {
            ...state.executions,
            [execution.requestId]: execution,
          },
        };
      });
    },
    remove: (requestId) => {
      set((state) => {
        if (!(requestId in state.executions)) {
          return state;
        }
        return {
          executions: Object.fromEntries(
            Object.entries(state.executions).filter(([id]) => id !== requestId)
          ),
        };
      });
    },
    markLoaded: () => set({ loaded: true }),
  }))
);
