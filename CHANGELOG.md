## Widget [0.22.0] (2024-10-12)

_includes `@rango-dev/widget-embedded@0.34.0`_

### Bug Fixes

- bump sdk and fix type issues ([d442208](https://github.com/rango-exchange/rango-client/commit/d4422083bf5dd27d5f509ce1db7f9560d05428c8))
- resolve issues with the sign message method for certain solana providers ([cbe83a3](https://github.com/rango-exchange/rango-client/commit/cbe83a3da8b48560b206fc2a7fa7cf062cdeaa23))
- cosmostation wallet connection error ([b3747ba](https://github.com/rango-exchange/rango-client/commit/b3747ba77d06a5c02ce670affb337771e606434b))
- add chart icon and handle dark theme in BarChart component ([fd4f246](https://github.com/rango-exchange/rango-client/commit/fd4f24684e42deb1b47fb9a6584ac4f9a1519599))
- add prepare data function for chart package ([a9f8c6b](https://github.com/rango-exchange/rango-client/commit/a9f8c6b092ca5343756e220238c943dbc369a62b))
- fix issues in the tabs component ([497c387](https://github.com/rango-exchange/rango-client/commit/497c3871241f3e067682526c156014dcd8189395))

### Features

- add signature to versioned transactions ([d7f374b](https://github.com/rango-exchange/rango-client/commit/d7f374b460dc6a51e761614235575eb924f8d71a))
- introducing hub, our new wallet management ([92692fe](https://github.com/rango-exchange/rango-client/commit/92692fe7a05be72caea8b99bcc4ac5e2326f2f5a))
- add chart package ([f5ae7e4](https://github.com/rango-exchange/rango-client/commit/f5ae7e449ec1e385188ff904e9d59862fa8ef1d2))
- add id property to buttons ([39824e3](https://github.com/rango-exchange/rango-client/commit/39824e3ce8b1804b9944eb0faf71da7cdccf59ea))
- add mobile menu icons ([d4358bc](https://github.com/rango-exchange/rango-client/commit/d4358bc189a61c49c508c517b2cd674d435aa3b7))
- implement scrollable variant for tabs component ([0635f77](https://github.com/rango-exchange/rango-client/commit/0635f774af9dfd03fcc8f7adfcd32591c86efa25))

### Performance Improvements

- lazy load signer packages ([7b88f18](https://github.com/rango-exchange/rango-client/commit/7b88f1834f7b29b4b81ab6c81a07bb88e8ccf55c))
- enable code splitting in build process ([fe5a41e](https://github.com/rango-exchange/rango-client/commit/fe5a41e0e297298de11cd74ca5825544742aa03a))

## Widget [0.20.0] (2024-09-10)

_includes `@rango-dev/widget-embedded@0.33.0`_

### Bug Fixes

- add slippage icon to setting page ([2e29351](https://github.com/rango-exchange/rango-client/commit/2e29351d957f4e751a25f66b7cb173e5d9956378))
- clear timeout for success modal to avoid closing upcoming modals unexpectedly ([0d54a60](https://github.com/rango-exchange/rango-client/commit/0d54a6092e6a412b1497b9a3e26af6f669eea181))
- correct translation bugs ([0107f1d](https://github.com/rango-exchange/rango-client/commit/0107f1df7a587d9910c5376c4f99acd23b95e1a4))
- fix wallet state issue after retrying to fetch the balance following a failed attempt ([181bac3](https://github.com/rango-exchange/rango-client/commit/181bac3f54727847f8d16ff47164cce80aa64931))
- if state is on connecting, we should call disconnect in terminateconnectingWallets as well ([ad16056](https://github.com/rango-exchange/rango-client/commit/ad1605631df82e4d692f7e75999b2a5c51216958))
- improve header component to center the title properly ([a9929bb](https://github.com/rango-exchange/rango-client/commit/a9929bb518ccbb2033b646fbcb5c034852b039b2))
- reset derivation path if it's string and switching from custom mode ([c94c71a](https://github.com/rango-exchange/rango-client/commit/c94c71a94f3ac910ca13433ea616ce548559dc58))
- ensure proper cleanup of the modal component after it is removed from the dom ([394e4f0](https://github.com/rango-exchange/rango-client/commit/394e4f017eb09ac99f90a10be94ef8a742632586))
- fix incorrect error message on Trezor wallet transaction rejection ([3998563](https://github.com/rango-exchange/rango-client/commit/3998563fa06c694b34a61730b4f6c13f3323a407))
- fix solfare and solfare-snap signers ([896c70b](https://github.com/rango-exchange/rango-client/commit/896c70b8cc8b5e29ec6dfcd98378ef0b3f05698f))
- update signMessage in the default Solana signer to return a base58 string instead of base64 ([b60609b](https://github.com/rango-exchange/rango-client/commit/b60609b71d55ff205324aee87fb440d23cba5c79))

### Features

- export a new hook for handling required data for connect called useStateful ([0d00a45](https://github.com/rango-exchange/rango-client/commit/0d00a45b4434e0e2b53228a1d1c0be4fa579e21b))
- export StatefulConnect components and helpers ([c28a94b](https://github.com/rango-exchange/rango-client/commit/c28a94bd2721b4dbd16f9471f1cb0ddc45aa8904))
- implement bordered variant for tabs component ([1de8888](https://github.com/rango-exchange/rango-client/commit/1de8888d6d4ae13a765aaee0173eebf0d49f4a11))

## Widget [0.19.0] (2024-08-17)

_includes `@rango-dev/widget-embedded@0.32.1`_

### Features

- add functionality to support custom tokens ([a1aa0af](https://github.com/rango-exchange/rango-client/commit/a1aa0afed98f164488a3caffaaff2fd060ab8b3d))

## Widget [0.18.0] (2024-08-11)

_includes `@rango-dev/widget-embedded@0.31.0`_

### Bug Fixes

- address the issue where the token list does not update when the balance changes ([d1fb4e4](https://github.com/rango-exchange/rango-client/commit/d1fb4e4bb57e97cd730cba4c33ca0b2202600c09))
- fix bug in swap input handling empty value ([3c9b082](https://github.com/rango-exchange/rango-client/commit/3c9b082b7b548ddd3981fff100d4dc880581b98d))
- fix flicker in playground ([6ae2d58](https://github.com/rango-exchange/rango-client/commit/6ae2d588ba36822856a43cea7cabc3618cf72c11))
- fix missing usd value in estimated output ([a46d19a](https://github.com/rango-exchange/rango-client/commit/a46d19a80b4f6fc1ca29e289e1b6441e89aa730c))
- fix sort logic of notifications ([ffcf4c2](https://github.com/rango-exchange/rango-client/commit/ffcf4c2d70da7887e17042f3e6fe46224cd21fe1))
- fix wallet modal closing bug ([146f7e2](https://github.com/rango-exchange/rango-client/commit/146f7e24450be278aee53b03319399934cf84f17))
- recalculate supported tokens even if it's empty list ([8ccda6b](https://github.com/rango-exchange/rango-client/commit/8ccda6b2e246425102e6f6ab5f0d1edd131c6794))

### Features

- add derivation path modal for trezor wallet ([364422f](https://github.com/rango-exchange/rango-client/commit/364422f099b202a27a529591c5e3628bbb35508d))
- add filter and clear to widget history ([d43b603](https://github.com/rango-exchange/rango-client/commit/d43b603462feabf297d5be389fcaa35402d667b5))
- add functionality to update the quote inputs from outside the widget ([d9722fb](https://github.com/rango-exchange/rango-client/commit/d9722fbd5629ecb760b94a3d4a9ad7c0a07687ad))
- add preventable event and a new ui event called CLICK_CONNECT_WALLET ([e4363bb](https://github.com/rango-exchange/rango-client/commit/e4363bb6fb98d49b22c1b608ecf6d37650ff3035))
- add the option to define a default custom destination for each blockchain in the widget config ([7982ab6](https://github.com/rango-exchange/rango-client/commit/7982ab633dcb5b07ee5c313c9414d68baa6cbc38))
- changing the request ID copy process ([490cdfa](https://github.com/rango-exchange/rango-client/commit/490cdfa41131eea20d8a552f8f0714b77d21ac71))
- hide balance and max button when no wallet connected ([80b2754](https://github.com/rango-exchange/rango-client/commit/80b27547376394a3070aea7065d4bb9652f454e4))

### Performance Improvements

- improve token list performance by caching target tokens on load and config change ([3cc55ff](https://github.com/rango-exchange/rango-client/commit/3cc55ff95dde1f87f53efb2496e995beeb943b00))

## Widget [0.17.0] (2024-07-09)

_includes `@rango-dev/widget-embedded@0.30.0`_

### Bug Fixes

- fix tx data for evm signers when transfering native tokens ([a5d9f6e](https://github.com/rango-exchange/rango-client/commit/a5d9f6e3f5bada210a05c0d1f5c57d7917bf869c))
- import Trezor module ([cd71eb5](https://github.com/rango-exchange/rango-client/commit/cd71eb5f390f1b07974ea9e2368f35db383a8c82))
- fix the bug where xdefi is not displayed for experimental networks ([723eb2d](https://github.com/rango-exchange/rango-client/commit/723eb2dc3bfacce8753eeee011910b595d45028d))
- bug in updating input & output amount ([49c902b](https://github.com/rango-exchange/rango-client/commit/49c902be7adc1ba9ae7808f145ec975c724a728f))
- fix bug displaying the same token list for blockchains with the same number of tokens ([f4dc82f](https://github.com/rango-exchange/rango-client/commit/f4dc82f5f319f9133fac7d8a68023596a773cd96))
- improve generate colors for tokens label and price impact color ([5f2893c](https://github.com/rango-exchange/rango-client/commit/5f2893c03b17af24a8b3886e12b1631b5cc208fb))
- refactor numeric tooltip and fix missing translations ([59f1fb9](https://github.com/rango-exchange/rango-client/commit/59f1fb96027a9b51cea5f6362b247b6cf180d809))
- fix playground exported config bugs and slider color bug ([9505b63](https://github.com/rango-exchange/rango-client/commit/9505b6330363839aa5acc7abfdb6cd7288f946d6))
- fix state of custom destination in playground ([ae9cd78](https://github.com/rango-exchange/rango-client/commit/ae9cd783aebc797ffa98e2cd0fb87744ae92caf8))

### Features

- support new widget events ([37a9b6c](https://github.com/rango-exchange/rango-client/commit/37a9b6c023cba660c87af27bcbfceadfb8daa8d0))
- improve solana simulation failed errors ([c7ccb97](https://github.com/rango-exchange/rango-client/commit/c7ccb97cbdc571b615ee3129a8fcadd52cb0bc9f))
- add a modal for setting custom derivation path for ledger ([5b74ec0](https://github.com/rango-exchange/rango-client/commit/5b74ec049393ed74e3e7547edc72b68bd70b7dce))
- add support for Trezor hardware wallet ([6edecbb](https://github.com/rango-exchange/rango-client/commit/6edecbb14fd008fc741c892bfa3e025c10160b9b))
- integrate rabby wallet extension ([145fb8f](https://github.com/rango-exchange/rango-client/commit/145fb8ffbbf5e46e7e8386aeffcefc8f4ddb22e7))
- integrate tomo wallet extension ([9f0f065](https://github.com/rango-exchange/rango-client/commit/9f0f0650fcd213a621dcc6ddca3e32424c1a5ada))
- adding 'shadows' to widget config for theme ([2be1f1a](https://github.com/rango-exchange/rango-client/commit/2be1f1aa508fb642a797610471b63219cd3d2ccf))
- display all notifications in the notification popover ([c3eda22](https://github.com/rango-exchange/rango-client/commit/c3eda22cf1f06b928fdf0c98512fd444cc46823c))
- export useWalletList for use in dapp ([e5fb662](https://github.com/rango-exchange/rango-client/commit/e5fb662adc119fb341db2c6c68b3b9e45c0353a2))
- make update settings optional to make it enable in playground ([c13a902](https://github.com/rango-exchange/rango-client/commit/c13a902fba9a03b111bde6fed02a1f3a081ee590))
- add credit and disconnect icons ([b5e5357](https://github.com/rango-exchange/rango-client/commit/b5e5357cf3a5b13f602b8d5cdb829f3699ee3197))

### Performance Improvements

- improve finding tokens from store ([3e890bd](https://github.com/rango-exchange/rango-client/commit/3e890bdcd47971b072f347c368c4370225cb11ff))

## Playground [0.17.0] (2024-07-09)

### Bug Fixes

- fix playground exported config bugs and slider color bug ([9505b63](https://github.com/rango-exchange/rango-client/commit/9505b6330363839aa5acc7abfdb6cd7288f946d6))
- fix state of custom destination in playground ([ae9cd78](https://github.com/rango-exchange/rango-client/commit/ae9cd783aebc797ffa98e2cd0fb87744ae92caf8))

### Features

- make update settings optional to make it enable in playground ([c13a902](https://github.com/rango-exchange/rango-client/commit/c13a902fba9a03b111bde6fed02a1f3a081ee590))

## Widget [0.16.0] (2024-06-01)

_includes `@rango-dev/widget-embedded@0.29.0`_

### Bug Fixes

- update design for not-selected blockchain or token ([8915101](https://github.com/rango-exchange/rango-client/commit/8915101d4e7a7092fbb5f38bbd95789e124f8ae3))
- resolve custom slippage bug ([54bef0f](https://github.com/rango-exchange/rango-client/commit/54bef0f6d73d1078ab170e8b049a6aa311fff02d))
- sync notifications with persisted swaps ([2ecaf38](https://github.com/rango-exchange/rango-client/commit/2ecaf38750dacc828ebaee7f8348b502a7645a88))
- exclude ledger on mobile and fix injected wallet bug ([a6d90aa](https://github.com/rango-exchange/rango-client/commit/a6d90aa01b7b1fcea01ab46d1a74583ff6f98ff8))
- fix init config minor bug ([7d671e3](https://github.com/rango-exchange/rango-client/commit/7d671e336050cd4d4cc0589cfd83e341421fe859))
- fix the automatic selection of the connected wallets in the confirm wallets modal ([0b85d81](https://github.com/rango-exchange/rango-client/commit/0b85d81bc9ce6ec055e832e37eb6289a1b107d39))

### Features

- update wallets page to add filter by transaction types ([0aa7c73](https://github.com/rango-exchange/rango-client/commit/0aa7c73333bd32912f7b2e90a660f3f43e64f4f7))
- add more predefined fonts list from google fonts ([693f257](https://github.com/rango-exchange/rango-client/commit/693f25790497f6829dd74c800d3d5574d8ee0bed))
- add custom solana rpc url to config ([8d46ebf](https://github.com/rango-exchange/rango-client/commit/8d46ebf4fcd58c7ecd180ea29c071176c0f863e9))
- add an option to wallet connect provider to open a desktop wallet directly ([bee0a1f](https://github.com/rango-exchange/rango-client/commit/bee0a1f57ef5470564f6cdc379d00981e7d34b0a))
- update explorer icon and add paste to custom destination ([61468a0](https://github.com/rango-exchange/rango-client/commit/61468a0e227517b91def21a85a8f7d72b7411862))
- generate theme color tints and shades using the new method of overriding them separately ([a46b8a9](https://github.com/rango-exchange/rango-client/commit/a46b8a93bff1d8d6766c2fd636091983a8ee1baa))

## Widget [0.15.0] (2024-05-14)

_includes `@rango-dev/widget-embedded@0.28.0`_

### Features

- add solana to ledger ([77b6695](https://github.com/rango-exchange/rango-client/commit/77b6695758165f9258a0ba5bd3b2cf39b0b2aab5))
- improve all routes button ([efcb61e](https://github.com/rango-exchange/rango-client/commit/efcb61ee5920b1a05c44dfa8edf23dc8d3d7f035))
- migrate storybook components to new package ([d926ae2](https://github.com/rango-exchange/rango-client/commit/d926ae220360077ef49ee919dbb2e15f6bec0548))
- add test to check workflow ([69a4c3e](https://github.com/rango-exchange/rango-client/commit/69a4c3e144a7e9cd1ce24c3a2f7a3d7a4b4a1eab))
- add auto retry for fetching confirm swap ([5945d82](https://github.com/rango-exchange/rango-client/commit/5945d82030b89006f5c62c8f5ce5d492cc2ed220))
- add a new package to deploy the storybook preview ([06aaa44](https://github.com/rango-exchange/rango-client/commit/06aaa444408f07c7a053432af081c9758f157052))
- detect proper error related to wallet connect params ([a0d8d95](https://github.com/rango-exchange/rango-client/commit/a0d8d95ed977fffbd0244f498c81f7ce3550ee71))
- clean solana signer simulation errors ([5d623ab](https://github.com/rango-exchange/rango-client/commit/5d623ab632945cb28581ea896fb95d7c84f92607))

### Bug Fixes

- fix the entrance animation of the confirm wallets modal ([1907ad2](https://github.com/rango-exchange/rango-client/commit/1907ad25cef2a25c303e2c91194dbae2b8e6fd56))
- fix space between of routes and swap box in expanded mode ([cbca33e](https://github.com/rango-exchange/rango-client/commit/cbca33ef31d634466b6595ee01fa337952076b89))
- fix multiwallets config initial value check bug ([94dbf07](https://github.com/rango-exchange/rango-client/commit/94dbf074ab51f56bf1267cb668be4e58781554bf))
- fix bugs in fetching quotes ([2b533ea](https://github.com/rango-exchange/rango-client/commit/2b533ead6fa90d2d8b3d9b8de2699072cc57d55b))
- display the swapper's title instead of the swapper's group as their displayed name ([1142d94](https://github.com/rango-exchange/rango-client/commit/1142d9417e690bf4b0093ee84e42352dab149793))

## Widget (2024-05-08)

_includes `@rango-dev/widget-embedded@0.27.3`_

### Bug Fixes

- disable the confirm wallet button if all required wallets are not selected ([521883f](https://github.com/rango-exchange/rango-client/commit/521883f9e381d311bf0cdad275b234646da2a648))

## Widget (2024-04-27)

_includes `@rango-dev/widget-embedded@0.27.2`_

### Bug Fixes

- make sure to correctly pass validation parameters when setting up a new swap ([4f6d37e](https://github.com/rango-exchange/rango-client/commit/4f6d37ea9b59caca4d0064c1b33b05077b0b59a3))

## Widget (2024-04-24)

_includes `@rango-dev/widget-embedded@0.27.1`_

### Features

- add ethereum for ledger ([084aae2](https://github.com/rango-exchange/rango-client/commit/084aae28adaf0310dffe3a3100dd783252393053))

## Widget (2024-04-23)

_includes `@rango-dev/widget-embedded@0.27.0`_

### Bug Fixes

- address passing wallet-connect project id ([80a6b80](https://github.com/rango-exchange/rango-client/commit/80a6b8046cc93bc8e88b84a201331b2e7adc0c73))
- fix token selector hover ui for token explorer link ([ede0fac](https://github.com/rango-exchange/rango-client/commit/ede0fac0e987b0cd6983ccd427207d78f65eeb96))
- fix token selector infinite loader ([1122dd6](https://github.com/rango-exchange/rango-client/commit/1122dd6db1fecadd41d56f22d5dfd95fbaa645a0))
- remove setting option from confirm swap page ([1f204c1](https://github.com/rango-exchange/rango-client/commit/1f204c1ebf544348a2969aa35c2cf8c9841ea3ff))
- improve solana transaction sign flow ([65b7be0](https://github.com/rango-exchange/rango-client/commit/65b7be0ce02bed88c98280999b615bc405e95cb6))
- set current state for current network in conencting multi-chain wallets ([dc62af0](https://github.com/rango-exchange/rango-client/commit/dc62af03f0edc10400394ba600c7d83e1250b4e8))
- resolve conflicts between evm providers ([9a6734c](https://github.com/rango-exchange/rango-client/commit/9a6734cf1537bf0504cf9058d4d775313a9e8e80))

### Features

- add solflare snap connect and signer ([42aa2b0](https://github.com/rango-exchange/rango-client/commit/42aa2b039dd910e8e44db473e1acd28689a8b43b))
- add animation for switch swap button ([601af2d](https://github.com/rango-exchange/rango-client/commit/601af2dde7ed87c7aa803cb0b79a13c21ff0386d))
- add unit test for app store ([9df49a8](https://github.com/rango-exchange/rango-client/commit/9df49a8aaf0d03fea01d9e9790953c7326e8999d))

---

You can use the following template:

## Widget or Playground [VERSION] (DATE)

_includes `@rango-dev/widget-embedded@VERSION`_

### Bug Fixes

- commit message

### Features

- commit message
