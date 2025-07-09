# 0.46.0 (2025-07-09)


### Bug Fixes

* add api key to ethereum rpc url ([88e7152](https://github.com/rango-exchange/rango-client/commit/88e7152261afe1ec1781c76b1f12efc77a0d96ca))
* add ethers to shared package ([4dc8491](https://github.com/rango-exchange/rango-client/commit/4dc8491987d992eeb6865fe5d27d985cb3374006))
* add suggest and connect to wallet for  experimental chain ([501b9e4](https://github.com/rango-exchange/rango-client/commit/501b9e4242b96717bfc0ee90b708bebb314e4728))
* bump sdk and fix type issues ([c297c46](https://github.com/rango-exchange/rango-client/commit/c297c46620f853b6317664dae04061af3dfbbd71))
* check and version promise should be called ([6886ebf](https://github.com/rango-exchange/rango-client/commit/6886ebfde232590069a791f80b40f53aab46c0d6))
* cleanup wallets' subscriber when setProvider get null ([a05dfba](https://github.com/rango-exchange/rango-client/commit/a05dfba623facc20debeee3d149fddc779e66278))
* cosmostation wallet connection error ([0dc1086](https://github.com/rango-exchange/rango-client/commit/0dc1086591f2ce84480f187d8f6a63e895c00694))
* fix bug of duplicate modals for wallet connect ([1cf61cc](https://github.com/rango-exchange/rango-client/commit/1cf61ccab17c687c5422677eaf6d54d9666f5773))
* fix can switch network for wallet connect ([d65f9b8](https://github.com/rango-exchange/rango-client/commit/d65f9b8517860f76611da478d567164fc59254ad))
* fix ctrl wallet fail to connect problem ([03efb90](https://github.com/rango-exchange/rango-client/commit/03efb900b4f78f92eab9f59526a911a5f040cd4a))
* fix HMR for widget and playground ([71c15da](https://github.com/rango-exchange/rango-client/commit/71c15dadab4d161006b9f05a77c286b05c931528))
* fix retry swap on connect wallet ([bd15e9a](https://github.com/rango-exchange/rango-client/commit/bd15e9ab862564b4e6bef1156a34b608892a93e6))
* fix some swap messages in widget-embedded ([548c236](https://github.com/rango-exchange/rango-client/commit/548c2362859b686de8c95475b3ce610c8301226f))
* fix the bug where xdefi is not displayed for experimental networks ([c95a31e](https://github.com/rango-exchange/rango-client/commit/c95a31efc40832c7d98e7a962b9448e530114a2a))
* fix the connection problem that happens when another wallet takes over the requested one ([e262f4c](https://github.com/rango-exchange/rango-client/commit/e262f4c03b7dbf486dbffb91cfea26f44f915953))
* fix wallet connect namespace and switch network ([b338600](https://github.com/rango-exchange/rango-client/commit/b338600a6a58e301bd2ef8e181ead7ee751bb78b))
* handle safe wallet in widget ([8e98b59](https://github.com/rango-exchange/rango-client/commit/8e98b59652ca67bc7501f6b13b549915583f48bf))
* handle switch network flow for wallet-connect ([8066473](https://github.com/rango-exchange/rango-client/commit/8066473b27be525cf220da4070de780ef9b603dd))
* refactor station wallet ([66807fb](https://github.com/rango-exchange/rango-client/commit/66807fb6358c4a362d7df9fe71454cdbc3058ff4))
* rename pbt to ptb for sui ([6023ef8](https://github.com/rango-exchange/rango-client/commit/6023ef84340b25430001d5efd0e005bdd96ff2ae))
* resolve conflicts between evm providers ([30cabfb](https://github.com/rango-exchange/rango-client/commit/30cabfbaddef41c3b0003f90aa4279d6fef934b8))
* resolve issue with connecting to solana namespace ([0b6134a](https://github.com/rango-exchange/rango-client/commit/0b6134ad909d0524561e5fdf81ea6e1e8c4dbec6))
* update rango-types and fix notification bugs ([e5660ec](https://github.com/rango-exchange/rango-client/commit/e5660ec9e67c96c9f27ddd29773b67aaa60a69d2))


### Features

* add a modal for setting custom derivation path for ledger ([6e33216](https://github.com/rango-exchange/rango-client/commit/6e332160cd1febeded77230c30bb04bea70853c9))
* add bitcoin signer for phantom on hub ([822c346](https://github.com/rango-exchange/rango-client/commit/822c34622d5e2505496f2da39699c9a275912d4e))
* add bitkeep wallet ([2b89b3f](https://github.com/rango-exchange/rango-client/commit/2b89b3f463f2ee87e6aa6e01544d8dd48aeb370a))
* add cosmos account and signer for math wallet ([330fe79](https://github.com/rango-exchange/rango-client/commit/330fe795658245f5330635ca6155b35a25de74fe))
* add default injected wallet ([4d9bfaa](https://github.com/rango-exchange/rango-client/commit/4d9bfaab7baf2558f7ca2f5d5a828b9c1bee7763))
* add ethereum for ledger ([3b23fa0](https://github.com/rango-exchange/rango-client/commit/3b23fa0f4e4f88881fff85a4f1d77ac6a49cf758))
* add new chains to xdefi ([7ee25d7](https://github.com/rango-exchange/rango-client/commit/7ee25d7f43c52f6a3b833aa0acf03c1b72ef5efb))
* add project id as a external value ([a4146ea](https://github.com/rango-exchange/rango-client/commit/a4146eab7586754312c9a4f5ed91e072a8f6c391))
* add solana to ledger ([2db1c76](https://github.com/rango-exchange/rango-client/commit/2db1c76bbf3a158a4f9fc9d14f8458e829a94763))
* add solflare snap connect and signer ([cbbcda9](https://github.com/rango-exchange/rango-client/commit/cbbcda948f3af4a00b52bde11964bdd5faee852e))
* add sui namespace support for widget ([c489a97](https://github.com/rango-exchange/rango-client/commit/c489a978ebb5baa311898670bac6a47f03f5a1c9))
* add support for Trezor hardware wallet ([838a17d](https://github.com/rango-exchange/rango-client/commit/838a17db0e780664f19b3c6edde82f1972af858d))
* add ton connect provider ([250ca69](https://github.com/rango-exchange/rango-client/commit/250ca69a7c4fa19d2bc9b054dc82cfab8b905fd5))
* don't show safe when not injected ([94becf8](https://github.com/rango-exchange/rango-client/commit/94becf80f85bad2663a81cc88d1ac7d18836ab79))
* integrate rabby wallet extension ([8e6835d](https://github.com/rango-exchange/rango-client/commit/8e6835d6e49649a82ca500d37a9ffbdd4e88b51c))
* integrate slush wallet ([b083573](https://github.com/rango-exchange/rango-client/commit/b083573cc3d9b83da110571cf622d6fd72461fe8))
* integrate solflare wallet ([b63a04b](https://github.com/rango-exchange/rango-client/commit/b63a04beff58f8046b4e2ace6ecdae41a3e3432e))
* integrate tomo wallet extension ([21b6615](https://github.com/rango-exchange/rango-client/commit/21b6615269aadffa532e3d705b615c85e2ca2760))
* support braavos wallet ([c0c2e44](https://github.com/rango-exchange/rango-client/commit/c0c2e446e30ae3f73c3771bafa98ee7a310dc2ad))
* Support for WalletConnect 2 ([9abf37a](https://github.com/rango-exchange/rango-client/commit/9abf37a201e1435ef53b0b31e6c911d3c6fed17a))
* support safe wallet ([d3429d0](https://github.com/rango-exchange/rango-client/commit/d3429d00fe1bee097f2a946bea9cb2e04803d7b8))
* update confirm swap and confirm wallets components ([0bfcee3](https://github.com/rango-exchange/rango-client/commit/0bfcee3b14455ead392c6912c309f168f1c3b16f))
* update sui to consider recent api changes ([265ff47](https://github.com/rango-exchange/rango-client/commit/265ff47fc90db86fd3c94183b3e48105241e6ae6))


### Reverts

* Revert "support for rango-types cjs format" ([a424f87](https://github.com/rango-exchange/rango-client/commit/a424f878872b128c1bc673f0d58ba1b99dd29d74))



# [0.45.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.44.1...wallets-shared@0.45.0) (2025-06-09)


### Bug Fixes

* fix retry swap on connect wallet ([f6c45b6](https://github.com/rango-exchange/rango-client/commit/f6c45b6c4a6b92a208e04606b42ed98d327ad349))


### Features

* integrate slush wallet ([9e9a5cc](https://github.com/rango-exchange/rango-client/commit/9e9a5ccb802fbd1f9a50322a89f65b557f152c6a))



## [0.44.1](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.44.0...wallets-shared@0.44.1) (2025-05-04)


### Bug Fixes

* add api key to ethereum rpc url ([1591335](https://github.com/rango-exchange/rango-client/commit/159133507fb0f85f045b1f4104ad9b1d6846bb2c))



# [0.44.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.43.0...wallets-shared@0.44.0) (2025-04-30)


### Bug Fixes

* rename pbt to ptb for sui ([3d6d89f](https://github.com/rango-exchange/rango-client/commit/3d6d89f2265766607a15d61e0df92643fb33072b))


### Features

* update sui to consider recent api changes ([d764b25](https://github.com/rango-exchange/rango-client/commit/d764b2501df9bb295f63cdbc0b05acd4a3abb4b9))



# [0.43.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.42.0...wallets-shared@0.43.0) (2025-03-11)


### Features

* add bitcoin signer for phantom on hub ([750124e](https://github.com/rango-exchange/rango-client/commit/750124e693753078abb537d4043964e2eebdbc01))
* add sui namespace support for widget ([990d4c3](https://github.com/rango-exchange/rango-client/commit/990d4c32e7ad674c01140ca0bd557d541c596bbb))



# [0.42.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.41.0...wallets-shared@0.42.0) (2025-02-23)


### Bug Fixes

* resolve issue with connecting to solana namespace ([1bde858](https://github.com/rango-exchange/rango-client/commit/1bde858230744fcea6ac4d313aed82e2a4af7b21))



# [0.41.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.40.0...wallets-shared@0.41.0) (2024-12-30)


### Bug Fixes

* fix ctrl wallet fail to connect problem ([f1bfedc](https://github.com/rango-exchange/rango-client/commit/f1bfedcf4e9bf4cf55c2bee7c954b83dbbb6376c))



# [0.40.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.39.0...wallets-shared@0.40.0) (2024-11-27)


### Features

* add ton connect provider ([2a2dbb7](https://github.com/rango-exchange/rango-client/commit/2a2dbb79022263f19446ced49d298e04d63f927f))



# [0.39.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.38.0...wallets-shared@0.39.0) (2024-11-12)



# [0.38.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.37.0...wallets-shared@0.38.0) (2024-10-12)


### Bug Fixes

* bump sdk and fix type issues ([d442208](https://github.com/rango-exchange/rango-client/commit/d4422083bf5dd27d5f509ce1db7f9560d05428c8))
* cosmostation wallet connection error ([b3747ba](https://github.com/rango-exchange/rango-client/commit/b3747ba77d06a5c02ce670affb337771e606434b))



# [0.37.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.36.0...wallets-shared@0.37.0) (2024-09-10)



# [0.36.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.35.1...wallets-shared@0.36.0) (2024-08-11)


### Features

* integrate solflare wallet ([fb6aaf1](https://github.com/rango-exchange/rango-client/commit/fb6aaf1c255149df18a75a7bfb16fc83c23b85a8))



## [0.35.1](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.35.0...wallets-shared@0.35.1) (2024-07-14)



# [0.35.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.33.0...wallets-shared@0.35.0) (2024-07-09)


### Bug Fixes

* fix the bug where xdefi is not displayed for experimental networks ([723eb2d](https://github.com/rango-exchange/rango-client/commit/723eb2dc3bfacce8753eeee011910b595d45028d))


### Features

* add a modal for setting custom derivation path for ledger ([5b74ec0](https://github.com/rango-exchange/rango-client/commit/5b74ec049393ed74e3e7547edc72b68bd70b7dce))
* add support for Trezor hardware wallet ([6edecbb](https://github.com/rango-exchange/rango-client/commit/6edecbb14fd008fc741c892bfa3e025c10160b9b))
* integrate rabby wallet extension ([145fb8f](https://github.com/rango-exchange/rango-client/commit/145fb8ffbbf5e46e7e8386aeffcefc8f4ddb22e7))
* integrate tomo wallet extension ([9f0f065](https://github.com/rango-exchange/rango-client/commit/9f0f0650fcd213a621dcc6ddca3e32424c1a5ada))



# [0.34.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.33.0...wallets-shared@0.34.0) (2024-06-01)



# [0.33.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.32.0...wallets-shared@0.33.0) (2024-05-14)


### Features

* add solana to ledger ([77b6695](https://github.com/rango-exchange/rango-client/commit/77b6695758165f9258a0ba5bd3b2cf39b0b2aab5))



# [0.32.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.31.0...wallets-shared@0.32.0) (2024-04-24)


### Features

* add ethereum for ledger ([084aae2](https://github.com/rango-exchange/rango-client/commit/084aae28adaf0310dffe3a3100dd783252393053))



# [0.31.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.30.0...wallets-shared@0.31.0) (2024-04-23)


### Bug Fixes

* resolve conflicts between evm providers ([9a6734c](https://github.com/rango-exchange/rango-client/commit/9a6734cf1537bf0504cf9058d4d775313a9e8e80))


### Features

* add solflare snap connect and signer ([42aa2b0](https://github.com/rango-exchange/rango-client/commit/42aa2b039dd910e8e44db473e1acd28689a8b43b))



# [0.30.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.29.0...wallets-shared@0.30.0) (2024-04-09)


### Bug Fixes

* fix the connection problem that happens when another wallet takes over the requested one ([42df212](https://github.com/rango-exchange/rango-client/commit/42df2120aadd84c95045b0bf76844c19305fb59a))



# [0.29.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.28.0...wallets-shared@0.29.0) (2024-03-12)


### Bug Fixes

* fix wallet connect namespace and switch network ([c8f31b3](https://github.com/rango-exchange/rango-client/commit/c8f31b3ddf4ceeaf745bc089f530b6a4b1eb9637))


### Features

* add new chains to xdefi ([f780a9f](https://github.com/rango-exchange/rango-client/commit/f780a9f5ad5b4d42b5ea63cfc382059963f5332e))



# [0.28.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.27.0...wallets-shared@0.28.0) (2024-02-20)


### Bug Fixes

* fix some swap messages in widget-embedded ([f859190](https://github.com/rango-exchange/rango-client/commit/f85919050b0c8f3bb0f91d4f3b87a58cca29601b))


### Features

* add cosmos account and signer for math wallet ([e43a489](https://github.com/rango-exchange/rango-client/commit/e43a48936a63804d688f3ad1408244d7f2ff32f2))



# [0.27.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.26.0...wallets-shared@0.27.0) (2024-02-07)


### Bug Fixes

* add ethers to shared package ([5990eff](https://github.com/rango-exchange/rango-client/commit/5990eff3a5cc90d915fafa1048ef02ddeacf225d))



# [0.26.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.25.0...wallets-shared@0.26.0) (2024-01-22)


### Bug Fixes

* cleanup wallets' subscriber when setProvider get null ([88d6a42](https://github.com/rango-exchange/rango-client/commit/88d6a423c49b34b3d9ff567e22df36c3b009bb76))


### Features

* add default injected wallet ([238977c](https://github.com/rango-exchange/rango-client/commit/238977c0e3cd09feba9f2557f1b099b9af3afb0d))



# [0.25.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.23.0...wallets-shared@0.25.0) (2023-12-24)


### Bug Fixes

* fix HMR for widget and playground ([8524820](https://github.com/rango-exchange/rango-client/commit/8524820f10cf0b8921f3db0c4f620ff98daa4103))
* handle safe wallet in widget ([52fcca4](https://github.com/rango-exchange/rango-client/commit/52fcca49315f7e2edb4655ae7b9cd0792c2800d7))
* handle switch network flow for wallet-connect ([8c4a17b](https://github.com/rango-exchange/rango-client/commit/8c4a17b47b2919820a4e0726f6d1c48b8994abe3))



# [0.14.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.13.0...wallets-shared@0.14.0) (2023-08-03)



# [0.13.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.12.0...wallets-shared@0.13.0) (2023-08-01)



# [0.9.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.8.0...wallets-shared@0.9.0) (2023-07-31)


### Features

* add project id as a external value ([0c80404](https://github.com/rango-exchange/rango-client/commit/0c80404a8cacb6c5b0338dea1e416b0b11db254b))
* support braavos wallet ([fb38ebe](https://github.com/rango-exchange/rango-client/commit/fb38ebef00a33b92cabf506c88ef83d8c77cce84))
* Support for WalletConnect 2 ([faedef0](https://github.com/rango-exchange/rango-client/commit/faedef0b5e6fc3c5ef881cbbe4ec05334cc1c910))
* support safe wallet ([d04cbcd](https://github.com/rango-exchange/rango-client/commit/d04cbcd2a612755563512d9dff6f2312088d8b4d))



# [0.7.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.6.0...wallets-shared@0.7.0) (2023-07-11)



# [0.6.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.5.0...wallets-shared@0.6.0) (2023-07-11)


### Features

* add bitkeep wallet ([c02c3df](https://github.com/rango-exchange/rango-client/commit/c02c3dfd236070295eada74aeb97514f8dacd0ed))


### Reverts

* Revert "support for rango-types cjs format" ([ed4e050](https://github.com/rango-exchange/rango-client/commit/ed4e050bfc0dcde7aeffa6b0d73b02080a5721eb))



# [0.5.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.4.0...wallets-shared@0.5.0) (2023-05-31)



# [0.4.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.3.0...wallets-shared@0.4.0) (2023-05-31)



# [0.3.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.2.0...wallets-shared@0.3.0) (2023-05-30)



# [0.2.0](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.1.14...wallets-shared@0.2.0) (2023-05-30)


### Bug Fixes

* fix bug of duplicate modals for wallet connect ([efb5482](https://github.com/rango-exchange/rango-client/commit/efb54827fd51e6c6c8f42c6abf33c3d7610755e8))
* fix can switch network for wallet connect ([e3cdeac](https://github.com/rango-exchange/rango-client/commit/e3cdeacd836e254ea2d5384aab4b624a3e7259eb))



## [0.1.13](https://github.com/rango-exchange/rango-client/compare/wallets-shared@0.1.12...wallets-shared@0.1.13) (2023-05-15)


### Bug Fixes

* check and version promise should be called ([c9317b5](https://github.com/rango-exchange/rango-client/commit/c9317b5f5b177216f64314aa00208a382ef2829f))
* refactor station wallet ([580a2af](https://github.com/rango-exchange/rango-client/commit/580a2af692f63a85921d69152464143551b3f748))
* update rango-types and fix notification bugs ([993f185](https://github.com/rango-exchange/rango-client/commit/993f185e0b8c5e5e15a2c65ba2d85d1f9c8daa90))



