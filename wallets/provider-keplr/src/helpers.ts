// Note: for unknown reason CTRL wallet extension is overiding any function named `keplr`. so make sure you will not use this name for any function!
export function getKeplrInstance() {
  return window.keplr || null;
}
