export function leap_cosmos_instance() {
  const { leap } = window;

  if (!!leap) return leap;

  return null;
}

export async function getSupportedChains(
  instance: any
): Promise<Array<string>> {
  return instance.getSupportedChains();
}
