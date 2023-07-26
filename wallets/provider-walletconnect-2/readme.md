# @rango-dev/provider-walletconnect2


## Known issues

- Trust wallet doesn't return optional namespaces other than evms on its response. So Solana and Cosmos will be ask for connect in wallet but we can not use them.
- Using Private key to import wallets other than `Ethereum` will be problematic. Because it imports only a single blockchain and we are by default asking for `Ethereum`.  
- Signing a transaction on Metamask goes through an internal error.
- We couldn't update exist session during a bug in `@walletconnect/utils`, so we are creating new session for accessing to new chains.

