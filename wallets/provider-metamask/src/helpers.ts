function isMetamaskProvider(ethereum: any): boolean {
  const isMetamask = !!ethereum?.isMetaMask;
  if (!isMetamask) {
    return false;
  }
  /*
   * Brave tries to make itself look like MetaMask
   * Could also try RPC `web3_clientVersion` if following is unreliable
   */
  if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state) {
    return false;
  }
  if (ethereum.isApexWallet) {
    return false;
  }
  if (ethereum.isAvalanche) {
    return false;
  }
  if (ethereum.isBitKeep) {
    return false;
  }
  if (ethereum.isBlockWallet) {
    return false;
  }
  if (ethereum.isCoin98) {
    return false;
  }
  if (ethereum.isFordefi) {
    return false;
  }
  if (ethereum.__XDEFI) {
    return false;
  }
  if (ethereum.isMathWallet) {
    return false;
  }
  if (ethereum.isOkxWallet || ethereum.isOKExWallet) {
    return false;
  }
  if (ethereum.isOneInchIOSWallet || ethereum.isOneInchAndroidWallet) {
    return false;
  }
  if (ethereum.isOpera) {
    return false;
  }
  if (ethereum.isPortal) {
    return false;
  }
  if (ethereum.isRabby) {
    return false;
  }
  if (ethereum.isDefiant) {
    return false;
  }
  if (ethereum.isTokenPocket) {
    return false;
  }
  if (ethereum.isTokenary) {
    return false;
  }
  if (ethereum.isZeal) {
    return false;
  }
  if (ethereum.isZerion) {
    return false;
  }
  return true;
}

export function metamask() {
  const { ethereum } = window;

  if (Array.isArray(ethereum?.providers)) {
    /*
     * When alternative EVM wallets are enabled and take precedence over MetaMask,
     * they append MetaMask or other EVM wallets to the ethereum.providers array.
     * example: 'Core' wallet
     */
    let providers = ethereum.providers;
    //Exceptions exist, such as when only 'MetaMask' and 'Coinbase' are enabled.
    if (
      providers.length > 0 &&
      Array.isArray(ethereum.providers[0]?.providers) &&
      providers[0]?.providers.length > 0
    ) {
      providers = providers[0]?.providers;
    }

    const metamaskProvider = providers.find(isMetamaskProvider);
    if (metamaskProvider) {
      return metamaskProvider;
    }
  }
  return ethereum?.isMetaMask ? ethereum : null;
}
