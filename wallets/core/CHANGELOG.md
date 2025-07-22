# [0.46.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.45.0...wallets-core@0.46.0) (2025-07-22)


### Bug Fixes

* abort all namespace connections if user rejects one connect request ([5824a96](https://github.com/rango-exchange/rango-client/commit/5824a96c8c9d8075c730a19de3b78caccbb04778))
* handle trust wallet in app browser user rejection error ([1b1d07f](https://github.com/rango-exchange/rango-client/commit/1b1d07f9155bbd7dbe3f7a9157b353e4a2a3cc40))


### Features

* add derivation path to swap wallets ([0728ac4](https://github.com/rango-exchange/rango-client/commit/0728ac40a67f648d254db2461627b7cd408a28c5))
* migrate rabby to use hub ([e25ba8c](https://github.com/rango-exchange/rango-client/commit/e25ba8c52e2a603ba0689e91773fd6edebf3003f))


### Reverts

* Revert "chore(release): publish" ([064ce15](https://github.com/rango-exchange/rango-client/commit/064ce157a2f819856f647f83aeb1c0410542e8d7))



# [0.44.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.43.0...wallets-core@0.44.0) (2025-06-09)


### Bug Fixes

* add has method to the namespace proxy ([ee74628](https://github.com/rango-exchange/rango-client/commit/ee7462881c27fbf42fae374064362293f5f92765))
* avoid hub recreation ([2e5fc07](https://github.com/rango-exchange/rango-client/commit/2e5fc07bc0952d1d98b828d7e70a892034bb99b8))
* fix phantom transaction failure on sui namespace disabled ([213b235](https://github.com/rango-exchange/rango-client/commit/213b23565b2729a48605d3d06ef5dd6daf66900f))


### Features

* add detached connect wallet modal ([b2d7d6f](https://github.com/rango-exchange/rango-client/commit/b2d7d6fda2bdfe3e9f72baba95a1a7694e3db21a))
* integrate slush wallet ([9e9a5cc](https://github.com/rango-exchange/rango-client/commit/9e9a5ccb802fbd1f9a50322a89f65b557f152c6a))
* migrate trust wallet to use hub and add support for solana ([61497fd](https://github.com/rango-exchange/rango-client/commit/61497fd40d48d48030e5a6d7ece53b5b7daf7b09))



# [0.43.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.42.0...wallets-core@0.43.0) (2025-04-30)


### Bug Fixes

* error rethrow in or action ([61bc658](https://github.com/rango-exchange/rango-client/commit/61bc658f6a0dab513bb595e2943c85b675c65ada))
* rename pbt to ptb for sui ([3d6d89f](https://github.com/rango-exchange/rango-client/commit/3d6d89f2265766607a15d61e0df92643fb33072b))


### Features

* add can eager connect to namespaces ([16b4792](https://github.com/rango-exchange/rango-client/commit/16b4792f877b565ccf767be22ebe14fa79ddd8c6))
* implement updated design for initial connect modal ([2873c63](https://github.com/rango-exchange/rango-client/commit/2873c630de0740bb3b9f4e52bfa018857bd54dcd))
* Sui support for Phantom ([3769b8b](https://github.com/rango-exchange/rango-client/commit/3769b8ba174783190e242103548bcf4da28cff14))
* update sui to consider recent api changes ([d764b25](https://github.com/rango-exchange/rango-client/commit/d764b2501df9bb295f63cdbc0b05acd4a3abb4b9))



# [0.42.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.41.0...wallets-core@0.42.0) (2025-03-11)


### Features

* add bitcoin signer for phantom on hub ([750124e](https://github.com/rango-exchange/rango-client/commit/750124e693753078abb537d4043964e2eebdbc01))
* add sui namespace to wallets-core ([5bcf5dd](https://github.com/rango-exchange/rango-client/commit/5bcf5ddd1444bcabb894ddfac0e3766c88988fbd))



# [0.41.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.40.0...wallets-core@0.41.0) (2025-02-23)


### Bug Fixes

* ctrl wallet is changing 'keplr' named function to undefined ([f1b7f2a](https://github.com/rango-exchange/rango-client/commit/f1b7f2a814f45441639174b36d498a1e341bb559))
* remove connected wallet on namespace disconnect ([4f0be8a](https://github.com/rango-exchange/rango-client/commit/4f0be8a1eab99af9e6077b7c8c45fdfc6d40f4e9))
* switching to not connected account should disconnect evm as well ([8ea7d40](https://github.com/rango-exchange/rango-client/commit/8ea7d40569972fe14dbde630b1e0ba9c4d6b0df5))


### Features

* add an adapter for Hub for wallets-react and enabling Hub by default. ([a14bdf9](https://github.com/rango-exchange/rango-client/commit/a14bdf9619e448bc4568d6b758ca86d2359e1740))
* add base chain to phantom evm supported chains ([58a2d54](https://github.com/rango-exchange/rango-client/commit/58a2d54c0eff18e8d5ecf980b2487f7c8dada59f))
* add chain change subscribe to evm namespace ([0a7e7ee](https://github.com/rango-exchange/rango-client/commit/0a7e7ee6b53c94dcb842fff7e34f9dcbf6120a37))
* introducing store events for hub and fix switching accounts using that ([ba95ba2](https://github.com/rango-exchange/rango-client/commit/ba95ba2584f41e2a4b4b2984a62c737ab74d7cd8))
* storing network alongside namespace for hub localstorage ([c5437fa](https://github.com/rango-exchange/rango-client/commit/c5437fa0f5117d9d762358cf7cf8ca4627c43406))



# [0.40.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.39.0...wallets-core@0.40.0) (2024-11-12)



# [0.39.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.38.0...wallets-core@0.39.0) (2024-10-12)


### Bug Fixes

* bump sdk and fix type issues ([d442208](https://github.com/rango-exchange/rango-client/commit/d4422083bf5dd27d5f509ce1db7f9560d05428c8))


### Features

* introducing hub, our new wallet management ([92692fe](https://github.com/rango-exchange/rango-client/commit/92692fe7a05be72caea8b99bcc4ac5e2326f2f5a))


### Performance Improvements

* lazy load signer packages ([7b88f18](https://github.com/rango-exchange/rango-client/commit/7b88f1834f7b29b4b81ab6c81a07bb88e8ccf55c))



# [0.38.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.37.0...wallets-core@0.38.0) (2024-09-10)



# [0.37.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.36.1...wallets-core@0.37.0) (2024-08-11)



## [0.36.1](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.36.0...wallets-core@0.36.1) (2024-07-14)



# [0.36.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.34.0...wallets-core@0.36.0) (2024-07-09)


### Features

* add a modal for setting custom derivation path for ledger ([5b74ec0](https://github.com/rango-exchange/rango-client/commit/5b74ec049393ed74e3e7547edc72b68bd70b7dce))



# [0.35.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.34.0...wallets-core@0.35.0) (2024-06-01)



# [0.34.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.33.0...wallets-core@0.34.0) (2024-05-14)


### Features

* add solana to ledger ([77b6695](https://github.com/rango-exchange/rango-client/commit/77b6695758165f9258a0ba5bd3b2cf39b0b2aab5))



# [0.33.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.32.0...wallets-core@0.33.0) (2024-04-24)



# [0.32.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.31.0...wallets-core@0.32.0) (2024-04-23)


### Bug Fixes

* set current state for current network in conencting multi-chain wallets ([dc62af0](https://github.com/rango-exchange/rango-client/commit/dc62af03f0edc10400394ba600c7d83e1250b4e8))



# [0.31.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.30.0...wallets-core@0.31.0) (2024-04-09)



# [0.30.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.29.0...wallets-core@0.30.0) (2024-03-12)


### Bug Fixes

* fix wallet connect namespace and switch network ([c8f31b3](https://github.com/rango-exchange/rango-client/commit/c8f31b3ddf4ceeaf745bc089f530b6a4b1eb9637))



# [0.29.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.28.0...wallets-core@0.29.0) (2024-02-20)



# [0.28.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.27.0...wallets-core@0.28.0) (2024-02-07)



# [0.27.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.26.0...wallets-core@0.27.0) (2024-01-22)


### Bug Fixes

* cleanup wallets' subscriber when setProvider get null ([88d6a42](https://github.com/rango-exchange/rango-client/commit/88d6a423c49b34b3d9ff567e22df36c3b009bb76))



# [0.26.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.24.0...wallets-core@0.26.0) (2023-12-24)


### Bug Fixes

* fix HMR for widget and playground ([8524820](https://github.com/rango-exchange/rango-client/commit/8524820f10cf0b8921f3db0c4f620ff98daa4103))
* handle safe wallet in widget ([52fcca4](https://github.com/rango-exchange/rango-client/commit/52fcca49315f7e2edb4655ae7b9cd0792c2800d7))
* handle switch network flow for wallet-connect ([8c4a17b](https://github.com/rango-exchange/rango-client/commit/8c4a17b47b2919820a4e0726f6d1c48b8994abe3))



# [0.14.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.13.0...wallets-core@0.14.0) (2023-08-03)



# [0.13.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.12.0...wallets-core@0.13.0) (2023-08-01)



# [0.9.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.8.0...wallets-core@0.9.0) (2023-07-31)


### Features

* add project id as a external value ([0c80404](https://github.com/rango-exchange/rango-client/commit/0c80404a8cacb6c5b0338dea1e416b0b11db254b))
* Support for WalletConnect 2 ([faedef0](https://github.com/rango-exchange/rango-client/commit/faedef0b5e6fc3c5ef881cbbe4ec05334cc1c910))
* support safe wallet ([d04cbcd](https://github.com/rango-exchange/rango-client/commit/d04cbcd2a612755563512d9dff6f2312088d8b4d))



# [0.7.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.6.0...wallets-core@0.7.0) (2023-07-11)



# [0.6.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.5.0...wallets-core@0.6.0) (2023-07-11)


### Features

* implement wallets auto-connect functionality ([f47d32b](https://github.com/rango-exchange/rango-client/commit/f47d32bb8bbb38a72b961e5eb2ee7e2b985f9f7d))


### Reverts

* Revert "support for rango-types cjs format" ([ed4e050](https://github.com/rango-exchange/rango-client/commit/ed4e050bfc0dcde7aeffa6b0d73b02080a5721eb))



# [0.5.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.4.0...wallets-core@0.5.0) (2023-05-31)



# [0.4.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.3.0...wallets-core@0.4.0) (2023-05-31)



# [0.3.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.2.0...wallets-core@0.3.0) (2023-05-30)



# [0.2.0](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.1.15...wallets-core@0.2.0) (2023-05-30)


### Bug Fixes

* fix bug of duplicate modals for wallet connect ([efb5482](https://github.com/rango-exchange/rango-client/commit/efb54827fd51e6c6c8f42c6abf33c3d7610755e8))
* fix can switch network for wallet connect ([e3cdeac](https://github.com/rango-exchange/rango-client/commit/e3cdeacd836e254ea2d5384aab4b624a3e7259eb))



## [0.1.14](https://github.com/rango-exchange/rango-client/compare/wallets-core@0.1.13...wallets-core@0.1.14) (2023-05-15)


### Bug Fixes

* update rango-types and fix notification bugs ([993f185](https://github.com/rango-exchange/rango-client/commit/993f185e0b8c5e5e15a2c65ba2d85d1f9c8daa90))



