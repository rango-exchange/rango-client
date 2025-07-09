# 0.48.0 (2025-07-09)


### Bug Fixes

* bnb bug in xdefi signer ([b887177](https://github.com/rango-exchange/rango-client/commit/b88717722a7ba3442bc4f38a90759cf38a2c607c))
* bump sdk and fix type issues ([c297c46](https://github.com/rango-exchange/rango-client/commit/c297c46620f853b6317664dae04061af3dfbbd71))
* cleanup wallets' subscriber when setProvider get null ([a05dfba](https://github.com/rango-exchange/rango-client/commit/a05dfba623facc20debeee3d149fddc779e66278))
* fix HMR for widget and playground ([71c15da](https://github.com/rango-exchange/rango-client/commit/71c15dadab4d161006b9f05a77c286b05c931528))
* fix the connection problem that happens when another wallet takes over the requested one ([e262f4c](https://github.com/rango-exchange/rango-client/commit/e262f4c03b7dbf486dbffb91cfea26f44f915953))
* remove null memo from utxo transactions ([38f3b58](https://github.com/rango-exchange/rango-client/commit/38f3b5827f2d6f0ee34d8da07f3462a52fb653eb))
* rename pbt to ptb for sui ([6023ef8](https://github.com/rango-exchange/rango-client/commit/6023ef84340b25430001d5efd0e005bdd96ff2ae))
* resolve conflicts between evm providers ([30cabfb](https://github.com/rango-exchange/rango-client/commit/30cabfbaddef41c3b0003f90aa4279d6fef934b8))
* resolve issues with the sign message method for certain solana providers ([d4d21a4](https://github.com/rango-exchange/rango-client/commit/d4d21a446d7f738e7c1fdc79048d17785689bff8))
* update rango-types and fix notification bugs ([e5660ec](https://github.com/rango-exchange/rango-client/commit/e5660ec9e67c96c9f27ddd29773b67aaa60a69d2))


### Features

* add new chains to xdefi ([7ee25d7](https://github.com/rango-exchange/rango-client/commit/7ee25d7f43c52f6a3b833aa0acf03c1b72ef5efb))
* add ton connect provider ([250ca69](https://github.com/rango-exchange/rango-client/commit/250ca69a7c4fa19d2bc9b054dc82cfab8b905fd5))
* implement sign message method for providers with a custom signer ([ce0c806](https://github.com/rango-exchange/rango-client/commit/ce0c8066434d6beba15cc1f5a9fac8f9022e31db))
* update ctrl wallet name and info ([88591d2](https://github.com/rango-exchange/rango-client/commit/88591d2037e7a94993bb334317792897ceb44cab))
* update sui to consider recent api changes ([265ff47](https://github.com/rango-exchange/rango-client/commit/265ff47fc90db86fd3c94183b3e48105241e6ae6))
* use psbt for bitcoin on xdefi/ctrl wallet ([b5cf944](https://github.com/rango-exchange/rango-client/commit/b5cf94480594515a1b4881a888d739ad748d7cbe))


### Performance Improvements

* enable code splitting in build process ([e929b66](https://github.com/rango-exchange/rango-client/commit/e929b6698d1f19074bf6552fc438fe1fed04930d))
* lazy load signer packages ([bc6fa14](https://github.com/rango-exchange/rango-client/commit/bc6fa141c2281cb202294e8df5a78b11d1cdabfb))


### Reverts

* Revert "support for rango-types cjs format" ([a424f87](https://github.com/rango-exchange/rango-client/commit/a424f878872b128c1bc673f0d58ba1b99dd29d74))



# [0.47.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.46.0...provider-xdefi@0.47.0) (2025-06-09)



# [0.46.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.45.1...provider-xdefi@0.46.0) (2025-05-26)


### Features

* use psbt for bitcoin on xdefi/ctrl wallet ([86abfbf](https://github.com/rango-exchange/rango-client/commit/86abfbfe725ce66de5cd344bd7a5c9894271c77e))



## [0.45.1](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.45.0...provider-xdefi@0.45.1) (2025-05-04)



# [0.45.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.44.0...provider-xdefi@0.45.0) (2025-04-30)


### Bug Fixes

* rename pbt to ptb for sui ([3d6d89f](https://github.com/rango-exchange/rango-client/commit/3d6d89f2265766607a15d61e0df92643fb33072b))


### Features

* update sui to consider recent api changes ([d764b25](https://github.com/rango-exchange/rango-client/commit/d764b2501df9bb295f63cdbc0b05acd4a3abb4b9))



# [0.44.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.43.0...provider-xdefi@0.44.0) (2025-03-11)



# [0.43.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.42.0...provider-xdefi@0.43.0) (2025-02-23)



# [0.42.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.41.0...provider-xdefi@0.42.0) (2025-01-20)



# [0.41.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.40.0...provider-xdefi@0.41.0) (2024-12-30)


### Features

* update ctrl wallet name and info ([fcde421](https://github.com/rango-exchange/rango-client/commit/fcde42144a995ec655388b95b606abc669a8c1a8))



# [0.40.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.39.0...provider-xdefi@0.40.0) (2024-11-27)


### Features

* add ton connect provider ([2a2dbb7](https://github.com/rango-exchange/rango-client/commit/2a2dbb79022263f19446ced49d298e04d63f927f))



# [0.39.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.38.1...provider-xdefi@0.39.0) (2024-11-12)



## [0.38.1](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.38.0...provider-xdefi@0.38.1) (2024-11-06)



# [0.38.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.37.1...provider-xdefi@0.38.0) (2024-10-12)


### Bug Fixes

* bump sdk and fix type issues ([d442208](https://github.com/rango-exchange/rango-client/commit/d4422083bf5dd27d5f509ce1db7f9560d05428c8))
* resolve issues with the sign message method for certain solana providers ([cbe83a3](https://github.com/rango-exchange/rango-client/commit/cbe83a3da8b48560b206fc2a7fa7cf062cdeaa23))


### Performance Improvements

* enable code splitting in build process ([fe5a41e](https://github.com/rango-exchange/rango-client/commit/fe5a41e0e297298de11cd74ca5825544742aa03a))
* lazy load signer packages ([7b88f18](https://github.com/rango-exchange/rango-client/commit/7b88f1834f7b29b4b81ab6c81a07bb88e8ccf55c))



## [0.37.1](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.37.0...provider-xdefi@0.37.1) (2024-10-05)


### Bug Fixes

* remove null memo from utxo transactions ([89d1a5b](https://github.com/rango-exchange/rango-client/commit/89d1a5b4a4bce700da48ad2089edf700de188f9c))



# [0.37.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.36.0...provider-xdefi@0.37.0) (2024-09-10)



# [0.36.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.35.1...provider-xdefi@0.36.0) (2024-08-11)


### Features

* implement sign message method for providers with a custom signer ([cf9515f](https://github.com/rango-exchange/rango-client/commit/cf9515feb5d3754aac9c228fe83315daf1350c85))



## [0.35.1](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.35.0...provider-xdefi@0.35.1) (2024-07-14)



# [0.35.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.33.2...provider-xdefi@0.35.0) (2024-07-09)



# [0.34.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.33.2...provider-xdefi@0.34.0) (2024-06-01)



## [0.33.2](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.33.1...provider-xdefi@0.33.2) (2024-05-26)



## [0.33.1](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.33.0...provider-xdefi@0.33.1) (2024-05-25)



# [0.33.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.32.1...provider-xdefi@0.33.0) (2024-05-14)



## [0.32.1](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.32.0...provider-xdefi@0.32.1) (2024-04-24)



# [0.32.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.31.0...provider-xdefi@0.32.0) (2024-04-24)



# [0.31.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.30.0...provider-xdefi@0.31.0) (2024-04-23)


### Bug Fixes

* resolve conflicts between evm providers ([9a6734c](https://github.com/rango-exchange/rango-client/commit/9a6734cf1537bf0504cf9058d4d775313a9e8e80))



# [0.30.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.29.0...provider-xdefi@0.30.0) (2024-04-09)


### Bug Fixes

* fix the connection problem that happens when another wallet takes over the requested one ([42df212](https://github.com/rango-exchange/rango-client/commit/42df2120aadd84c95045b0bf76844c19305fb59a))



# [0.29.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.28.0...provider-xdefi@0.29.0) (2024-03-12)


### Features

* add new chains to xdefi ([f780a9f](https://github.com/rango-exchange/rango-client/commit/f780a9f5ad5b4d42b5ea63cfc382059963f5332e))



# [0.28.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.27.0...provider-xdefi@0.28.0) (2024-02-20)



# [0.27.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.26.0...provider-xdefi@0.27.0) (2024-02-07)



# [0.26.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.25.0...provider-xdefi@0.26.0) (2024-01-22)


### Bug Fixes

* cleanup wallets' subscriber when setProvider get null ([88d6a42](https://github.com/rango-exchange/rango-client/commit/88d6a423c49b34b3d9ff567e22df36c3b009bb76))



# [0.25.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.23.0...provider-xdefi@0.25.0) (2023-12-24)


### Bug Fixes

* fix HMR for widget and playground ([8524820](https://github.com/rango-exchange/rango-client/commit/8524820f10cf0b8921f3db0c4f620ff98daa4103))



# [0.14.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.13.0...provider-xdefi@0.14.0) (2023-08-03)



# [0.13.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.12.0...provider-xdefi@0.13.0) (2023-08-01)



# [0.9.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.8.0...provider-xdefi@0.9.0) (2023-07-31)



# [0.7.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.6.0...provider-xdefi@0.7.0) (2023-07-11)



# [0.6.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.5.0...provider-xdefi@0.6.0) (2023-07-11)


### Bug Fixes

* bnb bug in xdefi signer ([6e4eeb3](https://github.com/rango-exchange/rango-client/commit/6e4eeb3006345d1e1f9a99c33803bee97f1af9db))


### Reverts

* Revert "support for rango-types cjs format" ([ed4e050](https://github.com/rango-exchange/rango-client/commit/ed4e050bfc0dcde7aeffa6b0d73b02080a5721eb))



# [0.5.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.4.0...provider-xdefi@0.5.0) (2023-05-31)



# [0.4.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.3.0...provider-xdefi@0.4.0) (2023-05-31)



# [0.3.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.2.0...provider-xdefi@0.3.0) (2023-05-30)



# [0.2.0](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.1.15...provider-xdefi@0.2.0) (2023-05-30)



## [0.1.14](https://github.com/rango-exchange/rango-client/compare/provider-xdefi@0.1.13...provider-xdefi@0.1.14) (2023-05-15)


### Bug Fixes

* update rango-types and fix notification bugs ([993f185](https://github.com/rango-exchange/rango-client/commit/993f185e0b8c5e5e15a2c65ba2d85d1f9c8daa90))



