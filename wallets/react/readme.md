# @rango-dev/wallets-react

React package for handling web3 wallets supported by Rango

## Connection errors

When any requested namespace fails, `connect` waits for every namespace to settle, then throws a `WalletConnectionError` from `@hub3js/std/utils`:

- `failures` lists every failed namespace in request order, each with its `error` and the `network` passed for it.
- `message` and `code` are copied from the first failure, and `cause` is that failure's error.

Errors thrown before any namespace is attempted (the wallet isn't registered, or the namespaces are missing or don't match) are thrown as before.

`code` is usually a number, such as `4001` for a user rejection, but it can be a string: `'WALLET_LOCKED'` for a locked wallet, or a raw library code such as Trezor's.
