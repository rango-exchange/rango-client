# 0.32.0 (2025-07-09)


### Bug Fixes

* add has method to the namespace proxy ([2fd1469](https://github.com/rango-exchange/rango-client/commit/2fd1469b3ed0781e5e2517b80099f44c43bdff3b))
* add suggest and connect to wallet for  experimental chain ([501b9e4](https://github.com/rango-exchange/rango-client/commit/501b9e4242b96717bfc0ee90b708bebb314e4728))
* avoid hub recreation ([4a221ae](https://github.com/rango-exchange/rango-client/commit/4a221ae5129046b545545988127ea7e6267b2118))
* bump sdk and fix type issues ([c297c46](https://github.com/rango-exchange/rango-client/commit/c297c46620f853b6317664dae04061af3dfbbd71))
* cleanup wallets' subscriber when setProvider get null ([a05dfba](https://github.com/rango-exchange/rango-client/commit/a05dfba623facc20debeee3d149fddc779e66278))
* fix frozen accounts array ([a845d54](https://github.com/rango-exchange/rango-client/commit/a845d548890d758765a508a0f338ffaf1828b3a3))
* fix HMR for widget and playground ([71c15da](https://github.com/rango-exchange/rango-client/commit/71c15dadab4d161006b9f05a77c286b05c931528))
* fix hub problems with wallets config ([93994e0](https://github.com/rango-exchange/rango-client/commit/93994e0cc94fbf50e2055b617efeffa9fffb336b))
* fix incorrect default install link for wallets ([f50bb3d](https://github.com/rango-exchange/rango-client/commit/f50bb3de1fbbb3a043316e82438b1f3fb8c13a2d))
* fix incorrect state after connecting evm namespace on hub wallets ([446088b](https://github.com/rango-exchange/rango-client/commit/446088ba5c872004dad7a2ef07688126d8fce98d))
* fix incorrect wallet state after switch account ([a7265db](https://github.com/rango-exchange/rango-client/commit/a7265db5826cf99475f346775b1bb47771386a18))
* fix wallet connect namespace and switch network ([b338600](https://github.com/rango-exchange/rango-client/commit/b338600a6a58e301bd2ef8e181ead7ee751bb78b))
* handle safe wallet in widget ([8e98b59](https://github.com/rango-exchange/rango-client/commit/8e98b59652ca67bc7501f6b13b549915583f48bf))
* handle switch network flow for wallet-connect ([8066473](https://github.com/rango-exchange/rango-client/commit/8066473b27be525cf220da4070de780ef9b603dd))
* make connect namespaces sequential ([614a891](https://github.com/rango-exchange/rango-client/commit/614a891faca8138244e22c40e4ab166a2e873f9d))
* make hub compatible with external wallets ([180402a](https://github.com/rango-exchange/rango-client/commit/180402a2f8ae59e15b3583c94078e7112a0da2f7))
* optional namespace removal to prevent error for wallets without autoconnect ([879f8c6](https://github.com/rango-exchange/rango-client/commit/879f8c693b7c8d1cb19e60e2b46f22f28a38a21d))
* remove connected wallet on namespace disconnect ([c98358b](https://github.com/rango-exchange/rango-client/commit/c98358bd80b2b3095dccac38d7b412cc52bee501))
* remove namespace from storage on auto connect failure ([4173bf1](https://github.com/rango-exchange/rango-client/commit/4173bf13a45a157b3609da5d92031e88b1763ae5))
* rename pbt to ptb for sui ([6023ef8](https://github.com/rango-exchange/rango-client/commit/6023ef84340b25430001d5efd0e005bdd96ff2ae))
* run connect namespaces sequentially when connect of adapter called separately ([6bd1b69](https://github.com/rango-exchange/rango-client/commit/6bd1b69fb2e33c9ad2a3cab0ec2b4620f9ca4ccb))
* update connected namespaces in storage on switch account ([cb812fa](https://github.com/rango-exchange/rango-client/commit/cb812faab45659e87bc84fda5cd685389452c635))


### Features

* add a modal for setting custom derivation path for ledger ([6e33216](https://github.com/rango-exchange/rango-client/commit/6e332160cd1febeded77230c30bb04bea70853c9))
* add an adapter for Hub for wallets-react and enabling Hub by default. ([016fe92](https://github.com/rango-exchange/rango-client/commit/016fe924f30426b5ee92313c2bb9213a31210d71))
* add bitcoin signer for phantom on hub ([822c346](https://github.com/rango-exchange/rango-client/commit/822c34622d5e2505496f2da39699c9a275912d4e))
* add can eager connect to namespaces ([a2dc132](https://github.com/rango-exchange/rango-client/commit/a2dc13235cfc4bb9d6eec44895ad9747d24d01df))
* add disconnect all to hub adapter ([53e6adc](https://github.com/rango-exchange/rango-client/commit/53e6adc9392f3b662124bcc0a54af64624ae41aa))
* add namespace connect and disconnect and get state ([c40b87b](https://github.com/rango-exchange/rango-client/commit/c40b87bc476b6aa48d254a48c0074f8c512ac2a5))
* add new states for wallet buttons ([ee6d29d](https://github.com/rango-exchange/rango-client/commit/ee6d29d1eef11d8eb5d271b4a06c51ece093fa0c))
* add solana to ledger ([2db1c76](https://github.com/rango-exchange/rango-client/commit/2db1c76bbf3a158a4f9fc9d14f8458e829a94763))
* add sui namespace support for widget ([c489a97](https://github.com/rango-exchange/rango-client/commit/c489a978ebb5baa311898670bac6a47f03f5a1c9))
* introducing store events for hub and fix switching accounts using that ([c22a5fa](https://github.com/rango-exchange/rango-client/commit/c22a5fa7aede26c26838029c658b3d6b30ccc1c5))
* storing network alongside namespace for hub localstorage ([d44d725](https://github.com/rango-exchange/rango-client/commit/d44d7259db20c94f378df5da381a2866e33faa98))
* update sui to consider recent api changes ([265ff47](https://github.com/rango-exchange/rango-client/commit/265ff47fc90db86fd3c94183b3e48105241e6ae6))


### Performance Improvements

* lazy load signer packages ([bc6fa14](https://github.com/rango-exchange/rango-client/commit/bc6fa141c2281cb202294e8df5a78b11d1cdabfb))



# [0.31.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.30.1...wallets-react@0.31.0) (2025-06-09)


### Bug Fixes

* add has method to the namespace proxy ([ee74628](https://github.com/rango-exchange/rango-client/commit/ee7462881c27fbf42fae374064362293f5f92765))
* avoid hub recreation ([2e5fc07](https://github.com/rango-exchange/rango-client/commit/2e5fc07bc0952d1d98b828d7e70a892034bb99b8))
* fix incorrect state after connecting evm namespace on hub wallets ([778bba9](https://github.com/rango-exchange/rango-client/commit/778bba9ca33ca8cce1a98bb3dcff81fa55a6d6a9))
* run connect namespaces sequentially when connect of adapter called separately ([087a94e](https://github.com/rango-exchange/rango-client/commit/087a94e012525609dee75b053db2ce3ee444aa18))


### Features

* add namespace connect and disconnect and get state ([dcbabb0](https://github.com/rango-exchange/rango-client/commit/dcbabb0c2b81932312b3b76975af2ad558439869))
* add new states for wallet buttons ([d337aee](https://github.com/rango-exchange/rango-client/commit/d337aeed2315173a7820d3adedb412a4a1704fcd))



## [0.30.1](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.30.0...wallets-react@0.30.1) (2025-05-04)



# [0.30.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.29.0...wallets-react@0.30.0) (2025-04-30)


### Bug Fixes

* optional namespace removal to prevent error for wallets without autoconnect ([2d20f87](https://github.com/rango-exchange/rango-client/commit/2d20f87820f59abb082770731ee0c64b309d800e))
* rename pbt to ptb for sui ([3d6d89f](https://github.com/rango-exchange/rango-client/commit/3d6d89f2265766607a15d61e0df92643fb33072b))


### Features

* add can eager connect to namespaces ([16b4792](https://github.com/rango-exchange/rango-client/commit/16b4792f877b565ccf767be22ebe14fa79ddd8c6))
* update sui to consider recent api changes ([d764b25](https://github.com/rango-exchange/rango-client/commit/d764b2501df9bb295f63cdbc0b05acd4a3abb4b9))



# [0.29.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.28.0...wallets-react@0.29.0) (2025-03-11)


### Features

* add bitcoin signer for phantom on hub ([750124e](https://github.com/rango-exchange/rango-client/commit/750124e693753078abb537d4043964e2eebdbc01))
* add sui namespace support for widget ([990d4c3](https://github.com/rango-exchange/rango-client/commit/990d4c32e7ad674c01140ca0bd557d541c596bbb))



# [0.28.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.27.0...wallets-react@0.28.0) (2025-02-23)


### Bug Fixes

* fix frozen accounts array ([5438438](https://github.com/rango-exchange/rango-client/commit/54384388239adafc35e7d7b1afbb58ff6f6a0d79))
* fix hub problems with wallets config ([822f209](https://github.com/rango-exchange/rango-client/commit/822f209d5e013ef4cc05f23c9b5f33acba336fcc))
* fix incorrect default install link for wallets ([09fee13](https://github.com/rango-exchange/rango-client/commit/09fee1314dc20ba84935ed8ac7d7674619b055a2))
* fix incorrect wallet state after switch account ([5ee5dda](https://github.com/rango-exchange/rango-client/commit/5ee5dda42a31a0630462be3ec56ce45f9992f916))
* make connect namespaces sequential ([b430c56](https://github.com/rango-exchange/rango-client/commit/b430c561197fdcf34a710581c345c31f0c596636))
* make hub compatible with external wallets ([316f18c](https://github.com/rango-exchange/rango-client/commit/316f18c4b270b5e94b7e475d6bf7922cdcc9c712))
* remove connected wallet on namespace disconnect ([4f0be8a](https://github.com/rango-exchange/rango-client/commit/4f0be8a1eab99af9e6077b7c8c45fdfc6d40f4e9))
* remove namespace from storage on auto connect failure ([6b6504f](https://github.com/rango-exchange/rango-client/commit/6b6504f32f34041f5c33ef3348a244d32bffe399))
* update connected namespaces in storage on switch account ([782ec1d](https://github.com/rango-exchange/rango-client/commit/782ec1d1624fd9305c3bcf4ba0254ecbcdcdb2a2))


### Features

* add an adapter for Hub for wallets-react and enabling Hub by default. ([a14bdf9](https://github.com/rango-exchange/rango-client/commit/a14bdf9619e448bc4568d6b758ca86d2359e1740))
* add disconnect all to hub adapter ([c9934cc](https://github.com/rango-exchange/rango-client/commit/c9934cc1ab883b6de6309be6225e5d590e6e5bf6))
* introducing store events for hub and fix switching accounts using that ([ba95ba2](https://github.com/rango-exchange/rango-client/commit/ba95ba2584f41e2a4b4b2984a62c737ab74d7cd8))
* storing network alongside namespace for hub localstorage ([c5437fa](https://github.com/rango-exchange/rango-client/commit/c5437fa0f5117d9d762358cf7cf8ca4627c43406))



# [0.27.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.26.0...wallets-react@0.27.0) (2024-12-30)



# [0.26.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.25.0...wallets-react@0.26.0) (2024-11-27)



# [0.25.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.24.0...wallets-react@0.25.0) (2024-11-12)



# [0.24.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.23.0...wallets-react@0.24.0) (2024-10-12)


### Bug Fixes

* bump sdk and fix type issues ([d442208](https://github.com/rango-exchange/rango-client/commit/d4422083bf5dd27d5f509ce1db7f9560d05428c8))


### Performance Improvements

* lazy load signer packages ([7b88f18](https://github.com/rango-exchange/rango-client/commit/7b88f1834f7b29b4b81ab6c81a07bb88e8ccf55c))



# [0.23.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.22.0...wallets-react@0.23.0) (2024-09-10)



# [0.22.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.21.1...wallets-react@0.22.0) (2024-08-11)



## [0.21.1](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.21.0...wallets-react@0.21.1) (2024-07-14)



# [0.21.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.19.0...wallets-react@0.21.0) (2024-07-09)


### Features

* add a modal for setting custom derivation path for ledger ([5b74ec0](https://github.com/rango-exchange/rango-client/commit/5b74ec049393ed74e3e7547edc72b68bd70b7dce))



# [0.20.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.19.0...wallets-react@0.20.0) (2024-06-01)



# [0.19.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.18.0...wallets-react@0.19.0) (2024-05-14)


### Features

* add solana to ledger ([77b6695](https://github.com/rango-exchange/rango-client/commit/77b6695758165f9258a0ba5bd3b2cf39b0b2aab5))



# [0.18.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.17.0...wallets-react@0.18.0) (2024-04-24)



# [0.17.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.16.0...wallets-react@0.17.0) (2024-04-23)



# [0.16.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.15.0...wallets-react@0.16.0) (2024-04-09)



# [0.15.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.14.0...wallets-react@0.15.0) (2024-03-12)


### Bug Fixes

* fix wallet connect namespace and switch network ([c8f31b3](https://github.com/rango-exchange/rango-client/commit/c8f31b3ddf4ceeaf745bc089f530b6a4b1eb9637))



# [0.14.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.13.0...wallets-react@0.14.0) (2024-02-20)



# [0.13.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.12.0...wallets-react@0.13.0) (2024-02-07)



# [0.12.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.11.0...wallets-react@0.12.0) (2024-01-22)


### Bug Fixes

* cleanup wallets' subscriber when setProvider get null ([88d6a42](https://github.com/rango-exchange/rango-client/commit/88d6a423c49b34b3d9ff567e22df36c3b009bb76))



# [0.11.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.10.0...wallets-react@0.11.0) (2023-12-24)


### Bug Fixes

* fix HMR for widget and playground ([8524820](https://github.com/rango-exchange/rango-client/commit/8524820f10cf0b8921f3db0c4f620ff98daa4103))
* handle safe wallet in widget ([52fcca4](https://github.com/rango-exchange/rango-client/commit/52fcca49315f7e2edb4655ae7b9cd0792c2800d7))
* handle switch network flow for wallet-connect ([8c4a17b](https://github.com/rango-exchange/rango-client/commit/8c4a17b47b2919820a4e0726f6d1c48b8994abe3))



