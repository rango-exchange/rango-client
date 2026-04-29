# @rango-dev/provider-coin98

Coin98 integration for hub.  
[Homepage](https://coin98.com/) | [Docs](https://docs.coin98.com/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Feature

#### ⚠️ Switch Account

When the user switches to an account that **does not have prior permissions** granted to the dApp,  
Coin98 **automatically disconnects** the current session.

#### ❌ Auto Connect

Can't auto connect because if we don't have permission and try to connect to the wallet,
it will still show the connect popup

---

More wallet information can be found in [readme.md](../readme.md).