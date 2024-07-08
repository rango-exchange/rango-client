// We keep derivationPath here because we need to maintain it for signing transactions after it is set in connect method
let derivationPath = '';

export function setDerivationPath(path: string) {
  derivationPath = path;
}

export function getDerivationPath() {
  return derivationPath;
}
