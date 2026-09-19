# Solflare

Solflare integration for hub.  
[Homepage](https://solflare.com/) | [Docs](https://docs.solflare.com/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Feature

#### ⚠️ Switch Account

When the user switches to an account that **does not have prior permissions** granted to the dApp,  
Solflare **automatically disconnects** the current session.

#### ⚠️ Connect Rejection

When the user rejects a connection, Solflare returns nothing meaningful, so the rejection **can't be told apart from a real failure**. It's reported as a regular connection error.

---

More wallet information can be found in [readme.md](../readme.md).
