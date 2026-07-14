// We keep derivationPath here because we need to maintain it for signing transactions after it is set in connect method
let derivationPath = '';

export function setDerivationPath(path: string) {
  derivationPath = path;
}

export function getDerivationPath() {
  return derivationPath;
}

/*
 * Bitcoin's connect-time path, kept for the same reason as the EVM one: Rango's PSBT
 * carries no derivation data, so the signer must remember which path to sign with. Kept
 * separate from the EVM path so the two namespaces never collide.
 */
let bitcoinDerivationPath = '';

export function setBitcoinDerivationPath(path: string) {
  bitcoinDerivationPath = path;
}

export function getBitcoinDerivationPath() {
  return bitcoinDerivationPath;
}
