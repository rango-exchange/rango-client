# Prerelease

## Getting started

Before release, please ensure the following steps are taken.

First, Send a notice to your team to let them know `next` should be locked until release. After releasing, inform them of the result and unlock the `next` branch.

Second, To identify changes since the last release, use the following commands:

**Get last release commit:**

```shell
git rev-list --max-count 1 --tags
```

**Get commits since last release:**

```shell
git log --oneline --no-merges main..next
```

**Get file names that has changed since last release:**

```shell
git diff --name-only origin/main
```

For a specific path:

```shell
git diff --name-only origin/main wallets/
```

**Check the excat changes on files since last release using VSCode:**

Ensure you've added this config to your `~/.gitconfig`

```shell
[diff]
  tool = default-difftool
[difftool "default-difftool"]
  cmd = code --wait --diff $LOCAL $REMOTE
```

Then, open files with the following command:

```shell
git difftool origin/main -y 
```

For a specific path:

```shell
git difftool origin/main -y wallets/
```

Note: The `-y` flag disables the prompt in the terminal.

## Testing

Before each release, we are doing some manual tests on different environments to make sure critical flows working correctly. Ensure the widget works as expected on Chrome and Firefox.

### Environments

#### Codesandbox

You can use the following Codesandbox template:
https://codesandbox.io/p/sandbox/mystifying-haze-fdmkv6

#### widget-examples

You can find it here:
https://github.com/rango-exchange/widget-examples

Update `widget-embedded` version to latest ***next*** version using this command:

```shell
yarn add @rango-dev/widget-embedded@next
```

Note: don’t commit your changes to the repo, We will doing it after  release the production successfully which means we only commit `production` version to the repo. More details is on `Post Release` document.

#### Playground

You will need following commands on `rango-client` repo:

```shell
git checkout next
git pull
yarn clean
yarn build:all
yarn dev:playground
```

#### Vercel

TBA

#### Wallet's Browser

TBA

### Testing scenarios

First, you will need to get a list of commits since the last release and check those areas first.

Then:

- Doing a single and multistep swap
  - USDT (Polygon) -> USDC (Polygon): That would be great to check switch network by changing your network to not be on Polygon.
  - Sol (Solana)-> Atom (Cosmos)
- Check your history
- Change settings (Language, Theme)

## Release

Follow these steps for the release:

1. Manually run the `Production Release` workflow.
2. Run the `Deploy` workflow if the publish was successful.
3. Promote our clients (widget and playground) to production on Vercel (ask the team if you don't have access).

For detailed information on how the release works, refer to `docs/release.md`.

**NOTE 1:**

Ensure you send a highlight note on Telegram [like this](https://t.me/c/1797229876/15255/23609) at the end.

**NOTE 2:**

Ensure you update widget-examples using `yarn add @rango-dev/widget-embedded@latest`. Then open a new PR on the repo to ensure all examples are on the latest version.
