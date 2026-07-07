# Trezor

Trezor integration for hub.  
[Homepage](https://trezor.io//) | [Docs](https://docs.trezor.io/trezor-suite/)

## Implementation notes/limitations

### Group

#### ⚠️ EVM

We only support Ethereum for now.

### Feature

#### ❌ Switch Account

Switch account is not supported. Users must choose the account via derivation path when connecting.

#### ❌ Auto Connect

Auto-connect is not supported. Trezor requires explicit user interaction (device unlock, permissions, and address export), and the integration does not implement silent eager connect (`canEagerConnect`). The derivation path must also be selected at connect time and is not restored automatically on reload.

---

More wallet information can be found in [readme.md](../readme.md).
