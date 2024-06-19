export function tomo() {
  const { tomo_evm } = window;
  if (tomo_evm) {
    return tomo_evm;
  }

  return null;
}
