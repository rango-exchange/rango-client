/**
 * EIP-712 typed data in the shape viem's `signTypedData` takes. `types` holds
 * only the primary type: `EIP712Domain` is derived from `domain`.
 */
export type HyperliquidTypedData = {
  domain: Record<string, unknown>;
  types: Record<string, unknown>;
  primaryType: string;
  message: Record<string, unknown>;
};
