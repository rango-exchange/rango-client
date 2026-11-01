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

## Oath Wallet direct connection

`buildOathProvider()` exposes a separate `oath-wallet` provider. The embedded
widget includes it in the existing wallet card and selection-row components when
`walletConnectProjectId` is configured. Selecting Oath opens a QR code and an
`oathwallet://wc?uri=...` handoff for the native iOS app; no browser extension is
required. The generic WalletConnect option remains separate.

This provider enables only the intersection of Rango's EVM metadata and Oath's
supported mainnet EVM allowlist. It does not advertise Bitcoin, Solana or
THORChain through this integration. Session proposal, account handling and EVM
signing reuse the WalletConnect adapter; the client, storage prefix, cache and
event subscribers are isolated from the generic provider.

A standalone hub consumer using `buildOathProvider()` must supply
`WC_PROJECT_ID`, `meta`, and a `DIRECT_CONNECTION_UI` callback. The callback
receives the pairing URI and returns `{ closed: Promise<void>, close(): void }`.
Resolve `closed` when the user dismisses the view; `close()` must be idempotent.
Treat the URI as a temporary pairing secret: render it locally and never log it.
The embedded widget supplies this callback automatically.

### Validation

Run `yarn vitest run wallets/provider-walletconnect-2/tests` from the repository
root. These tests cover cancellation, late responses, failures, session/client
isolation, chain filtering, and the encoded iOS link. They use synthetic clients
and do not prove native wallet pairing or signing.

For a browser check, configure the widget with your Rango API key and
WalletConnect project ID. Compare Oath's card with its neighbours, open Oath,
close the QR view, dismiss the connection status, and reopen it. A new QR should
appear. Also check generic WalletConnect. On iOS, separately verify the app
handoff, approval, reconnect and a test transaction before production rollout.
