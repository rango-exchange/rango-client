# Ctrl (formerly XDEFI)

Ctrl Wallet integration for hub.  
[Homepage](https://ctrl.xyz/) | [Docs](https://developers.ctrl.xyz/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Group

#### ✅ EVM

Supports the full EVM set Rango exposes (`evmBlockchains`), plus arbitrary EVM
chains via `wallet_addEthereumChain` / `wallet_switchEthereumChain`. Not limited to
a fixed list.

#### ⚠️ UTXO

A single UTXO namespace grouping **Bitcoin, Litecoin, Dogecoin, and Bitcoin Cash**
(this is the only multi-chain UTXO wallet in the hub). `connect` returns the
addresses of every available UTXO chain at once, each CAIP-encoded with its own
`bip122` chain id.

Signing differs per chain:

- **Bitcoin** is signed and broadcast by the wallet via `sign_psbt` (PSBT, `broadcast: true`).
- **Litecoin / Dogecoin / Bitcoin Cash** use the wallet's `transfer` method.

#### ✅ Solana

Supported. Message signing uses a custom signer because Ctrl exposes
`signMessage(bytes)` directly (rather than the `request({ method: 'signMessage' })`
form), then base58-encodes the signature.


### Feature

#### ⚠️ Switch Account

EVM and Solana use their providers' native `accountsChanged` events.

UTXO is different: Ctrl's UTXO providers emit `accountsChanged` with an **empty
`{}` payload**, so they can't report the new account themselves, and re-fetching
them while disconnected opens a wallet popup. Because Ctrl switches the active
account across **all** chains at once and signals it reliably on the **EVM
provider**, the UTXO namespace is driven off the EVM `accountsChanged`: on a switch
(non-empty array) it re-fetches all UTXO chains; on disconnect (empty array) it
disconnects. This means UTXO switch/disconnect detection relies on EVM being
connected alongside UTXO — always the case in practice, since Ctrl grants all chains
together on connect.

#### ⚠️ Disconnect

A wallet-initiated disconnect is detected through the EVM provider's empty
`accountsChanged` (see Switch Account). The UTXO providers expose no usable
disconnect signal on their own.

#### ⚠️ Cross Browser

Ctrl is supported **only on Chromium-based browsers** (e.g. Chrome, Brave).

---

More wallet information can be found in [readme.md](../readme.md).