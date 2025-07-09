# 0.45.0 (2025-07-09)


### Bug Fixes

* add has method to the namespace proxy ([2fd1469](https://github.com/rango-exchange/rango-client/commit/2fd1469b3ed0781e5e2517b80099f44c43bdff3b))
* add suggest and connect to wallet for  experimental chain ([501b9e4](https://github.com/rango-exchange/rango-client/commit/501b9e4242b96717bfc0ee90b708bebb314e4728))
* avoid hub recreation ([4a221ae](https://github.com/rango-exchange/rango-client/commit/4a221ae5129046b545545988127ea7e6267b2118))
* bump sdk and fix type issues ([c297c46](https://github.com/rango-exchange/rango-client/commit/c297c46620f853b6317664dae04061af3dfbbd71))
* cleanup wallets' subscriber when setProvider get null ([a05dfba](https://github.com/rango-exchange/rango-client/commit/a05dfba623facc20debeee3d149fddc779e66278))
* convert trust-wallet in-app browser chainId to hex string ([e852668](https://github.com/rango-exchange/rango-client/commit/e852668767192d4ca98245303228f42cfa95d7b2))
* ctrl wallet is changing 'keplr' named function to undefined ([71f1923](https://github.com/rango-exchange/rango-client/commit/71f1923066e9fe2ff84bcade1367ef219ffc9704))
* error rethrow in or action ([8c302eb](https://github.com/rango-exchange/rango-client/commit/8c302ebf4dcacfa457fc760d56886f0ae4727ebf))
* fix bug of duplicate modals for wallet connect ([1cf61cc](https://github.com/rango-exchange/rango-client/commit/1cf61ccab17c687c5422677eaf6d54d9666f5773))
* fix can switch network for wallet connect ([d65f9b8](https://github.com/rango-exchange/rango-client/commit/d65f9b8517860f76611da478d567164fc59254ad))
* fix cosmostation experimental chain issue ([4baaa77](https://github.com/rango-exchange/rango-client/commit/4baaa77e2b2bb794ce2674473e1ecfef49da132d))
* fix HMR for widget and playground ([71c15da](https://github.com/rango-exchange/rango-client/commit/71c15dadab4d161006b9f05a77c286b05c931528))
* fix phantom transaction failure on sui namespace disabled ([aaf9d8a](https://github.com/rango-exchange/rango-client/commit/aaf9d8aa21ceaf6c1a9540df72fb68f358523de4))
* fix wallet connect namespace and switch network ([b338600](https://github.com/rango-exchange/rango-client/commit/b338600a6a58e301bd2ef8e181ead7ee751bb78b))
* handle safe wallet in widget ([8e98b59](https://github.com/rango-exchange/rango-client/commit/8e98b59652ca67bc7501f6b13b549915583f48bf))
* handle switch network flow for wallet-connect ([8066473](https://github.com/rango-exchange/rango-client/commit/8066473b27be525cf220da4070de780ef9b603dd))
* remove connected wallet on namespace disconnect ([c98358b](https://github.com/rango-exchange/rango-client/commit/c98358bd80b2b3095dccac38d7b412cc52bee501))
* rename pbt to ptb for sui ([6023ef8](https://github.com/rango-exchange/rango-client/commit/6023ef84340b25430001d5efd0e005bdd96ff2ae))
* return provider info with optional store ([ae3c39b](https://github.com/rango-exchange/rango-client/commit/ae3c39b5a3e825b5081065e08a73de27bbec2582))
* set current state for current network in conencting multi-chain wallets ([ef0a6f8](https://github.com/rango-exchange/rango-client/commit/ef0a6f8a414d71ebef95d14f7e8f24636d43f8d4))
* switching to not connected account should disconnect evm as well ([9061482](https://github.com/rango-exchange/rango-client/commit/906148281967c821cf0a3739a2e50d89af2de5a5))
* trust wallet disconnect problem in its in-app browser ([a6e5e93](https://github.com/rango-exchange/rango-client/commit/a6e5e93001f1ccab83f954e6b2faf069bbcb7e0c))
* update rango-types and fix notification bugs ([e5660ec](https://github.com/rango-exchange/rango-client/commit/e5660ec9e67c96c9f27ddd29773b67aaa60a69d2))


### Features

* add a modal for setting custom derivation path for ledger ([6e33216](https://github.com/rango-exchange/rango-client/commit/6e332160cd1febeded77230c30bb04bea70853c9))
* add an adapter for Hub for wallets-react and enabling Hub by default. ([016fe92](https://github.com/rango-exchange/rango-client/commit/016fe924f30426b5ee92313c2bb9213a31210d71))
* add base chain to phantom evm supported chains ([96e0855](https://github.com/rango-exchange/rango-client/commit/96e0855e8b814ef042b62308eabaa90ff595cc04))
* add bitcoin signer for phantom on hub ([822c346](https://github.com/rango-exchange/rango-client/commit/822c34622d5e2505496f2da39699c9a275912d4e))
* add can eager connect to namespaces ([a2dc132](https://github.com/rango-exchange/rango-client/commit/a2dc13235cfc4bb9d6eec44895ad9747d24d01df))
* add chain change subscribe to evm namespace ([6b5b878](https://github.com/rango-exchange/rango-client/commit/6b5b878a391b7077f5c560536658a1a8bfe74d3b))
* add detached connect wallet modal ([7dbfe35](https://github.com/rango-exchange/rango-client/commit/7dbfe35e449d059c7011fe3cf87f55bad45873e7))
* add project id as a external value ([a4146ea](https://github.com/rango-exchange/rango-client/commit/a4146eab7586754312c9a4f5ed91e072a8f6c391))
* add solana to ledger ([2db1c76](https://github.com/rango-exchange/rango-client/commit/2db1c76bbf3a158a4f9fc9d14f8458e829a94763))
* add sui namespace to wallets-core ([b453021](https://github.com/rango-exchange/rango-client/commit/b453021623c1a9634de99c40a87f9620b57330e9))
* implement updated design for initial connect modal ([469ff34](https://github.com/rango-exchange/rango-client/commit/469ff34f1d72e0bcda94d804c95055ce613d9803))
* implement wallets auto-connect functionality ([1b75941](https://github.com/rango-exchange/rango-client/commit/1b759414e0ac7eba358e759c36c35cb451e05f68))
* integrate slush wallet ([b083573](https://github.com/rango-exchange/rango-client/commit/b083573cc3d9b83da110571cf622d6fd72461fe8))
* integrating unisat wallet ([5e9f0c7](https://github.com/rango-exchange/rango-client/commit/5e9f0c78c3aa2ea64274f2013172ab878a2c2b2d))
* introducing hub, our new wallet management ([09f393d](https://github.com/rango-exchange/rango-client/commit/09f393d84e6cc655f24ddcd67a4a277577e37189))
* introducing store events for hub and fix switching accounts using that ([c22a5fa](https://github.com/rango-exchange/rango-client/commit/c22a5fa7aede26c26838029c658b3d6b30ccc1c5))
* migrate trust wallet to use hub and add support for solana ([b5b5749](https://github.com/rango-exchange/rango-client/commit/b5b5749216ee02e9f9fb11295e5b5d0533629409))
* storing network alongside namespace for hub localstorage ([d44d725](https://github.com/rango-exchange/rango-client/commit/d44d7259db20c94f378df5da381a2866e33faa98))
* Sui support for Phantom ([dff432b](https://github.com/rango-exchange/rango-client/commit/dff432b53b04cc9c8ccdda2c1b12168feca78e20))
* Support for WalletConnect 2 ([9abf37a](https://github.com/rango-exchange/rango-client/commit/9abf37a201e1435ef53b0b31e6c911d3c6fed17a))
* support safe wallet ([d3429d0](https://github.com/rango-exchange/rango-client/commit/d3429d00fe1bee097f2a946bea9cb2e04803d7b8))
* update sui to consider recent api changes ([265ff47](https://github.com/rango-exchange/rango-client/commit/265ff47fc90db86fd3c94183b3e48105241e6ae6))


### Performance Improvements

* lazy load signer packages ([bc6fa14](https://github.com/rango-exchange/rango-client/commit/bc6fa141c2281cb202294e8df5a78b11d1cdabfb))


### Reverts

* Revert "support for rango-types cjs format" ([a424f87](https://github.com/rango-exchange/rango-client/commit/a424f878872b128c1bc673f0d58ba1b99dd29d74))



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



