
# Provider

A provider is a container to `Namespace`s and let's access to them at once and also added some more functionality. For example we can run some functions before or after of some specific actions (e.g `connect`). A provider is equivalent to what we have already, a representation of wallet.  

Example:

```javascript
// evmNamespace and solanaNamespace have been defined using `new NamespaceBuilder()`

new ProviderBuilder('rango wallet')
    .config('info', { ... })
    .add('evm', evmNamespace)
    .add('solana', solanaNamespace)
    .build();
```
