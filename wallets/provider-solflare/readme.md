# Solflare

Solflare integration for hub.  
[Homepage](https://solflare.com/) | [Docs](https://docs.solflare.com/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Feature

#### ⚠️ Switch Account

When the user switches to an account that **does not have prior permissions** granted to the dApp,  
Solflare **automatically disconnects** the current session.

#### ⚠️ Connect

Solflare returns nothing meaningful when the user rejects the connection request, so a rejection **can't be told apart** from other connection failures and is reported as `unknown`.

---

More wallet information can be found in [readme.md](../readme.md).
