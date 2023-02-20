[ ] Add a type for child classes (Metamask, ..) to ensure they are implementing required methods.

## Template

Template for creating a new provider

```
const WALLET = WalletType.COINBASE;

class TemplateWallet extends Wallet<InstanceType> implements WalletInterface {
  constructor(onChangeState: EventHandler) {
    super(WALLET, onChangeState);

    // let instance = metamask_instance();
    // if (!!instance) {
    //   this.setProvider(instance);
    //   this.subscirbe();
    // }
  }

  async check() {}
  async connect() {}
  async disconnect() {}
  async subscribe() {}
}

export default {
  initializer: TemplateWallet,
  type: WALLET
};
```

## TODO

- [ ] subscirbe -> subscribe
- [ ] add eagerConnect to core (maybe instead of check?)
- [ ] Reading from wallets (like `eth_chainId`, `eth_accounts`) should've a timeout. because sometimes wallet doesn't responding corretly. But requesting (like `eth_requestAccounts`) shouldn't have a timeout, because it opens a popup and it take some time to get a confirmation or rejction from user.





- add provider to `checkWalletProviders`