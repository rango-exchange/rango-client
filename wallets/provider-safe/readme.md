# Safe
Safe{Wallet} (smart-contract multisig) integration for hub. EVM only; runs as a Safe App inside the Safe iframe and submits transactions through the Safe transaction service.

## Account switching

`changeAccountSubscriber` is wired up on the namespace but is not exercised in practice. When the user switches the active account in Safe{Wallet}, Safe reloads the Safe App iframe, so the whole dApp (and our provider state) is reinitialized from scratch rather than reacting to an in-place account-change event. There is therefore no live session in which the change-account subscriber would fire — the new account is picked up on the fresh load via `eth_accounts`. It is kept for interface parity with other EVM namespaces.

## Switch network

The same reload behavior applies to network switching. A Safe App is bound to the chain of the Safe it is embedded in, and changing the active network in Safe{Wallet} reloads the Safe App iframe — reinitializing the whole dApp (and our provider state) from scratch rather than emitting an in-place chain-change event. There is therefore no live session in which an in-place network switch could be observed; the new chain is picked up on the fresh load via `eth_chainId`.

More about implementation status can be found [here](../readme.md).
