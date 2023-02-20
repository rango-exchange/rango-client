export function tokenpocket() {
  const { ethereum } = window;
  if (ethereum && ethereum.isTokenPocket) return ethereum;

  return null;
}
