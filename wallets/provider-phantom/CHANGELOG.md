# 0.47.0 (2025-07-09)


### Bug Fixes

* bump sdk and fix type issues ([c297c46](https://github.com/rango-exchange/rango-client/commit/c297c46620f853b6317664dae04061af3dfbbd71))
* cleanup wallets' subscriber when setProvider get null ([a05dfba](https://github.com/rango-exchange/rango-client/commit/a05dfba623facc20debeee3d149fddc779e66278))
* error rethrow in or action ([8c302eb](https://github.com/rango-exchange/rango-client/commit/8c302ebf4dcacfa457fc760d56886f0ae4727ebf))
* fix HMR for widget and playground ([71c15da](https://github.com/rango-exchange/rango-client/commit/71c15dadab4d161006b9f05a77c286b05c931528))
* fix phantom transaction failure on sui namespace disabled ([aaf9d8a](https://github.com/rango-exchange/rango-client/commit/aaf9d8aa21ceaf6c1a9540df72fb68f358523de4))
* fix the connection problem that happens when another wallet takes over the requested one ([e262f4c](https://github.com/rango-exchange/rango-client/commit/e262f4c03b7dbf486dbffb91cfea26f44f915953))
* make hub compatible with external wallets ([180402a](https://github.com/rango-exchange/rango-client/commit/180402a2f8ae59e15b3583c94078e7112a0da2f7))
* rename pbt to ptb for sui ([6023ef8](https://github.com/rango-exchange/rango-client/commit/6023ef84340b25430001d5efd0e005bdd96ff2ae))
* update rango-types and fix notification bugs ([e5660ec](https://github.com/rango-exchange/rango-client/commit/e5660ec9e67c96c9f27ddd29773b67aaa60a69d2))


### Features

* add an adapter for Hub for wallets-react and enabling Hub by default. ([016fe92](https://github.com/rango-exchange/rango-client/commit/016fe924f30426b5ee92313c2bb9213a31210d71))
* add base chain to phantom evm supported chains ([96e0855](https://github.com/rango-exchange/rango-client/commit/96e0855e8b814ef042b62308eabaa90ff595cc04))
* add bitcoin signer for phantom on hub ([822c346](https://github.com/rango-exchange/rango-client/commit/822c34622d5e2505496f2da39699c9a275912d4e))
* add can eager connect to namespaces ([a2dc132](https://github.com/rango-exchange/rango-client/commit/a2dc13235cfc4bb9d6eec44895ad9747d24d01df))
* add ton connect provider ([250ca69](https://github.com/rango-exchange/rango-client/commit/250ca69a7c4fa19d2bc9b054dc82cfab8b905fd5))
* implement updated design for initial connect modal ([469ff34](https://github.com/rango-exchange/rango-client/commit/469ff34f1d72e0bcda94d804c95055ce613d9803))
* migrate trust wallet to use hub and add support for solana ([b5b5749](https://github.com/rango-exchange/rango-client/commit/b5b5749216ee02e9f9fb11295e5b5d0533629409))
* Sui support for Phantom ([dff432b](https://github.com/rango-exchange/rango-client/commit/dff432b53b04cc9c8ccdda2c1b12168feca78e20))
* update sui to consider recent api changes ([265ff47](https://github.com/rango-exchange/rango-client/commit/265ff47fc90db86fd3c94183b3e48105241e6ae6))
* update wallets readme ([fa8d59d](https://github.com/rango-exchange/rango-client/commit/fa8d59df5688e1444cdb3b9321e775974e9f2e43))


### Performance Improvements

* lazy load signer packages ([bc6fa14](https://github.com/rango-exchange/rango-client/commit/bc6fa141c2281cb202294e8df5a78b11d1cdabfb))


### Reverts

* Revert "support for rango-types cjs format" ([a424f87](https://github.com/rango-exchange/rango-client/commit/a424f878872b128c1bc673f0d58ba1b99dd29d74))



# [0.46.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.45.1...provider-phantom@0.46.0) (2025-06-09)


### Bug Fixes

* fix phantom transaction failure on sui namespace disabled ([213b235](https://github.com/rango-exchange/rango-client/commit/213b23565b2729a48605d3d06ef5dd6daf66900f))


### Features

* migrate trust wallet to use hub and add support for solana ([61497fd](https://github.com/rango-exchange/rango-client/commit/61497fd40d48d48030e5a6d7ece53b5b7daf7b09))



## [0.45.1](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.45.0...provider-phantom@0.45.1) (2025-05-04)



# [0.45.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.44.0...provider-phantom@0.45.0) (2025-04-30)


### Bug Fixes

* error rethrow in or action ([61bc658](https://github.com/rango-exchange/rango-client/commit/61bc658f6a0dab513bb595e2943c85b675c65ada))
* rename pbt to ptb for sui ([3d6d89f](https://github.com/rango-exchange/rango-client/commit/3d6d89f2265766607a15d61e0df92643fb33072b))


### Features

* add can eager connect to namespaces ([16b4792](https://github.com/rango-exchange/rango-client/commit/16b4792f877b565ccf767be22ebe14fa79ddd8c6))
* implement updated design for initial connect modal ([2873c63](https://github.com/rango-exchange/rango-client/commit/2873c630de0740bb3b9f4e52bfa018857bd54dcd))
* Sui support for Phantom ([3769b8b](https://github.com/rango-exchange/rango-client/commit/3769b8ba174783190e242103548bcf4da28cff14))
* update sui to consider recent api changes ([d764b25](https://github.com/rango-exchange/rango-client/commit/d764b2501df9bb295f63cdbc0b05acd4a3abb4b9))
* update wallets readme ([0d52ecb](https://github.com/rango-exchange/rango-client/commit/0d52ecbee31b0d3241be71a6f77d508e4a15d3c4))



# [0.44.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.43.0...provider-phantom@0.44.0) (2025-03-11)


### Features

* add bitcoin signer for phantom on hub ([750124e](https://github.com/rango-exchange/rango-client/commit/750124e693753078abb537d4043964e2eebdbc01))



# [0.43.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.42.0...provider-phantom@0.43.0) (2025-02-23)


### Bug Fixes

* make hub compatible with external wallets ([316f18c](https://github.com/rango-exchange/rango-client/commit/316f18c4b270b5e94b7e475d6bf7922cdcc9c712))


### Features

* add an adapter for Hub for wallets-react and enabling Hub by default. ([a14bdf9](https://github.com/rango-exchange/rango-client/commit/a14bdf9619e448bc4568d6b758ca86d2359e1740))
* add base chain to phantom evm supported chains ([58a2d54](https://github.com/rango-exchange/rango-client/commit/58a2d54c0eff18e8d5ecf980b2487f7c8dada59f))



# [0.42.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.41.0...provider-phantom@0.42.0) (2025-01-20)



# [0.41.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.40.0...provider-phantom@0.41.0) (2024-12-30)



# [0.40.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.39.0...provider-phantom@0.40.0) (2024-11-27)


### Features

* add ton connect provider ([2a2dbb7](https://github.com/rango-exchange/rango-client/commit/2a2dbb79022263f19446ced49d298e04d63f927f))



# [0.39.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.38.0...provider-phantom@0.39.0) (2024-11-12)



# [0.38.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.37.0...provider-phantom@0.38.0) (2024-10-12)


### Bug Fixes

* bump sdk and fix type issues ([d442208](https://github.com/rango-exchange/rango-client/commit/d4422083bf5dd27d5f509ce1db7f9560d05428c8))


### Performance Improvements

* lazy load signer packages ([7b88f18](https://github.com/rango-exchange/rango-client/commit/7b88f1834f7b29b4b81ab6c81a07bb88e8ccf55c))



# [0.37.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.36.0...provider-phantom@0.37.0) (2024-09-10)



# [0.36.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.35.1...provider-phantom@0.36.0) (2024-08-11)



## [0.35.1](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.35.0...provider-phantom@0.35.1) (2024-07-14)



# [0.35.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.33.0...provider-phantom@0.35.0) (2024-07-09)



# [0.34.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.33.0...provider-phantom@0.34.0) (2024-06-01)



# [0.33.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.32.0...provider-phantom@0.33.0) (2024-05-14)



# [0.32.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.31.0...provider-phantom@0.32.0) (2024-04-24)



# [0.31.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.30.0...provider-phantom@0.31.0) (2024-04-23)



# [0.30.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.29.0...provider-phantom@0.30.0) (2024-04-09)


### Bug Fixes

* fix the connection problem that happens when another wallet takes over the requested one ([42df212](https://github.com/rango-exchange/rango-client/commit/42df2120aadd84c95045b0bf76844c19305fb59a))



# [0.29.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.28.0...provider-phantom@0.29.0) (2024-03-12)



# [0.28.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.27.0...provider-phantom@0.28.0) (2024-02-20)



# [0.27.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.26.0...provider-phantom@0.27.0) (2024-02-07)



# [0.26.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.25.0...provider-phantom@0.26.0) (2024-01-22)


### Bug Fixes

* cleanup wallets' subscriber when setProvider get null ([88d6a42](https://github.com/rango-exchange/rango-client/commit/88d6a423c49b34b3d9ff567e22df36c3b009bb76))



# [0.25.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.23.0...provider-phantom@0.25.0) (2023-12-24)


### Bug Fixes

* fix HMR for widget and playground ([8524820](https://github.com/rango-exchange/rango-client/commit/8524820f10cf0b8921f3db0c4f620ff98daa4103))



# [0.14.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.13.0...provider-phantom@0.14.0) (2023-08-03)



# [0.13.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.12.0...provider-phantom@0.13.0) (2023-08-01)



# [0.9.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.8.0...provider-phantom@0.9.0) (2023-07-31)



# [0.7.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.6.0...provider-phantom@0.7.0) (2023-07-11)



# [0.6.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.5.0...provider-phantom@0.6.0) (2023-07-11)


### Reverts

* Revert "support for rango-types cjs format" ([ed4e050](https://github.com/rango-exchange/rango-client/commit/ed4e050bfc0dcde7aeffa6b0d73b02080a5721eb))



# [0.5.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.4.0...provider-phantom@0.5.0) (2023-05-31)



# [0.4.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.3.0...provider-phantom@0.4.0) (2023-05-31)



# [0.3.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.2.0...provider-phantom@0.3.0) (2023-05-30)



# [0.2.0](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.1.15...provider-phantom@0.2.0) (2023-05-30)



## [0.1.14](https://github.com/rango-exchange/rango-client/compare/provider-phantom@0.1.13...provider-phantom@0.1.14) (2023-05-15)


### Bug Fixes

* update rango-types and fix notification bugs ([993f185](https://github.com/rango-exchange/rango-client/commit/993f185e0b8c5e5e15a2c65ba2d85d1f9c8daa90))



