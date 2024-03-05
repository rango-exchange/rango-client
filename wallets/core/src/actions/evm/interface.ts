import type { Context } from '../../hub/blockchain';

interface EvmActionsMain {
  connect(this: Context, chain: string): void;
  disconnect(this: Context, chain: any): void;
  suggest(this: Context, chain: any): void;
}

export type EvmActions = Partial<EvmActionsMain>;
