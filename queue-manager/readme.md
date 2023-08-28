# Queue Manager

The `queue-manager` package is a JavaScript library for enqueuing tasks and running them based on their conditions. It uses the core package to manage the state machine and store data in the browser's IndexedDB. The react package provides a wrapper around queue-manager to make it easy to use in React applications. The rango-preset package provides some default values, services, and actions of Rango Exchange to use in Rango.

# Packages

## Core

The `core` package is the backbone of queue-manager. It provides a state machine to manage the queue of tasks and the conditions under which they should be executed. It also stores data in the browser's IndexedDB so that it can be retrieved later.

## React

The `react` package is a wrapper around queue-manager that makes it easy to use in React applications. It provides a context to store data using React hooks, which allows you to easily pass data between components.

## Rango-Preset

The `rango-preset` package provides some default values, services, and actions of Rango Exchange to use in Rango. It can be used to quickly get started with Rango without having to write all of the boilerplate code yourself.
First, you need to add `@rango-dev/wallets-react` to your project

# Installation

To use `queue-manager` in your project, you can install it using NPM

```
yarn add @rango-dev/queue-manager-core @rango-dev/queue-manager-react @rango-dev/queue-manager-rango-preset


# or using NPM

npm install @rango-dev/queue-manager-core @rango-dev/queue-manager-react @rango-dev/queue-manager-rango-preset
```

You can also install the individual packages separately:

```
npm install @rango-dev/queue-manager-core
npm install @rango-dev/queue-manager-react
npm install @rango-dev/queue-manager-rango-preset
```

# Usage

To use `queue-manager`, you need to create a queue definition and pass it to the Provider component of `react` package. You can use the `makeQueueDefinition` function from `rango-preset` package to create a queue definition quickly.

```js
import { Provider } from '@rango-dev/queue-manager-react';
import { SwapQueueContext, makeQueueDefinition } from '@rango-dev/queue-manager-rango-preset';

const swapQueueDef = () =>
  makeQueueDefinition({
    API_KEY,
  });

return (
  <Provider queuesDefs={[swapQueueDef]} context={queueContext}>
    {props.children}
  </Provider>
);
```

You can then use the useManager to access the queueManager object and get store data using React hooks.

```
import { useManager } from "@rango-dev/queue-manager-react";

  const { manager } = useManager();
  const storage = manager?.getAll();
```

# Example

- Check out the demo for queue-manager on [Vercel](https://q-self.vercel.app) to see it in action.

# Contributing

Contributions to queue-manager are welcome! To get started, fork the repository and create a new branch for your changes. Then, submit a pull request with your changes.
