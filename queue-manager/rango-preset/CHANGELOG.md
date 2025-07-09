# 0.47.0 (2025-07-09)


### Bug Fixes

* a bug in updateHash ([9ce8ccb](https://github.com/rango-exchange/rango-client/commit/9ce8ccb9c3c3a8fc4277a876515c6ee16c4afe9a))
* add initial state with props in app store and fix bug of passing liquidity sources via config ([9854c5e](https://github.com/rango-exchange/rango-client/commit/9854c5edb1536df43ba7ef4a5d24b0db6bce93ce))
* add wallets-core to rango-preset package dependencies ([b9700ca](https://github.com/rango-exchange/rango-client/commit/b9700ca160ace208027055f3a3e9b6eb47907647))
* avoid getting transaction receipt multiple times ([2369e06](https://github.com/rango-exchange/rango-client/commit/2369e067e165c53e5791dec8ef0df60c70a89d60))
* better parsing of evm rpc errors ([5e23cc0](https://github.com/rango-exchange/rango-client/commit/5e23cc00e207db0fe9c3041f8e8b1bc27e29b88d))
* bump sdk and fix type issues ([c297c46](https://github.com/rango-exchange/rango-client/commit/c297c46620f853b6317664dae04061af3dfbbd71))
* checking starknet and tron approval ([ff857fe](https://github.com/rango-exchange/rango-client/commit/ff857fe5f5bd172486ca0e740451742c9e4ed2b3))
* display correct network in switch network modal ([4494f3c](https://github.com/rango-exchange/rango-client/commit/4494f3c96bffe6f26cf31e19f0ca7e6be3a38e81))
* display transaction url after refreshing ([96b9bd7](https://github.com/rango-exchange/rango-client/commit/96b9bd7d9ca99ce466aa86ef1fd9b5ccc8f0ed86))
* fix bug of duplicate modals for wallet connect ([1cf61cc](https://github.com/rango-exchange/rango-client/commit/1cf61ccab17c687c5422677eaf6d54d9666f5773))
* fix emitting failed event in swap execution ([d7e6610](https://github.com/rango-exchange/rango-client/commit/d7e66104ad52d928dd6f4d0413e6a47d3de410f5))
* fix flow bug when check status failed ([66ba427](https://github.com/rango-exchange/rango-client/commit/66ba42701b83a897aab9695a359c587f4e486e37))
* fix HMR for widget and playground ([71c15da](https://github.com/rango-exchange/rango-client/commit/71c15dadab4d161006b9f05a77c286b05c931528))
* fix retry logic in failed swaps ([2395df7](https://github.com/rango-exchange/rango-client/commit/2395df7744b894369add0f020930b8651eaae1ce))
* fix retry swap on connect wallet ([bd15e9a](https://github.com/rango-exchange/rango-client/commit/bd15e9ab862564b4e6bef1156a34b608892a93e6))
* fix signer wait change network issues ([57e9a89](https://github.com/rango-exchange/rango-client/commit/57e9a898dc5be0109ef5821bce5059a052dc7aba))
* fix some swap messages in widget-embedded ([548c236](https://github.com/rango-exchange/rango-client/commit/548c2362859b686de8c95475b3ce610c8301226f))
* fix widget event hook ([497f61c](https://github.com/rango-exchange/rango-client/commit/497f61c0d161ca041170fc2d34b4e7f0c3c4f6aa))
* getChainId & networkMatched on wallet connect v1 ([c2e8a29](https://github.com/rango-exchange/rango-client/commit/c2e8a29299e268f59f2cef781936fa8f36f35bcc))
* handle replaced transactions ([092f4ef](https://github.com/rango-exchange/rango-client/commit/092f4efcd0468d25df13fe2d0e1aecac54c7141e))
* increase approval checking interval ([2d77521](https://github.com/rango-exchange/rango-client/commit/2d77521cd604e5f374155f947ccb44301cd85f2f))
* rename pbt to ptb for sui ([6023ef8](https://github.com/rango-exchange/rango-client/commit/6023ef84340b25430001d5efd0e005bdd96ff2ae))
* show network name instead of namespace ([0853c27](https://github.com/rango-exchange/rango-client/commit/0853c2771c9310a01ee617baec9520c7e5ea12d3))
* showing correct network in notification ([c540ef0](https://github.com/rango-exchange/rango-client/commit/c540ef041262337dc5a06d66993b37abe99c4b50))
* throw error on sdk's create transaction ([47e2947](https://github.com/rango-exchange/rango-client/commit/47e29470c0e972b92a5c15db07aba83c2cec29f4))
* update rango-types and fix notification bugs ([e5660ec](https://github.com/rango-exchange/rango-client/commit/e5660ec9e67c96c9f27ddd29773b67aaa60a69d2))


### Features

* add an adapter for Hub for wallets-react and enabling Hub by default. ([016fe92](https://github.com/rango-exchange/rango-client/commit/016fe924f30426b5ee92313c2bb9213a31210d71))
* add state of wallets' details to useWidget ([80c2fad](https://github.com/rango-exchange/rango-client/commit/80c2fadb122534bd843bd8132c44f9172ead2f2b))
* add sui namespace support for widget ([c489a97](https://github.com/rango-exchange/rango-client/commit/c489a978ebb5baa311898670bac6a47f03f5a1c9))
* add Ton Transaction and integrate MyTonWallet ([16c81c3](https://github.com/rango-exchange/rango-client/commit/16c81c31e1474f55aedeeff3f8a46be74b9f9cba))
* add widget events and refactor swap execution events ([3c1c828](https://github.com/rango-exchange/rango-client/commit/3c1c8286c86a06692528d7581e528aeef6b6451b))
* export notifications from useWidget ([bb615cb](https://github.com/rango-exchange/rango-client/commit/bb615cb80e8457dc745b65ec275ac779f8ef9573))
* Get Wallet Connect project id from config ([74d189e](https://github.com/rango-exchange/rango-client/commit/74d189e095d44dffba5b4145c8cf264e8e6a1a37))
* logging packages to be able to create log records and capture them. ([cd0b710](https://github.com/rango-exchange/rango-client/commit/cd0b710aa9917d55e27419c5e6e0e17b2422bfd9))
* support new widget events ([cf3521d](https://github.com/rango-exchange/rango-client/commit/cf3521d459cd3dde2cef4aaebedf04a99e3431f3))
* support safe wallet ([d3429d0](https://github.com/rango-exchange/rango-client/commit/d3429d00fe1bee097f2a946bea9cb2e04803d7b8))
* update payload for events ([b3b8706](https://github.com/rango-exchange/rango-client/commit/b3b8706195d7d83aab7ca38e66ceb0e1c72fa2cc))
* update sui to consider recent api changes ([265ff47](https://github.com/rango-exchange/rango-client/commit/265ff47fc90db86fd3c94183b3e48105241e6ae6))
* update the event payload for failed step and failed route events ([bc1d759](https://github.com/rango-exchange/rango-client/commit/bc1d7590eaccc57cf680ceb40a53075c8a6eb174))


### Performance Improvements

* improve finding tokens from store ([ab2a0ea](https://github.com/rango-exchange/rango-client/commit/ab2a0ea487d80f400d392d3c41cbfcfa15cd1a19))
* lazy load signer packages ([bc6fa14](https://github.com/rango-exchange/rango-client/commit/bc6fa141c2281cb202294e8df5a78b11d1cdabfb))



# [0.46.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.45.1...queue-manager-rango-preset@0.46.0) (2025-06-09)


### Bug Fixes

* fix retry swap on connect wallet ([f6c45b6](https://github.com/rango-exchange/rango-client/commit/f6c45b6c4a6b92a208e04606b42ed98d327ad349))



## [0.45.1](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.45.0...queue-manager-rango-preset@0.45.1) (2025-05-04)



# [0.45.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.44.0...queue-manager-rango-preset@0.45.0) (2025-04-30)


### Bug Fixes

* rename pbt to ptb for sui ([3d6d89f](https://github.com/rango-exchange/rango-client/commit/3d6d89f2265766607a15d61e0df92643fb33072b))
* show network name instead of namespace ([0d46834](https://github.com/rango-exchange/rango-client/commit/0d46834cc820ff93165279d655a7d80b469320d8))


### Features

* update sui to consider recent api changes ([d764b25](https://github.com/rango-exchange/rango-client/commit/d764b2501df9bb295f63cdbc0b05acd4a3abb4b9))



# [0.44.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.43.0...queue-manager-rango-preset@0.44.0) (2025-03-11)


### Features

* add sui namespace support for widget ([990d4c3](https://github.com/rango-exchange/rango-client/commit/990d4c32e7ad674c01140ca0bd557d541c596bbb))
* update the event payload for failed step and failed route events ([75aa989](https://github.com/rango-exchange/rango-client/commit/75aa9898040aede600aee2d9aa8188295a5a37ae))



# [0.43.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.42.0...queue-manager-rango-preset@0.43.0) (2025-02-23)


### Bug Fixes

* display correct network in switch network modal ([8a558f1](https://github.com/rango-exchange/rango-client/commit/8a558f190cc1c25e15a1ca57a7c3f760906fd067))
* showing correct network in notification ([3c4ef13](https://github.com/rango-exchange/rango-client/commit/3c4ef1320f773dadc174d49a707ebfae73b7c0db))


### Features

* add an adapter for Hub for wallets-react and enabling Hub by default. ([a14bdf9](https://github.com/rango-exchange/rango-client/commit/a14bdf9619e448bc4568d6b758ca86d2359e1740))



# [0.42.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.41.0...queue-manager-rango-preset@0.42.0) (2025-01-27)


### Features

* update payload for events ([36a11b6](https://github.com/rango-exchange/rango-client/commit/36a11b6cebc153eced9e01f97fa1fabaf9a44e9f))



# [0.41.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.40.0...queue-manager-rango-preset@0.41.0) (2024-12-30)



# [0.40.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.39.0...queue-manager-rango-preset@0.40.0) (2024-11-27)



# [0.39.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.38.0...queue-manager-rango-preset@0.39.0) (2024-11-12)



# [0.38.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.37.0...queue-manager-rango-preset@0.38.0) (2024-10-12)


### Bug Fixes

* bump sdk and fix type issues ([d442208](https://github.com/rango-exchange/rango-client/commit/d4422083bf5dd27d5f509ce1db7f9560d05428c8))


### Performance Improvements

* lazy load signer packages ([7b88f18](https://github.com/rango-exchange/rango-client/commit/7b88f1834f7b29b4b81ab6c81a07bb88e8ccf55c))



# [0.37.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.36.0...queue-manager-rango-preset@0.37.0) (2024-09-10)



# [0.36.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.35.1...queue-manager-rango-preset@0.36.0) (2024-08-11)



## [0.35.1](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.35.0...queue-manager-rango-preset@0.35.1) (2024-07-14)



# [0.35.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.33.2...queue-manager-rango-preset@0.35.0) (2024-07-09)


### Features

* support new widget events ([37a9b6c](https://github.com/rango-exchange/rango-client/commit/37a9b6c023cba660c87af27bcbfceadfb8daa8d0))


### Performance Improvements

* improve finding tokens from store ([3e890bd](https://github.com/rango-exchange/rango-client/commit/3e890bdcd47971b072f347c368c4370225cb11ff))



# [0.34.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.33.2...queue-manager-rango-preset@0.34.0) (2024-06-01)



## [0.33.2](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.33.1...queue-manager-rango-preset@0.33.2) (2024-05-26)



## [0.33.1](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.33.0...queue-manager-rango-preset@0.33.1) (2024-05-25)



# [0.33.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.32.0...queue-manager-rango-preset@0.33.0) (2024-05-14)



# [0.32.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.31.0...queue-manager-rango-preset@0.32.0) (2024-04-24)



# [0.31.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.30.0...queue-manager-rango-preset@0.31.0) (2024-04-23)



# [0.30.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.29.1...queue-manager-rango-preset@0.30.0) (2024-04-09)


### Bug Fixes

* fix widget event hook ([c8547b6](https://github.com/rango-exchange/rango-client/commit/c8547b6a31354afe13aa32c0b72be5b62b3f0d67))



## [0.29.1](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.29.0...queue-manager-rango-preset@0.29.1) (2024-03-12)


### Bug Fixes

* increase approval checking interval ([e6444c8](https://github.com/rango-exchange/rango-client/commit/e6444c84dd216ddcf949b49708bb2c358fee2d88))



# [0.29.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.28.0...queue-manager-rango-preset@0.29.0) (2024-03-12)


### Features

* logging packages to be able to create log records and capture them. ([ca9b7e9](https://github.com/rango-exchange/rango-client/commit/ca9b7e918d67bf0d93e5b8313264c5984f3adb4e))



# [0.28.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.27.0...queue-manager-rango-preset@0.28.0) (2024-02-20)


### Bug Fixes

* fix some swap messages in widget-embedded ([f859190](https://github.com/rango-exchange/rango-client/commit/f85919050b0c8f3bb0f91d4f3b87a58cca29601b))



# [0.27.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.26.0...queue-manager-rango-preset@0.27.0) (2024-02-07)



# [0.26.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.25.0...queue-manager-rango-preset@0.26.0) (2024-01-22)


### Features

* export notifications from useWidget ([fc50baf](https://github.com/rango-exchange/rango-client/commit/fc50baf1b4043755162a54bcdd07f10fab94da39))



# [0.25.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.24.0...queue-manager-rango-preset@0.25.0) (2023-12-24)


### Bug Fixes

* add initial state with props in app store and fix bug of passing liquidity sources via config ([5d50d0f](https://github.com/rango-exchange/rango-client/commit/5d50d0fa18c0519a9464bb205684ecdaf881d936))
* add wallets-core to rango-preset package dependencies ([0a8920a](https://github.com/rango-exchange/rango-client/commit/0a8920a11db4a8d213e01ee770289242bf1defc8))
* display transaction url after refreshing ([c976bff](https://github.com/rango-exchange/rango-client/commit/c976bffd3827ee20de5dd0f21be6d430432fff28))
* fix emitting failed event in swap execution ([cedc535](https://github.com/rango-exchange/rango-client/commit/cedc53523dc8ddc5f339b4da6afa822058bd760d))
* fix HMR for widget and playground ([8524820](https://github.com/rango-exchange/rango-client/commit/8524820f10cf0b8921f3db0c4f620ff98daa4103))


### Features

* add state of wallets' details to useWidget ([2a59055](https://github.com/rango-exchange/rango-client/commit/2a590551cc0a3d663fd9901e125890ff1386c0aa))



# [0.14.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.13.0...queue-manager-rango-preset@0.14.0) (2023-08-03)



# [0.13.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.12.0...queue-manager-rango-preset@0.13.0) (2023-08-01)



# [0.9.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.8.0...queue-manager-rango-preset@0.9.0) (2023-07-31)


### Features

* Get Wallet Connect project id from config ([9fb30b4](https://github.com/rango-exchange/rango-client/commit/9fb30b4b1a83e2005bbf42553298f24b1e278e1c))
* support safe wallet ([d04cbcd](https://github.com/rango-exchange/rango-client/commit/d04cbcd2a612755563512d9dff6f2312088d8b4d))



# [0.7.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.6.0...queue-manager-rango-preset@0.7.0) (2023-07-11)



# [0.6.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.5.0...queue-manager-rango-preset@0.6.0) (2023-07-11)


### Bug Fixes

* better parsing of evm rpc errors ([f23031a](https://github.com/rango-exchange/rango-client/commit/f23031ae14e6e841ee488591bd1bf58cfa7ca15b))
* fix signer wait change network issues ([e453db6](https://github.com/rango-exchange/rango-client/commit/e453db6ccf7736e36e5ada0c29502be32254fe9c))


### Features

* add widget events and refactor swap execution events ([0d76806](https://github.com/rango-exchange/rango-client/commit/0d7680693dd77439de38cd0b20f263f6ae8cceb0))



# [0.5.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.4.0...queue-manager-rango-preset@0.5.0) (2023-05-31)



# [0.4.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.3.0...queue-manager-rango-preset@0.4.0) (2023-05-31)



# [0.3.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.2.0...queue-manager-rango-preset@0.3.0) (2023-05-30)



# [0.2.0](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.1.14...queue-manager-rango-preset@0.2.0) (2023-05-30)


### Bug Fixes

* avoid getting transaction receipt multiple times ([3ef2875](https://github.com/rango-exchange/rango-client/commit/3ef2875bfad470cf2780ae5f82c4841e7eeb60ff))
* fix bug of duplicate modals for wallet connect ([efb5482](https://github.com/rango-exchange/rango-client/commit/efb54827fd51e6c6c8f42c6abf33c3d7610755e8))
* handle replaced transactions ([1c8598d](https://github.com/rango-exchange/rango-client/commit/1c8598d2755afc9e439ee80c0951d83c6aed9f2a))



## [0.1.13](https://github.com/rango-exchange/rango-client/compare/queue-manager-rango-preset@0.1.12...queue-manager-rango-preset@0.1.13) (2023-05-15)


### Bug Fixes

* fix flow bug when check status failed ([3a886e6](https://github.com/rango-exchange/rango-client/commit/3a886e68cf45c8bf500823fae96070acbbd3942a))
* getChainId & networkMatched on wallet connect v1 ([9ec8cfb](https://github.com/rango-exchange/rango-client/commit/9ec8cfbd3f9be9befcfb632485afa1ee436e92a2))
* update rango-types and fix notification bugs ([993f185](https://github.com/rango-exchange/rango-client/commit/993f185e0b8c5e5e15a2c65ba2d85d1f9c8daa90))



