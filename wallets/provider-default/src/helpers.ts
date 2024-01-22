export function defaultInjected() {
  const { ethereum } = window;
  return ethereum ?? null;
}
