export enum FunctionalCollapseState {
  FROM = 'from',
  WALLET = 'wallet',
  LIQUIDITY_SOURCE = 'liquidity source',
  TO = 'to',
}

export enum ModalState {
  DEFAULT_BLOCKCHAIN = 'blockchain',
  DEFAULT_TOKEN = 'token',
}

export type LiquidityType = 'DEX' | 'BRIDGE';
