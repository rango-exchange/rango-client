# Trezor

Trezor integration for hub.  
[Homepage](https://trezor.io//) | [Docs](https://docs.trezor.io/trezor-suite/)

## Implementation notes/limitations

### Group

#### ⚠️ EVM

We only support Ethereum for now.

#### ⚠️ UTXO

We support Bitcoin only. The connect flow lets the user pick the address type via
derivation path (Native SegWit `84'`, Nested SegWit `49'`, Legacy `44'`, Taproot `86'`).

Trezor Connect has no PSBT API — its `signTransaction` takes explicit `inputs`/`outputs` —
so Rango's BTC PSBT is parsed with `bitcoinjs-lib` and translated into that shape, then
signed and broadcast via Trezor's Blockbook backend (`push: true`). `version`, `locktime`
and per-input `sequence` are preserved from the PSBT; only `SIGHASH_ALL` is supported.
Rango's PSBT carries no `bip32Derivation`, so the connect-time path is kept (like the EVM
signer) and applied to the inputs.

Other UTXO chains (LTC/DOGE/BCH/ZEC) are not implemented — they arrive from Rango as plain
transfers (no PSBT) and would use Trezor's `composeTransaction` instead.

### Feature

#### ❌ Switch Account

Switch account is not supported. Users must choose the account via derivation path when connecting.

#### ❌ Auto Connect

Auto-connect is not supported. Trezor requires explicit user interaction (device unlock, permissions, and address export), and the integration does not implement silent eager connect (`canEagerConnect`). The derivation path must also be selected at connect time and is not restored automatically on reload.

---

More wallet information can be found in [readme.md](../readme.md).
