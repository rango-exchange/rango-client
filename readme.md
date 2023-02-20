## Structure

there are 3 high level package list:

- `wallets`: A sets of packages for sits between dApp and web3 wallets.
- `queue-manager`: Let us to enqueue some tasks and run them.
- `packages`: Specific packages that are independent to others.

## Workflows

### UI development

```
yarn build
```

then 

```
cd packages/ui
yarn storybook
```

### Widget development

```
yarn build
```

then 

```
cd packages/widget
yarn start
```

