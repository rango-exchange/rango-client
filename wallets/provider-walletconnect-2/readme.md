# WalletConnect

WalletConnect integration for hub.
[Homepage](https://walletconnect.com/) | [Docs](https://docs.walletconnect.com/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Group

#### ⚠️ UTXO

Only supports Bitcoin.

## Known issues

- Using Private key to import wallets other than `Ethereum` will be problematic. Because it imports only a single blockchain and we are by default asking for `Ethereum`.
- Signing a transaction on Metamask goes through an internal error.
- We couldn't update exist session during a bug in `@walletconnect/utils`, so we are creating new session for accessing to new chains.
