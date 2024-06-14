# Overview

Previously, A `Provider` was representing a wallet and it should implement a fixed and predefined interface (`connect`, `getInstance` and ...) by `wallets/core`.  Then, these providers (a.k.a wallets) could be added to `wallets/react`. it's getting a list of `Provider`s and passing each of them to `Wallet` class to create an instance from. All the created instances will be added to a hashmap that can be accessed by wallet name.

Finally, `wallets/react` has an interface called `ProviderContext` that lets you doing things like `connect` by providing a wallet name.

So here we only have a class called `Wallet` that gets some function as it inputs (what we export from providers) and nothing more.

The problem is this Wallet should be able to handle all the use cases a wallet might have. As an example, WalletConnect hasn't an injected instance, it works completely differently from what injected wallets do.  Handling all this wallet-specific cases, made the `Wallet` complex and sometimes changing anything there, can impact all of wallets.

This has been solved in new version by separating concerns and see the `wallets/core` as a protocol that let's you define any interface you want. As I mentioned, it was a specific class and interface that should implement all most common things between wallets and let only `Provider` implement some specific parts of this process (like how we can get a wallet instance).

## How It works

There are 3 layers that build up the whole wallet management and each layer can be used completely separately.

The 3 layers are:

- `Namespace`: A namespace is grouping blockchains that supports same standard like EVM,Cosmos and Solana. We didn't have this separation before.
- `Provider`: It's a wallet that contains `Namespace`s. Like what we already have, providers/
- `Hub`: It contains `Provider`s (a.k.a wallets). let's you access all providers and do some actions on them. We didn't have this separation as well, but it was kinda exists in `wallets/react` implicitly.

You can learn more about:

- [Hub](hub.md)
- [Provider](provider.md)
- [Namespace](namespace.md)

## General concepts

### Builders

Namespace and Provider can be created using their builders. Builder pattern lets to construct the final object (namespace, provider) in a more appropriate way:

```javascript
new Builder().func().func(...).whatever(....).build()
```

Namespace example:

```typescript
new NamespaceBuilder<EvmActions>('evm', 'metamask')
  .action('init', () => {
    // ..
  })
  .action('...', () => {
    // ..
  })
  .build()
```

**Note:** Currently hub doesn't have builder.

### Config

We've added a config functionality to all the layers so they can have their own configuration to disable/enable default behaviors and also for they can be set from their outer layer. For example if we set a config on `Hub`, it will be used for all layers but each of them can override the value on its own, so a Namespace can config a value for itself and that will be used, if not set it will use what have been set in `Hub`.

Builders have Config. All the layers have their own separate config. They are like `config("name", value)`

Example:

```javascript
namespace.config("autoconnect", false).config("defaultChain", 0x0);
```

### Store

Store is using for keeping states. Provider and Namespace are standalone which means they can be used together or separately. If you are putting namespaces in a provider, you should pass a store to `Provider`, if not, you will pass the store directly to `Namespace`. Both of them has a `.store(...)` method for doing this.
