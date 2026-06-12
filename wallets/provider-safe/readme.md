# Safe
Safe{Wallet} (smart-contract multisig) integration for hub. EVM only; runs as a Safe App inside the Safe iframe and submits transactions through the Safe transaction service.

## Account switching

`changeAccountSubscriber` is wired up on the namespace but is not exercised in practice. When the user switches the active account in Safe{Wallet}, Safe reloads the Safe App iframe, so the whole dApp (and our provider state) is reinitialized from scratch rather than reacting to an in-place account-change event. There is therefore no live session in which the change-account subscriber would fire — the new account is picked up on the fresh load via `eth_accounts`. It is kept for interface parity with other EVM namespaces.

More about implementation status can be found [here](../readme.md).
