// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StarknetProviderAPI = Record<string, any>;
export function ready() {
  const { starknet_argentX } = window;
  if (!!starknet_argentX) {
    return starknet_argentX;
  }
  return null;
}
