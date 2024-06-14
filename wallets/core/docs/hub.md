
# Hub

Hub is outer layer, all the providers will be added to `hub` then let's you get them through a simple interface. This what we have in `wallets/react` implicitly and don't have any control on it.

```javascript
const myHub = new Hub().add("phantom", phantomProvider).add("another one", anotherProvider);
// you can access providers by their id
const phantomProvider = myHub.get("phantom");
// includes state of providers ( + namespaces inside) 
phantomProvider.state();

// Call connect on evm namespace of phantom provider 
phantomProvider.get('evm').connect('0x1');
```
