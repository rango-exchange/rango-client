import type { ApprovePrerequisiteParams } from './executeApprovePrerequisite';
import type { ApprovePrerequisiteResult } from './types';
import type { ActionContext } from '../../../context';
import type { SwapExecution } from '../../../types';

import { evmApproveAdapter } from './adapters/evm';
import { tronApproveAdapter } from './adapters/tron';
import { executeApprovePrerequisite } from './executeApprovePrerequisite';

export async function executeEvmApprovePrerequisite(
  exec: SwapExecution,
  params: ApprovePrerequisiteParams,
  context: ActionContext
): Promise<ApprovePrerequisiteResult | null> {
  return executeApprovePrerequisite(exec, params, context, evmApproveAdapter);
}

export async function executeTronApprovePrerequisite(
  exec: SwapExecution,
  params: ApprovePrerequisiteParams,
  context: ActionContext
): Promise<ApprovePrerequisiteResult | null> {
  return executeApprovePrerequisite(exec, params, context, tronApproveAdapter);
}
