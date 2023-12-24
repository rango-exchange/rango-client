## Overview

### Queue Manager

The Queue Manager is a library that facilitates efficient management of swaps by creating a queue structure similar to a linked list. It provides various APIs to create and manage queues, such as blocking a queue. The Queue Manager supports the execution of multiple queues simultaneously in parallel.

The folder structure is as follows:

- `/queue-manager/core`: This directory contains the JavaScript implementation of the queue.
- `/queue-manager/react`: This directory integrates the core functionality with React, unlocking features like automatic re-renders. It makes the queue available to the entire React app using context.
- `/queue-manager/rango-preset`: This directory houses a comprehensive decentralized exchange (DEX) queue with advanced features such as parallel execution and multi-chain support. It is also integrated with Rango, enabling full-cycle swap functionality, including obtaining quotes, creating transactions, and signing them using wallets

### Wallets

We have developed a unified interface for most Web3 wallets, including Bitcoin, EVM, Cosmos, Solana, TON, and more. The library provides a core module that acts as a state manager and provider for the final wallet interface. Each wallet is referred to as a provider and contains the implementation specific to that wallet.

To add all our providers at once, simply pass the `provider-all`. If you only require specific providers, you can add them individually to your project by passing an array of `provider` objects.

For more information about the wallets, refer to the `/wallets/` directory.

### Widget

The Widget comprises high-level packages that include a user interface (UI) and different versions of our widget, which serves as a decentralized application (dApp).

Here is the structure:
`/widget/ui`: This directory contains our UI components and Storybook for visual development and testing.
`/widget/embedded`: Our react implementation of the widget. They are publishing as NPM packages.
`/widget/app`: This directory houses a dApp that imports the embedded widget.
`/widget/playground`: This directory offers a playground environment where you can test and obtain configurations for our widget.
`/widget/iframe`: This directory contains a JavaScript class that simplifies the process of adding our iframe-based widget to dApps.


## Release workflow

A release can be a lib or an app/client release. We are publishing our libs to `npm` and deploying our apps (client) on `vercel`.

If a package is app, you need to add the package name to `scripts/deploy/config.mjs` and then after getting a `PROJECT_ID` from Vercel, you need to set it as enviroment variable as well.

There are main commands:

`yarn run publish` for publishing our NPM packages.
`yarn run deploy` to deploy apps on Vercel.

### Publish

#### Prerelase

Our publish script will do these steps:

1. Get the last release (by using git tags) and calculate changes since then.
2. Bump the version for changed packages.
3. Create changelog, git tags and github release, and publish them to NPM.
4. Make a publish commit and push the updated packages (version) and tags to origin.

Note:
Libs will be published under `next` tag on npm, which means you need to use `yarn add @rango/test-package@next` to install the published version whenever you need.

#### Production relase

Release should be triggered manually and then it will automatically published. You only need to run this command on you local machine to release the production:

`yarn run release-prod`

After release (Green pipleline), make sure you will merge `main` into `next` as well. 

`yarn run post-release-prod`

### Deploy

You should manually trigger the `deploy` workflow.

By running `yarn run deploy`, it will build all the apps/clients then will try to deploy them on vercel.

If the workflow is running on `next` branch, it will be deployed as Vercel's `preview`. If not, it's production release.

All the apps published by `prerelase` workflow will be published under the Vercel's `preview` enviroment.

## Translation

First we need to extract the message from our source code using `yarn i18n:extract` and then we should run `yarn i18n:compile` to make a wrapper arround the translation file `.po` to be used inside our app.

### Adding a new language

1. Add to `locales: ['en']` in `lingui.config.ts`
2. Import and add to `messages` in `widget/ui/src/components/I18nManager/I18nManager.tsx`

## Crowdin

Crowdin CLI is command-line tool for management of your localization projects on Crowdin. According to https://crowdin.github.io/crowdin-cli/installation you can install crowdin in os or install globally with command `npm i -g @crowdin/cli`. With Crowdin CLI, you can upload source files by using `yarn i18n:push` and download translations by using `i18n:pull` for keep your localized content up-to-date.
The language code standard used is ISO 639-1. For more details and a list of codes, please refer to the https://www.loc.gov/standards/iso639-2/php/code_list.php .

In the `crowdin.yml` file, you will find the `project_id` and `api_token` values used for synchronizing translations with Crowdin. These values are read from the environment variables `REACT_APP_CROWDIN_PROJECT_ID` and `REACT_APP_CROWDIN_API_KEY` defined in the `.env` file.

## Technical Notes

### How we handle urls in embedded?

`embedded` is importing in different enviroments (iframe, import as react component and a separate `app`). When it's being used as a react component we let the dApp to use it inside its router and they can load the widget in a separate route (not root `/`, e.g. `/swaps`). In this context we can not use absolute paths because we don't know the basename set by user, so we need to always use relative paths. Relative paths has been defined in [URL spec](https://url.spec.whatwg.org/#urls) so we can be sure it's a long term solution and will work in future or by changing our router librart (e.g. `react-router`).

### HMR

We are using Parcel for our client developments, to HMR working properly, we need to point to source code (instead of dist) for Parcel to be able to detect changes on development. One approach was using `module` field, it's not standard but has meaning for some compiler/building tools, so we decided to use `source` which is a Parcel thing only.

You can check the details on #437 PR.

### Styles

We use CSS-in-JS for handling styles. To avoid potential issues with conflicting styles, we don't directly write specific class names. Instead, we prefer using custom tags. If we must use HTML tags with class names, we follow this pattern:

````html
<htmlTag className="{classNameStyle()}" />
````
 This helps keep our styles organized, reduces the chance of conflicts, and makes it easier to manage our code.
