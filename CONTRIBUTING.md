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

## Translation

First we need to extract the message from our source code using `yarn i18n:extract` and then we should run `yarn i18n:compile` to make a wrapper arround the translation file `.po` to be used inside our app.

### Adding a new language

1. Add to `locales: ['en']` in `lingui.config.ts`
2. Import and add to `messages` in `widget/ui/src/components/I18nManager/I18nManager.tsx`


## Crowdin

Our project uses Crowdin for managing translations. You need access to two secret keys:

- `CROWDIN_PROJECT_ID`: This secret key represents the project ID.
- `CROWDIN_PERSONAL_TOKEN`: Use this secret key for your Crowdin account.


 **Source and Translation Files:**

    - The source file is located at: `translations/en.po`
    - Translation files are located at: `translations/%two_letters_code%.po`
    
 **Workflow Execution:**

    - After each pull request merge into the `main` or `next` branch, the workflow is triggered.
    - The command `i18n:extract` is executed, capturing all new changes and uploading them to Crowdin.
    - The workflow then interacts with Crowdin, pushing new source content and pulling updated translations.
    - A pull request titled 'New Crowdin translations' is automatically created, incorporating the latest changes.
    - If the Crowdin pull request is successful, an automatic merge to the base branch is performed.

The language code standard used is ISO 639-1. For more details and a list of codes, please refer to the https://www.loc.gov/standards/iso639-2/php/code_list.php.

Additionally, there is the option to manually trigger the crowdin workflow if needed.


## Technical Notes

### How we handle urls in embedded?

`embedded` is importing in different environments (iframe, import as react component and a separate `app`). When it's being used as a react component we let the dApp to use it inside its router and they can load the widget in a separate route (not root `/`, e.g. `/swaps`). In this context we can not use absolute paths because we don't know the basename set by user, so we need to always use relative paths. Relative paths has been defined in [URL spec](https://url.spec.whatwg.org/#urls) so we can be sure it's a long term solution and will work in future or by changing our router librart (e.g. `react-router`).

### HMR

We are using Parcel for our client developments, to HMR working properly, we need to point to source code (instead of dist) for Parcel to be able to detect changes on development. One approach was using `module` field, it's not standard but has meaning for some compiler/building tools, so we decided to use `source` which is a Parcel thing only.

You can check the details on #437 PR.

### Styles

We use CSS-in-JS for handling styles. To avoid potential issues with conflicting styles, we don't directly write specific class names. Instead, we prefer using custom tags. If we must use HTML tags with class names, we follow this pattern:

````html
<htmlTag className="{classNameStyle()}" />
````
 This helps keep our styles organized, reduces the chance of conflicts, and makes it easier to manage our code.
