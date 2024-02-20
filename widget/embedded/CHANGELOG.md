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



