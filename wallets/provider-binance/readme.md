# Binance Wallet
Binance Wallet integration for hub.  
[Homepage](https://www.binance.com/en/binancewallet) | [Docs](https://developers.binance.com/docs/binance-w3w/introduction)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Group

#### EVM
Binance Wallet supports following EVM chains:

- `ETHEREUM`
- `OPTIMISM`
- `LINEA`
- `METIS`
- `BLAST`
- `CELO`
- `FANTOM`
- `MONAD`
- `SONIC`
- `BERACHAIN`
- `BASE`
- `ZETA_CHAIN`
- `ARBITRUM`
- `BSC`
- `SCROLL`
- `AVAX_CCHAIN`

### Feature

#### ❌ Auto Connect
Binance Wallet does **not provide a functional eager-connect (silent connect) mechanism**.  

All other supported features—connect, switch account, signing, and network handling—work without known issues.

---

More wallet information can be found in [readme.md](../readme.md).
