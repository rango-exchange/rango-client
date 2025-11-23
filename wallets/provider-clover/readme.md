# Clover
Clover Wallet integration for hub.  
[Homepage](https://clover.finance/en/wallet) | [Docs](https://docs.clover.finance/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Feature

#### ⚠️ Transaction Signing
Clover Wallet is currently **unable to sign transactions** on **both Solana and EVM** in a reliable or functional manner.  
Because of this limitation, transaction flows may fail on either network.

#### ⚠️ Auto Connect
- Clover does **not** provide a native eager-connect mechanism for **Solana**.  
- Solana eager connect only works **if EVM has been connected first**, because Clover uses the EVM connection state as the basis for detecting Solana availability.
- If only Solana is selected, **auto-connect will not work**.

---

More wallet information can be found in [readme.md](../readme.md).
