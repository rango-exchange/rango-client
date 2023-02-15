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

## Todos

- [ ] Migrate wallets
- [ ] Migrate queue-manage
- [ ] Publish wallets and queue-manager and use it in Rango
- [ ] Setup repository to be fully linked to local packages and work together smoothly. And also setup the 
- [ ] Make a test client for wallets
- [ ] Make a test client for queque manager (already have a basic version)
- [ ] Implementing UI components for widget (blocked by design)
- [ ] Implementing a react client for widget (embedded)
- [ ] Implementing a wrapper for exposing widget APIs 
