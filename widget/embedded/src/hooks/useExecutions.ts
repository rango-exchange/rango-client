import type { SwapExecution } from '@rango-dev/sdk';

import { useMemo } from 'react';

import { useExecutionStore } from '../store/executions';

/** The executions on record, newest first, and whether they have been read yet. */
export function useExecutions(): {
  executions: SwapExecution[];
  loaded: boolean;
} {
  const executions = useExecutionStore.use.executions();
  const loaded = useExecutionStore.use.loaded();
  const list = useMemo(
    () => Object.values(executions).sort((a, b) => b.createdAt - a.createdAt),
    [executions]
  );

  return { executions: list, loaded };
}
