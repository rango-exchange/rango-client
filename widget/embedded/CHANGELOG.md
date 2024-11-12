# [0.35.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.34.5...widget-embedded@0.35.0) (2024-11-12)


### Features

* add more languages to widget ([bc37fe9](https://github.com/rango-exchange/rango-client/commit/bc37fe97586545f993d7a2675a43b64aaa743791))



## [0.34.5](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.34.4...widget-embedded@0.34.5) (2024-11-06)



## [0.34.4](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.34.3...widget-embedded@0.34.4) (2024-11-06)



## [0.34.3](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.34.2...widget-embedded@0.34.3) (2024-11-06)



## [0.34.2](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.34.1...widget-embedded@0.34.2) (2024-11-06)



## [0.34.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.34.0...widget-embedded@0.34.1) (2024-10-30)



# [0.34.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.33.3...widget-embedded@0.34.0) (2024-10-12)


### Bug Fixes

* bump sdk and fix type issues ([d442208](https://github.com/rango-exchange/rango-client/commit/d4422083bf5dd27d5f509ce1db7f9560d05428c8))


### Features

* add id property to buttons ([39824e3](https://github.com/rango-exchange/rango-client/commit/39824e3ce8b1804b9944eb0faf71da7cdccf59ea))



## [0.33.3](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.33.2...widget-embedded@0.33.3) (2024-10-05)



## [0.33.2](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.33.1...widget-embedded@0.33.2) (2024-09-25)



## [0.33.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.33.0...widget-embedded@0.33.1) (2024-09-16)



# [0.33.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.32.1...widget-embedded@0.33.0) (2024-09-10)


### Bug Fixes

* add slippage icon to setting page ([2e29351](https://github.com/rango-exchange/rango-client/commit/2e29351d957f4e751a25f66b7cb173e5d9956378))
* clear timeout for success modal to avoid closing upcoming modals unexpectedly ([0d54a60](https://github.com/rango-exchange/rango-client/commit/0d54a6092e6a412b1497b9a3e26af6f669eea181))
* correct translation bugs ([0107f1d](https://github.com/rango-exchange/rango-client/commit/0107f1df7a587d9910c5376c4f99acd23b95e1a4))
* fix wallet state issue after retrying to fetch the balance following a failed attempt ([181bac3](https://github.com/rango-exchange/rango-client/commit/181bac3f54727847f8d16ff47164cce80aa64931))
* if state is on connecting, we should call disconnect in terminateconnectingWallets as well ([ad16056](https://github.com/rango-exchange/rango-client/commit/ad1605631df82e4d692f7e75999b2a5c51216958))
* improve header component to center the title properly ([a9929bb](https://github.com/rango-exchange/rango-client/commit/a9929bb518ccbb2033b646fbcb5c034852b039b2))
* reset derivation path if it's string and switching from custom mode ([c94c71a](https://github.com/rango-exchange/rango-client/commit/c94c71a94f3ac910ca13433ea616ce548559dc58))


### Features

* export a new hook for handling required data for connect called useStateful ([0d00a45](https://github.com/rango-exchange/rango-client/commit/0d00a45b4434e0e2b53228a1d1c0be4fa579e21b))
* export StatefulConnect components and helpers ([c28a94b](https://github.com/rango-exchange/rango-client/commit/c28a94bd2721b4dbd16f9471f1cb0ddc45aa8904))



## [0.32.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.32.0...widget-embedded@0.32.1) (2024-08-17)



# [0.32.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.31.0...widget-embedded@0.32.0) (2024-08-17)


### Features

* add functionality to support custom tokens ([a1aa0af](https://github.com/rango-exchange/rango-client/commit/a1aa0afed98f164488a3caffaaff2fd060ab8b3d))



# [0.31.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.30.1...widget-embedded@0.31.0) (2024-08-11)


### Bug Fixes

* address the issue where the token list does not update when the balance changes ([d1fb4e4](https://github.com/rango-exchange/rango-client/commit/d1fb4e4bb57e97cd730cba4c33ca0b2202600c09))
* fix bug in swap input handling empty value ([3c9b082](https://github.com/rango-exchange/rango-client/commit/3c9b082b7b548ddd3981fff100d4dc880581b98d))
* fix flicker in playground ([6ae2d58](https://github.com/rango-exchange/rango-client/commit/6ae2d588ba36822856a43cea7cabc3618cf72c11))
* fix missing usd value in estimated output ([a46d19a](https://github.com/rango-exchange/rango-client/commit/a46d19a80b4f6fc1ca29e289e1b6441e89aa730c))
* fix sort logic of notifications ([ffcf4c2](https://github.com/rango-exchange/rango-client/commit/ffcf4c2d70da7887e17042f3e6fe46224cd21fe1))
* fix wallet modal closing bug ([146f7e2](https://github.com/rango-exchange/rango-client/commit/146f7e24450be278aee53b03319399934cf84f17))
* recalculate supported tokens even if it's empty list ([8ccda6b](https://github.com/rango-exchange/rango-client/commit/8ccda6b2e246425102e6f6ab5f0d1edd131c6794))


### Features

* add derivation path modal for trezor wallet ([364422f](https://github.com/rango-exchange/rango-client/commit/364422f099b202a27a529591c5e3628bbb35508d))
* add filter and clear to widget history ([d43b603](https://github.com/rango-exchange/rango-client/commit/d43b603462feabf297d5be389fcaa35402d667b5))
* add functionality to update the quote inputs from outside the widget ([d9722fb](https://github.com/rango-exchange/rango-client/commit/d9722fbd5629ecb760b94a3d4a9ad7c0a07687ad))
* add preventable event and a new ui event called CLICK_CONNECT_WALLET ([e4363bb](https://github.com/rango-exchange/rango-client/commit/e4363bb6fb98d49b22c1b608ecf6d37650ff3035))
* add the option to define a default custom destination for each blockchain in the widget config ([7982ab6](https://github.com/rango-exchange/rango-client/commit/7982ab633dcb5b07ee5c313c9414d68baa6cbc38))
* changing the request ID copy process ([490cdfa](https://github.com/rango-exchange/rango-client/commit/490cdfa41131eea20d8a552f8f0714b77d21ac71))
* hide balance and max button when no wallet connected ([80b2754](https://github.com/rango-exchange/rango-client/commit/80b27547376394a3070aea7065d4bb9652f454e4))


### Performance Improvements

* improve token list performance by caching target tokens on load and config change ([3cc55ff](https://github.com/rango-exchange/rango-client/commit/3cc55ff95dde1f87f53efb2496e995beeb943b00))



## [0.30.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.30.0...widget-embedded@0.30.1) (2024-07-14)



# [0.30.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.28.2...widget-embedded@0.30.0) (2024-07-09)


### Bug Fixes

*  fix playground exported config bugs and slider color bug ([9505b63](https://github.com/rango-exchange/rango-client/commit/9505b6330363839aa5acc7abfdb6cd7288f946d6))
* bug in updating input & output amount ([49c902b](https://github.com/rango-exchange/rango-client/commit/49c902be7adc1ba9ae7808f145ec975c724a728f))
* exclud ledger on mobile and fix injected wallet bug ([a6d90aa](https://github.com/rango-exchange/rango-client/commit/a6d90aa01b7b1fcea01ab46d1a74583ff6f98ff8))
* fix bug displaying the same token list for blockchains with the same number of tokens ([f4dc82f](https://github.com/rango-exchange/rango-client/commit/f4dc82f5f319f9133fac7d8a68023596a773cd96))
* fix init config minor bug ([7d671e3](https://github.com/rango-exchange/rango-client/commit/7d671e336050cd4d4cc0589cfd83e341421fe859))
* fix state of custom destination in playground ([ae9cd78](https://github.com/rango-exchange/rango-client/commit/ae9cd783aebc797ffa98e2cd0fb87744ae92caf8))
* fix the automatic selection of the connected wallets in the confirm wallets modal ([0b85d81](https://github.com/rango-exchange/rango-client/commit/0b85d81bc9ce6ec055e832e37eb6289a1b107d39))
* improve generate colors for tokens label and price impact color ([5f2893c](https://github.com/rango-exchange/rango-client/commit/5f2893c03b17af24a8b3886e12b1631b5cc208fb))
* rerfactor numeric tooltip and fix missing translations ([59f1fb9](https://github.com/rango-exchange/rango-client/commit/59f1fb96027a9b51cea5f6362b247b6cf180d809))
* resolve custom slippage bug ([54bef0f](https://github.com/rango-exchange/rango-client/commit/54bef0f6d73d1078ab170e8b049a6aa311fff02d))
* sync notifications with persisted swaps ([2ecaf38](https://github.com/rango-exchange/rango-client/commit/2ecaf38750dacc828ebaee7f8348b502a7645a88))
* update design for not-selected blockchain or token ([8915101](https://github.com/rango-exchange/rango-client/commit/8915101d4e7a7092fbb5f38bbd95789e124f8ae3))


### Features

* add a modal for setting custom derivation path for ledger ([5b74ec0](https://github.com/rango-exchange/rango-client/commit/5b74ec049393ed74e3e7547edc72b68bd70b7dce))
* add an option to wallet connect provider to open a desktop wallet directly ([bee0a1f](https://github.com/rango-exchange/rango-client/commit/bee0a1f57ef5470564f6cdc379d00981e7d34b0a))
* add custom solana rpc url to config ([8d46ebf](https://github.com/rango-exchange/rango-client/commit/8d46ebf4fcd58c7ecd180ea29c071176c0f863e9))
* add more predefined fonts list from google fonts ([693f257](https://github.com/rango-exchange/rango-client/commit/693f25790497f6829dd74c800d3d5574d8ee0bed))
* add support for Trezor hardware wallet ([6edecbb](https://github.com/rango-exchange/rango-client/commit/6edecbb14fd008fc741c892bfa3e025c10160b9b))
* adding 'shadows' to widget config for theme ([2be1f1a](https://github.com/rango-exchange/rango-client/commit/2be1f1aa508fb642a797610471b63219cd3d2ccf))
* display all notifications in the notification popover ([c3eda22](https://github.com/rango-exchange/rango-client/commit/c3eda22cf1f06b928fdf0c98512fd444cc46823c))
* export useWalletList for use in dapp ([e5fb662](https://github.com/rango-exchange/rango-client/commit/e5fb662adc119fb341db2c6c68b3b9e45c0353a2))
* generate theme color tints and shades using the new method of overriding them separately ([a46b8a9](https://github.com/rango-exchange/rango-client/commit/a46b8a93bff1d8d6766c2fd636091983a8ee1baa))
* make update settings optional to make it enable in playground ([c13a902](https://github.com/rango-exchange/rango-client/commit/c13a902fba9a03b111bde6fed02a1f3a081ee590))
* support new widget events ([37a9b6c](https://github.com/rango-exchange/rango-client/commit/37a9b6c023cba660c87af27bcbfceadfb8daa8d0))
* update explorer icon and add paste to custom destination ([61468a0](https://github.com/rango-exchange/rango-client/commit/61468a0e227517b91def21a85a8f7d72b7411862))
* update wallets page to add filter by transaction types (category) ([0aa7c73](https://github.com/rango-exchange/rango-client/commit/0aa7c73333bd32912f7b2e90a660f3f43e64f4f7))


### Performance Improvements

* improve finding tokens from store ([3e890bd](https://github.com/rango-exchange/rango-client/commit/3e890bdcd47971b072f347c368c4370225cb11ff))



# [0.29.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.28.2...widget-embedded@0.29.0) (2024-06-01)


### Bug Fixes

* exclud ledger on mobile and fix injected wallet bug ([a6d90aa](https://github.com/rango-exchange/rango-client/commit/a6d90aa01b7b1fcea01ab46d1a74583ff6f98ff8))
* fix init config minor bug ([7d671e3](https://github.com/rango-exchange/rango-client/commit/7d671e336050cd4d4cc0589cfd83e341421fe859))
* fix the automatic selection of the connected wallets in the confirm wallets modal ([0b85d81](https://github.com/rango-exchange/rango-client/commit/0b85d81bc9ce6ec055e832e37eb6289a1b107d39))
* resolve custom slippage bug ([54bef0f](https://github.com/rango-exchange/rango-client/commit/54bef0f6d73d1078ab170e8b049a6aa311fff02d))
* sync notifications with persisted swaps ([2ecaf38](https://github.com/rango-exchange/rango-client/commit/2ecaf38750dacc828ebaee7f8348b502a7645a88))
* update design for not-selected blockchain or token ([8915101](https://github.com/rango-exchange/rango-client/commit/8915101d4e7a7092fbb5f38bbd95789e124f8ae3))


### Features

* add an option to wallet connect provider to open a desktop wallet directly ([bee0a1f](https://github.com/rango-exchange/rango-client/commit/bee0a1f57ef5470564f6cdc379d00981e7d34b0a))
* add custom solana rpc url to config ([8d46ebf](https://github.com/rango-exchange/rango-client/commit/8d46ebf4fcd58c7ecd180ea29c071176c0f863e9))
* add more predefined fonts list from google fonts ([693f257](https://github.com/rango-exchange/rango-client/commit/693f25790497f6829dd74c800d3d5574d8ee0bed))
* generate theme color tints and shades using the new method of overriding them separately ([a46b8a9](https://github.com/rango-exchange/rango-client/commit/a46b8a93bff1d8d6766c2fd636091983a8ee1baa))
* update explorer icon and add paste to custom destination ([61468a0](https://github.com/rango-exchange/rango-client/commit/61468a0e227517b91def21a85a8f7d72b7411862))
* update wallets page to add filter by transaction types (category) ([0aa7c73](https://github.com/rango-exchange/rango-client/commit/0aa7c73333bd32912f7b2e90a660f3f43e64f4f7))



## [0.28.2](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.28.1...widget-embedded@0.28.2) (2024-05-26)



## [0.28.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.28.0...widget-embedded@0.28.1) (2024-05-25)



# [0.28.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.27.3...widget-embedded@0.28.0) (2024-05-14)


### Bug Fixes

* display the swapper's title instead of the swapper's group as their displayed name ([1142d94](https://github.com/rango-exchange/rango-client/commit/1142d9417e690bf4b0093ee84e42352dab149793))
* fix bugs in fetching quotes ([2b533ea](https://github.com/rango-exchange/rango-client/commit/2b533ead6fa90d2d8b3d9b8de2699072cc57d55b))
* fix multiwallets config initial value check bug ([94dbf07](https://github.com/rango-exchange/rango-client/commit/94dbf074ab51f56bf1267cb668be4e58781554bf))
* fix space between of routes and swap box in expanded mode ([cbca33e](https://github.com/rango-exchange/rango-client/commit/cbca33ef31d634466b6595ee01fa337952076b89))
* fix the entrance animation of the confirm wallets modal ([1907ad2](https://github.com/rango-exchange/rango-client/commit/1907ad25cef2a25c303e2c91194dbae2b8e6fd56))


### Features

* add auto retry for fetching confirm swap ([5945d82](https://github.com/rango-exchange/rango-client/commit/5945d82030b89006f5c62c8f5ce5d492cc2ed220))
* add solana to ledger ([77b6695](https://github.com/rango-exchange/rango-client/commit/77b6695758165f9258a0ba5bd3b2cf39b0b2aab5))
* add test to check workflow ([69a4c3e](https://github.com/rango-exchange/rango-client/commit/69a4c3e144a7e9cd1ce24c3a2f7a3d7a4b4a1eab))
* detect proper error related to wallet connect params ([a0d8d95](https://github.com/rango-exchange/rango-client/commit/a0d8d95ed977fffbd0244f498c81f7ce3550ee71))
* improve all routes button ([efcb61e](https://github.com/rango-exchange/rango-client/commit/efcb61ee5920b1a05c44dfa8edf23dc8d3d7f035))



## [0.27.3](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.27.2...widget-embedded@0.27.3) (2024-05-08)


### Bug Fixes

* disable the confirm wallet button if all required wallets are not selected ([521883f](https://github.com/rango-exchange/rango-client/commit/521883f9e381d311bf0cdad275b234646da2a648))



## [0.27.2](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.27.1...widget-embedded@0.27.2) (2024-04-27)


### Bug Fixes

* make sure to correctly pass validation parameters when setting up a new swap ([4f6d37e](https://github.com/rango-exchange/rango-client/commit/4f6d37ea9b59caca4d0064c1b33b05077b0b59a3))



## [0.27.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.27.0...widget-embedded@0.27.1) (2024-04-24)



# [0.27.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.26.0...widget-embedded@0.27.0) (2024-04-24)



# [0.26.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.25.0...widget-embedded@0.26.0) (2024-04-23)


### Bug Fixes

* address passing wallet-connect project id ([80a6b80](https://github.com/rango-exchange/rango-client/commit/80a6b8046cc93bc8e88b84a201331b2e7adc0c73))
* fix token selector hover ui for token explorer link ([ede0fac](https://github.com/rango-exchange/rango-client/commit/ede0fac0e987b0cd6983ccd427207d78f65eeb96))
* fix token selector infinite loader ([1122dd6](https://github.com/rango-exchange/rango-client/commit/1122dd6db1fecadd41d56f22d5dfd95fbaa645a0))
* remove setting option from confirm swap page ([1f204c1](https://github.com/rango-exchange/rango-client/commit/1f204c1ebf544348a2969aa35c2cf8c9841ea3ff))


### Features

* add animation for switch swap button ([601af2d](https://github.com/rango-exchange/rango-client/commit/601af2dde7ed87c7aa803cb0b79a13c21ff0386d))
* add unit test for app store ([9df49a8](https://github.com/rango-exchange/rango-client/commit/9df49a8aaf0d03fea01d9e9790953c7326e8999d))



# [0.25.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.24.1...widget-embedded@0.25.0) (2024-04-09)


### Bug Fixes

* address tooltips position ([5ee60d1](https://github.com/rango-exchange/rango-client/commit/5ee60d1622dab29091d97578d417a2187f2ca6cf))
* correct showing wallets on mobile screens ([89ead7f](https://github.com/rango-exchange/rango-client/commit/89ead7f68e88352dfd69c2a3d1c6cb0b8cf2e5d5))
* fix export refresh modal ([0c0ec6c](https://github.com/rango-exchange/rango-client/commit/0c0ec6c7f22116a9b5d5c8d2b6a74ebf421fc015))
* fix widget event hook ([c8547b6](https://github.com/rango-exchange/rango-client/commit/c8547b6a31354afe13aa32c0b72be5b62b3f0d67))


### Features

* attach config object to window for debugging purposes ([70597b7](https://github.com/rango-exchange/rango-client/commit/70597b78e31ef2da1ef2d20ed398e5bdf0b59a63))
* implement hover state for full-expanded-route ([1c851d7](https://github.com/rango-exchange/rango-client/commit/1c851d7c62b71fe8f4aa6c05edbc0d6cc78d5437))
* show a modal with page reload when meta hasn't loaded ([0d3842f](https://github.com/rango-exchange/rango-client/commit/0d3842f9c2d7210cfd5a967d1f0e663ef3125421))



## [0.24.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.24.0...widget-embedded@0.24.1) (2024-03-12)



# [0.24.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.23.0...widget-embedded@0.24.0) (2024-03-12)


### Bug Fixes

* add a default variant to widget config store ([5f7c18e](https://github.com/rango-exchange/rango-client/commit/5f7c18e54d88ca44eb86de6fff6c252599d3adb9))
* apply minor improvements to the widget ([c4454e5](https://github.com/rango-exchange/rango-client/commit/c4454e5c3dd1257b48d18a975cb3d1ac19ce3f26))
* close completeModal when requestId is changed ([f00bee8](https://github.com/rango-exchange/rango-client/commit/f00bee8f9852f66157517c9a4d0bebf38b9a961d))
* correct default values of hidden features ([10ac5cf](https://github.com/rango-exchange/rango-client/commit/10ac5cf6db419567cc439db785615b00565461d7))
* correct height of widget & address full-expanded hover & spacing ([6390316](https://github.com/rango-exchange/rango-client/commit/639031622644ee99d3e708f1a783c16e7268fa20))
* correct set-as-read behavior in swap-details ([b0b5310](https://github.com/rango-exchange/rango-client/commit/b0b53103aef10083c2887f61bf68356eb26698e6))
* correct sharp styles in swap inputs in different variants ([8fd3232](https://github.com/rango-exchange/rango-client/commit/8fd3232f9353537da2dfdefd201d7f15b17b2434))
* default theme shouldn't be override on what user has set ([6e64239](https://github.com/rango-exchange/rango-client/commit/6e64239873bd673279bd163f5b54e49744b8abc2))
* fix bugs in displaying quote error modals ([c72a21e](https://github.com/rango-exchange/rango-client/commit/c72a21e233e48b20a9af0cf44d334fb752b1988b))
* fix console warning in widget ([d2353f2](https://github.com/rango-exchange/rango-client/commit/d2353f21945d38cfef4051d80b9577b7ab4da620))
* fix default injected wallet display logic and catch unhandled errors ([6654fcc](https://github.com/rango-exchange/rango-client/commit/6654fcc73481ac8e572da92be4346e059613febe))
* fix full expanded design issues ([d1aaaa3](https://github.com/rango-exchange/rango-client/commit/d1aaaa30404da6ef8c1ff264a52e718db74f438f))
* fix queue manager context in widget embedded ([312fe8c](https://github.com/rango-exchange/rango-client/commit/312fe8cfef6b5adb245c81f303694142cb99641b))
* fix unmounting router on changing language ([80e96dd](https://github.com/rango-exchange/rango-client/commit/80e96ddabd863a65f5e94d6631aecd23f9d12126))
* fix widget icon size issue and add connected wallet tooltip ([476267f](https://github.com/rango-exchange/rango-client/commit/476267feea9e176829a6df4bf0dbe6eef5ad4366))
* get theme from config when singleTheme is true ([8fa3caa](https://github.com/rango-exchange/rango-client/commit/8fa3caa2cf2965923c6427187283ecf53737c792))
* improve search token ([2f7bacc](https://github.com/rango-exchange/rango-client/commit/2f7bacc5358d4fc6da21c0883e46d49293f98a33))
* remove redundant punctuation from settings page ([51f3825](https://github.com/rango-exchange/rango-client/commit/51f3825fb4a1073de5baef7b9fa988990e2a7d36))


### Features

* add an expand mode for our compact widget ([eb90daa](https://github.com/rango-exchange/rango-client/commit/eb90daa540592c81efdca6e33032f6dbef371180))
* add enabling centralized swappers to config ([55f6f7d](https://github.com/rango-exchange/rango-client/commit/55f6f7d746aeab4dc65421c641c920c8687712d3))
* add full expanded variant to widget ([a3907a0](https://github.com/rango-exchange/rango-client/commit/a3907a0be9f0716c366a2c482253191eebd66301))
* add more languages to widget ([04f7855](https://github.com/rango-exchange/rango-client/commit/04f78551784b52e286f7f6206337d97bf8401063))
* add sort filter for multi routing (compact mode) ([d90ddc6](https://github.com/rango-exchange/rango-client/commit/d90ddc6959c63a1ec2ef5908c09fc6ab8c3da23c))
* implement expanded-mode route ([e75fcad](https://github.com/rango-exchange/rango-client/commit/e75fcad751dfdce0c4d84d08f2c9b41935584a75))
* improve header buttons and notifications ([5f2188d](https://github.com/rango-exchange/rango-client/commit/5f2188d5cae62576bf13a5cefdc83625b9910c11))
* improve playground mobile view and widget variants and liquidity sources ([3c2a4a6](https://github.com/rango-exchange/rango-client/commit/3c2a4a6375818d01a4c6682e03a60aa6972a8a02))
* redesign switching theme in settings ([7fe0bc5](https://github.com/rango-exchange/rango-client/commit/7fe0bc510a56b717bed1bb20d7889d549c7144a1))
* update active tab warning position ([9420667](https://github.com/rango-exchange/rango-client/commit/9420667d36ac508245fdf05901c1cb3074a3508b))
* update colours for quote variant for rango/default theme ([897683f](https://github.com/rango-exchange/rango-client/commit/897683f5aa550af9a74e011e4ab3d734d7c595f7))



# [0.23.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.22.3...widget-embedded@0.23.0) (2024-02-20)


### Bug Fixes

* fix some swap messages in widget-embedded ([f859190](https://github.com/rango-exchange/rango-client/commit/f85919050b0c8f3bb0f91d4f3b87a58cca29601b))
* fix widget ui minor bugs ([b881755](https://github.com/rango-exchange/rango-client/commit/b881755d59af22b41d8314f9925ecc4de04169db))
* reset connecting state on close wallet modal ([5d2fa8d](https://github.com/rango-exchange/rango-client/commit/5d2fa8dfffa9542824f6c2a4543c7dea48f5a6ae))


### Features

* add portuguese language to widget ([a7d40e2](https://github.com/rango-exchange/rango-client/commit/a7d40e2604eede900901865fc5ff1707819929a6))
* change modal & toast interface ([009612e](https://github.com/rango-exchange/rango-client/commit/009612e09c2f269872b1e639fbcf7df8cce76f74))
* implement multi routing in widget ([5003446](https://github.com/rango-exchange/rango-client/commit/50034463d25c552584201d0bd0d6a970fdda1d78))
* passing enabled swappers/bridges to widget through the url for campaigns ([06a42a3](https://github.com/rango-exchange/rango-client/commit/06a42a3b1e3986a2735189d2e9f2d6b3725edd64))



## [0.22.3](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.22.2...widget-embedded@0.22.3) (2024-02-08)


### Bug Fixes

* add ethers dependency to embedded ([5bce05d](https://github.com/rango-exchange/rango-client/commit/5bce05df42c96efa9bdffb09985d5de34cbe647e))



## [0.22.2](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.22.1...widget-embedded@0.22.2) (2024-02-07)



## [0.22.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.22.0...widget-embedded@0.22.1) (2024-02-06)


### Bug Fixes

* fix tab manager error in Next.js ([ce312b8](https://github.com/rango-exchange/rango-client/commit/ce312b833ef92cf30fe8bd52b2d415a2d73ceb8b))



# [0.22.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.21.0...widget-embedded@0.22.0) (2024-02-05)


### Bug Fixes

* fix a bug in searching history items and add a skeleton for history list labels ([458a316](https://github.com/rango-exchange/rango-client/commit/458a316b4097cc3586be08b9a1e049b50f29648b))
* remove auto scroll behavior from collapsible components ([5a4db2a](https://github.com/rango-exchange/rango-client/commit/5a4db2adf9dbf2fbb005933f293d5faedc25fc15))
* reset wallet state that remains in the connecting ([dbf8bb9](https://github.com/rango-exchange/rango-client/commit/dbf8bb949c1ac308af338de1b8a672928bf98963))
* widget ui bugs ([7d97336](https://github.com/rango-exchange/rango-client/commit/7d97336f2bc78a0c2f466124eccfe87772e760ad))


### Features

* add dynamicHeight to iframe ([08d68b6](https://github.com/rango-exchange/rango-client/commit/08d68b64bb6a3aeb24a9abe83f3dd972d9a09969))
* add right anchor prop to modal component ([f3f2dac](https://github.com/rango-exchange/rango-client/commit/f3f2dacc1c96173dbf5455cf631aae4207c6a27b))
* Adding title to config and export IDs for accessing blockchain image and swap input ([c3cdd97](https://github.com/rango-exchange/rango-client/commit/c3cdd979068a44a8d45ced7066a7e514a898325d))
* feature management from server ([2075ac8](https://github.com/rango-exchange/rango-client/commit/2075ac8514e98df6ac3514fe541eb047ba2e196a))


### Reverts

* reset wallet state that remains in the connecting ([d48544d](https://github.com/rango-exchange/rango-client/commit/d48544d2a6a12916ccf879c1d8e50b313d75be1b))



# [0.21.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.20.0...widget-embedded@0.21.0) (2024-01-22)


### Bug Fixes

* address apikey config bug in iframe ([9078657](https://github.com/rango-exchange/rango-client/commit/90786576ffc347f6d3f340b34782d0ed721850a6))
* address some minor bugs in swapHistory & wallet page loading ([1d4488e](https://github.com/rango-exchange/rango-client/commit/1d4488eee5926c2368bb9ba281ebf9fbc5c433e5))
* cleanup wallets' subscriber when setProvider get null ([88d6a42](https://github.com/rango-exchange/rango-client/commit/88d6a423c49b34b3d9ff567e22df36c3b009bb76))
* complete and check missing translations ([c661b81](https://github.com/rango-exchange/rango-client/commit/c661b81301f87193578b8a08ce3cbf65dc060487))
* fix swap detail styles issue ([e74bb0c](https://github.com/rango-exchange/rango-client/commit/e74bb0cbbdd714f07a3128e1487200eeff25d8ba))
* fix widget-iframe styles ([403009e](https://github.com/rango-exchange/rango-client/commit/403009ed0946d8a185af53f5004dc6160a5f23f8))
* persist language in store ([0a33b0f](https://github.com/rango-exchange/rango-client/commit/0a33b0ffe596b704e16328277737595b79a72f89))
* reset the quote when the source token matches the destination token ([938d30a](https://github.com/rango-exchange/rango-client/commit/938d30a9e93c00e7b9e21afa16683368ea612043))
* resolve issues for prices and dates, and add tooltips for prices ([7515215](https://github.com/rango-exchange/rango-client/commit/751521513aab2c108cecb150b81e0f921d1b603a))
* styling issues on layout ([7f0e1bd](https://github.com/rango-exchange/rango-client/commit/7f0e1bd883045d6f0a398eeb353cf5280ac09455))


### Features

* add default injected wallet ([238977c](https://github.com/rango-exchange/rango-client/commit/238977c0e3cd09feba9f2557f1b099b9af3afb0d))
* adding a modal for fee on quote component ([d314516](https://github.com/rango-exchange/rango-client/commit/d314516b0af26ca71abf071462f19c9efef407e7))
* export notifications from useWidget ([fc50baf](https://github.com/rango-exchange/rango-client/commit/fc50baf1b4043755162a54bcdd07f10fab94da39))
* for long routes, we should show a shorter version and hide the rest in a button. ([378b3e4](https://github.com/rango-exchange/rango-client/commit/378b3e4508c8d9a32c0b7ba0b4c5f2a5ba32e193))
* handle active tab in widget-embedded ([427a3bb](https://github.com/rango-exchange/rango-client/commit/427a3bb42dcaf899c4241aa5bd60c15a3475882a))
* implement auto-refresh for routes ([9dfe80c](https://github.com/rango-exchange/rango-client/commit/9dfe80c00d01078bfd3f693c6a98ceb4038e58fb))
* update filter tokens interface in widget ([455d70b](https://github.com/rango-exchange/rango-client/commit/455d70b95ca0c03eb3a738451f760ba4e4d6a04e))



# [0.20.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.19.0...widget-embedded@0.20.0) (2023-12-24)


### Bug Fixes

* add initial state with props in app store and fix bug of passing liquidity sources via config ([5d50d0f](https://github.com/rango-exchange/rango-client/commit/5d50d0fa18c0519a9464bb205684ecdaf881d936))
* comments ([79e5c8a](https://github.com/rango-exchange/rango-client/commit/79e5c8a5e204f0a3c006e0aa6174ed440c424dcd))
* fix emitting failed event in swap execution ([cedc535](https://github.com/rango-exchange/rango-client/commit/cedc53523dc8ddc5f339b4da6afa822058bd760d))
* fix HMR for widget and playground ([8524820](https://github.com/rango-exchange/rango-client/commit/8524820f10cf0b8921f3db0c4f620ff98daa4103))
* fix performance issues on token selector ([ea0b1be](https://github.com/rango-exchange/rango-client/commit/ea0b1be71c90befc0b8ad2f19e56122b145227d6))
* fix quote info bugs ([3668d84](https://github.com/rango-exchange/rango-client/commit/3668d84a43e3d6055b8ff133f546aabce6fcf616))
* fix wallet button state in swap details page ([ad57603](https://github.com/rango-exchange/rango-client/commit/ad57603885968b2792ed382dc80a3862dc0eebde))
* handle safe wallet in widget ([52fcca4](https://github.com/rango-exchange/rango-client/commit/52fcca49315f7e2edb4655ae7b9cd0792c2800d7))
* improve widget for smaller screens ([75a3107](https://github.com/rango-exchange/rango-client/commit/75a310770ece2969833dda2789bee5b8ccda166e))
* quote summary width ([8728c05](https://github.com/rango-exchange/rango-client/commit/8728c0543f916763cc7a868bce3af835c4ddf572))
* update blockchain category icons ([5ffd1ac](https://github.com/rango-exchange/rango-client/commit/5ffd1ac9bbe4cee26500c010718f4f530b1349f6))
* update classNames to new pattern for conflict prevention ([3c89278](https://github.com/rango-exchange/rango-client/commit/3c8927893381774f8bc8dc5b049ffdfccea1ffe4))
* **widget:** Showing history for selected blockchain if a blockchain selected from main list ([7b77dec](https://github.com/rango-exchange/rango-client/commit/7b77dec2c0417948bbdd4844006ce2d4ea811811))
* zustand store in context ([a31c34d](https://github.com/rango-exchange/rango-client/commit/a31c34d379173ab2b4a14beb4fddd7ac0402b236))


### Features

* add dark/light theme to playground ([01c4c45](https://github.com/rango-exchange/rango-client/commit/01c4c45cf42a5b9a945e687fbaf3cb141ca19d13))
* add langugage section to Playground ([c2deaec](https://github.com/rango-exchange/rango-client/commit/c2deaec91813f7e5cc4bccc2be78f5c297cc1a2d))
* add state of wallets' details to useWidget ([2a59055](https://github.com/rango-exchange/rango-client/commit/2a590551cc0a3d663fd9901e125890ff1386c0aa))
* export meta and additional logics from useWidget ([5c8fbc5](https://github.com/rango-exchange/rango-client/commit/5c8fbc5f25979409895b4592b62416f6bd7b82b8))
* handle wallet referrer in widget ([1073cd2](https://github.com/rango-exchange/rango-client/commit/1073cd2051f6819713a38f0c1e5c3f47ab0a7d53))
* implement feature disabling in widget config ([c9b5705](https://github.com/rango-exchange/rango-client/commit/c9b5705077ad900c8cbb2b76f5642ca79f54fd86))
* implement pin tokens in From and To ([c849db2](https://github.com/rango-exchange/rango-client/commit/c849db2083022587960a5d1a4dc64c5f696e07a5))
* implement WidgetProvider & useWidget for accessing specific widget data ([65f1824](https://github.com/rango-exchange/rango-client/commit/65f1824720d5d7d07c3d42c14285a704bd1da364))
* support experimental features ([4261610](https://github.com/rango-exchange/rango-client/commit/426161044adc583c3339a53ab58405b8f96dfee3))



# [0.11.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.10.0...widget-embedded@0.11.0) (2023-08-03)



# [0.10.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.8.0...widget-embedded@0.10.0) (2023-08-01)


### Features

* add project id as a external value ([0c80404](https://github.com/rango-exchange/rango-client/commit/0c80404a8cacb6c5b0338dea1e416b0b11db254b))
* Get Wallet Connect project id from config ([9fb30b4](https://github.com/rango-exchange/rango-client/commit/9fb30b4b1a83e2005bbf42553298f24b1e278e1c))



# [0.9.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.8.0...widget-embedded@0.9.0) (2023-07-31)


### Features

* add project id as a external value ([0c80404](https://github.com/rango-exchange/rango-client/commit/0c80404a8cacb6c5b0338dea1e416b0b11db254b))
* Get Wallet Connect project id from config ([9fb30b4](https://github.com/rango-exchange/rango-client/commit/9fb30b4b1a83e2005bbf42553298f24b1e278e1c))



# [0.8.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.7.0...widget-embedded@0.8.0) (2023-07-11)


### Bug Fixes

* adding lingui to ui and embedded packages ([efed0d6](https://github.com/rango-exchange/rango-client/commit/efed0d6da437bfd472f26a280adc55da1151966a))
* fix lingui version ([b7de08b](https://github.com/rango-exchange/rango-client/commit/b7de08b457314192665b9d3afa809e63ecd311a8))



# [0.7.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.6.0...widget-embedded@0.7.0) (2023-07-11)



# [0.6.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.5.0...widget-embedded@0.6.0) (2023-07-11)


### Bug Fixes

* fix bug in routing when usd value is unknown ([df23685](https://github.com/rango-exchange/rango-client/commit/df23685d63de6dbe5a3e591ef619d845573e0657))
* update widget affiliate config ([0655dc1](https://github.com/rango-exchange/rango-client/commit/0655dc1949e6e8a9b1efacb71e3f66ac3d1e30fb))


### Features

* add widget events and refactor swap execution events ([0d76806](https://github.com/rango-exchange/rango-client/commit/0d7680693dd77439de38cd0b20f263f6ae8cceb0))
* consider internalswaps in second bestRoute & select wallets ([a2d9510](https://github.com/rango-exchange/rango-client/commit/a2d9510288b534e03d6cf2ee3ed60b895607323f))
* setup lingui for multi-language in widget ([a3f1331](https://github.com/rango-exchange/rango-client/commit/a3f1331def487989a5717335b062dd9ef45876ad))
* support for external wallets ([0db170d](https://github.com/rango-exchange/rango-client/commit/0db170d28b7052e5a750d270549d9550c52789de))


### Reverts

* Revert "support for rango-types cjs format" ([4f5f55f](https://github.com/rango-exchange/rango-client/commit/4f5f55f96e8daa329588b932b19c291c30f339c4))



# [0.5.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.4.0...widget-embedded@0.5.0) (2023-05-31)



# [0.4.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.3.0...widget-embedded@0.4.0) (2023-05-31)



# [0.3.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.2.0...widget-embedded@0.3.0) (2023-05-30)



# [0.2.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.1.19...widget-embedded@0.2.0) (2023-05-30)


### Bug Fixes

* fix bug of duplicate modals for wallet connect ([efb5482](https://github.com/rango-exchange/rango-client/commit/efb54827fd51e6c6c8f42c6abf33c3d7610755e8))
* Some functions were transferred to helper ([7d5756f](https://github.com/rango-exchange/rango-client/commit/7d5756fc476728e84b16300102918542520983a7))



## [0.1.19](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.1.18...widget-embedded@0.1.19) (2023-05-15)



## [0.1.16](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.1.15...widget-embedded@0.1.16) (2023-05-15)


### Bug Fixes

* Fixed colorpicker ([d821340](https://github.com/rango-exchange/rango-client/commit/d821340fc3f5df07ccbfc3555ae4d7dba0cad49b))
* some polishment on playground ([cf17f9e](https://github.com/rango-exchange/rango-client/commit/cf17f9e2ac2efc9467c4f550e09eaf19170bbbf0))
* update rango-types and fix notification bugs ([993f185](https://github.com/rango-exchange/rango-client/commit/993f185e0b8c5e5e15a2c65ba2d85d1f9c8daa90))



