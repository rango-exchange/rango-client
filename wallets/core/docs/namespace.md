# Namespace

Namespace is using for grouping blockchains (e.g. EVM). They are following some certain standards usually. By increasing multi-chain wallets, the pattern of namespaces will help us to treat each part of wallet separately and properly. Sometimes some of this namespaces can be enabled/disabled and they can not be detected most of the times.

By this separation, we can have more flexible implementation where a namespace should be run or not. For example, We can say Phantom provider, shouldn't be connected to EVM at init time but it's ok to connect to Solana.

The whole behavior of a wallet can be defined in it's provider, there is no more any assumptions about the implementation from `/core` perspective. They can define `init`,`connect` or whatever they want, `wallets/core` doesn't force a specific workflow or you should implement a certain interface. All of the behavior is delegated to provider (which includes namespace) itself.

Each namespace can have it's own interface. For example:

```typescript
interface Solana{
   connect(): void
}
interface Evm{
   connect(chain: string): void
}
```

Usage Example:

```javascript
new NamespaceBuilder().config("...", {
    ...
}).action("connect", () => {
    // ...
}).action("disconnect", () => {
    // ...
}).build()
```

## Actions

Action are the functions that should be implemented and they have defined in `namespace` interface. for example, evm should implements this function signature: `connect(chain): string` or solana: `connect(): string`.

So we should define a connect action and add them to namespace:

```javascript

const evmConnect = (chain) => { return "0x...." };
const solanaConnect = () => { return "some base58 probably"}

const evmNamespace = new NamespaceBuilder().action("connect", evmConnect);
const solanaNamespace = new NamespaceBuilder().action("connect", solanaConnect);
```

### Context

All actions have context which includes some specific methods to work with namespace, e.g. `state`.
Context are always accessible using the first parameter of action.

For example:

```javascript
namespace.action("connect", (context, chain) => {
    // ..
})
```

### Internal actions

The philosophy of core is creating a wallet management by only passing small pieces of functions. to achive this it has almost any abstraction over the final behavior (like connecting a wallet).

In some cases, we need some special behaviors to be available from core. They are actually behavior of core itself. The only one that we have right now is `init`. When we are initializing a provider, it will be called on some certain situations. Sometimes exposing this to the library users will be useful. Like a wallet want to do some certain things on initializing the wallet.  

### Hook actions

To make the code enough composable and shareable we've defined some hooks that can be called before or after running an action by core.

This can be useful to share some logics, for example updating state after a successful connection, this is all providers (aka wallets) should implements. So we can share this logic as a hook and use in all of them.

#### and

This will be called after a **successful** call of action. Consider `connect`, if connect was successful we want to update the state accordingly.

```javascript
const namespace = new Namespace()
.action('connect', async () => { 
    const accounts = await ethereum.request(...);
    return accounts;
})
.and('connect', (context, accounts) => {
    const [, setState] = context.state();
    setState('accounts', accounts.accounts);
})
```

#### before/after

Running a hook action after/before an action regardless of success or not. Consider you want to go to `loading` mode on `connect`.

```javascript
const namespace = new Namespace()
.action('connect', async () => { 
    const accounts = await ethereum.request(...);
    return accounts;
})
.before('connect', (context) => {
    const [, setState] = context.state();
    setState('loading', true);
})
.after('connect', (context) => {
    const [, setState] = context.state();
    setState('loading', false);
})

```

## Common/Standard

As I mentioned earlier, `wallets/core` will not have any assumptions which means when a namespace wants to implement `connect`, it should update Hub state as well. Previously, we had been doing it in `core` ourself.
Handing this responsibility to `namespace`s make them more flexible but so much duplicated code as well.

For tackling this issue, `core` has a directory `namespaces` that all the small pieces like the case I said will lives there. Which means updating state after a `connect` can be imported from `core` and namespace add it.

Another problem with this approach is there more than just one function usually to be imported. Importing all of them one by one makes it hard to use and also old providers/namespaces should be updated if we want to add some of this function to all of them (consider we have ~35 providers).

The solution is `core/namespaces` has a `recommended` array as well which bundle them together and `namespace`s can only import `recommended` from now on.

Example:

```javascript
import {recommended} from "core/namespaces/solana"

new NamespaceBuilder().action(recommended)
```

There some kind of hooks available to you: `and`, `before`, `after`

- **and** after running action **successfully**.
- **before**: before running an action
- **after**: after running an action, wether it's successful or not.

Example:
Whenever `connect` called, it will call what passed to `and` afterwards (if action was successful). 

```javascript
builder.action('connect', connectAction).and("connect", () => { /* ... */ } );
```
