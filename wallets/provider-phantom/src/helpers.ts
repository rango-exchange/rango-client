export function phantom() {
  if ('phantom' in window) {
    const instance = window.phantom?.solana;

    if (instance?.isPhantom) {
      return instance;
    }
  }

  return null;
}
