export {};

declare global {
  interface Window {
    // Some dependencies can override global environments, so maybe we needed to make some changes to make them compatible.
    // This should be optional to `provider-solfare` can be compiled. see: `@solflare-wallet/metamask-sdk/lib/cjs/types.d.ts(74,18)`
    ethereum?: any;
    braveEthereum?: any;
    braveSolana?: any;
    BinanceChain?: any;
    cosmostation?: any;
    binancew3w?: any;
    exodus?: any;
    solana?: any;
    phantom?: any;
    xfi?: any;
    coinbaseWalletExtension?: any;
    coinbaseSolana?: any;
    coin98?: any;
    keplr?: any;
    isSafePal?: any;
    safePal?: any;
    safepalProvider?: any;
    trustwallet?: any;
    okxwallet?: any;
    starknet_argentX?: any;
    starknet_braavos?: any;
    tronLink?: any;
    tokenpocket?: any;
    kucoin?: any;
    leap?: any;
    // This is for Station provider, `@terra-money/wallet-controller` adds this property to window automatically.
    // file: node_modules/@terra-money/wallet-controller/modules/extension-router/multiChannel.d.ts
    // terraWallets: any;
    enkrypt?: any;
    tally?: any;
    bitkeep?: any;
    offlineSigner?: any;
    tomo_evm?: any;
    solflare?: any;
    unisat?: any;
    XverseProviders?: any;
  }
}
