export function argentx() {
  const { starknet_argentX } = window;
  if (!!starknet_argentX) return starknet_argentX;
  return null;
}
