export function argentx() {
  const { starknet } = window;
  if (!!starknet) return starknet;
  return null;
}
