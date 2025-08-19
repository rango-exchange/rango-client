# [0.35.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.34.0...wallets-react@0.35.0) (2025-08-19)



# [0.34.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.33.0...wallets-react@0.34.0) (2025-08-05)


### Features

* implement canSwitchNetwork for hub providers ([5a4eced](https://github.com/rango-exchange/rango-client/commit/5a4eced221046b5474176aca7c569092e36f1bde))



# [0.33.0](https://github.com/rango-exchange/rango-client/compare/wallets-react@0.32.0...wallets-react@0.33.0) (2025-07-22)


### Bug Fixes

* abort all namespace connections if user rejects one connect request ([5824a96](https://github.com/rango-exchange/rango-client/commit/5824a96c8c9d8075c730a19de3b78caccbb04778))


### Features

* add derivation path to swap wallets ([0728ac4](https://github.com/rango-exchange/rango-client/commit/0728ac40a67f648d254db2461627b7cd408a28c5))


### Reverts

* Revert "chore(release): publish" ([064ce15](https://github.com/rango-exchange/rango-client/commit/064ce157a2f819856f647f83aeb1c0410542e8d7))



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



