## Widget [0.38.0] (2025-06-10)
_includes `@arlert-dev/widget-embedded@0.44.1`_

### Bug Fixes

- layout shift on custom slippage input ([8a8fb3b](https://github.com/rango-exchange/rango-client/commit/8a8fb3b7fd88928828c4b6331dd9481fec32ed50))


## Widget [0.37.0] (2025-06-09)
_includes `@arlert-dev/widget-embedded@0.44.0`_

### Features

- add detached connect wallet modal ([b2d7d6f](https://github.com/rango-exchange/rango-client/commit/b2d7d6fda2bdfe3e9f72baba95a1a7694e3db21a))
- integrate slush wallet ([9e9a5cc](https://github.com/rango-exchange/rango-client/commit/9e9a5ccb802fbd1f9a50322a89f65b557f152c6a))
- migrate trust wallet to use hub and add support for solana ([61497fd](https://github.com/rango-exchange/rango-client/commit/61497fd40d48d48030e5a6d7ece53b5b7daf7b09))
- add namespace connect and disconnect and get state ([dcbabb0](https://github.com/rango-exchange/rango-client/commit/dcbabb0c2b81932312b3b76975af2ad558439869))
- add new states for wallet buttons ([d337aee](https://github.com/rango-exchange/rango-client/commit/d337aeed2315173a7820d3adedb412a4a1704fcd))
- add static test attributes ([51b1433](https://github.com/rango-exchange/rango-client/commit/51b1433ab464a7255ec9f54499df65fbf98aa66b))
- show slippage and rate in swap box ([54aea4e](https://github.com/rango-exchange/rango-client/commit/54aea4e69413bc7383716893f091b2ef1b0ae693))


### Bug Fixes

- fix retry swap on connect wallet ([f6c45b6](https://github.com/rango-exchange/rango-client/commit/f6c45b6c4a6b92a208e04606b42ed98d327ad349))
- add has method to the namespace proxy ([ee74628](https://github.com/rango-exchange/rango-client/commit/ee7462881c27fbf42fae374064362293f5f92765))
- avoid hub recreation ([2e5fc07](https://github.com/rango-exchange/rango-client/commit/2e5fc07bc0952d1d98b828d7e70a892034bb99b8))
- fix phantom transaction failure on sui namespace disabled ([213b235](https://github.com/rango-exchange/rango-client/commit/213b23565b2729a48605d3d06ef5dd6daf66900f))
- if data exceed 90 days, bottom axis should be shown correctly ([34c0606](https://github.com/rango-exchange/rango-client/commit/34c0606986b72aab97e5174a9bce2f1e1e5a159a))
- fix incorrect state after connecting evm namespace on hub wallets ([778bba9](https://github.com/rango-exchange/rango-client/commit/778bba9ca33ca8cce1a98bb3dcff81fa55a6d6a9))Add commentMore actions
- run connect namespaces sequentially when connect of adapter called separately ([087a94e](https://github.com/rango-exchange/rango-client/commit/087a94e012525609dee75b053db2ce3ee444aa18))
- playground crash on filter wallets ([f0e98ce](https://github.com/rango-exchange/rango-client/commit/f0e98cec6377324385e429df1b6f739770eff089))
- add sanitizeInputAmount for blur normalization of zero values ([9691146](https://github.com/rango-exchange/rango-client/commit/969114619abfc7865b55fa2b003b4d0ce19bc36d))
- autocomplete off for search inputs ([4b47521](https://github.com/rango-exchange/rango-client/commit/4b475216395fb9c0404fdd28a2f26e2c69c12318))
- correct the formatting of the total payable fee in the fee details modal ([ee052d3](https://github.com/rango-exchange/rango-client/commit/ee052d3f3e5bd8ab4284a01a6e9d92dc627efb68))
- correctly display small exchange rate values on the home page ([a3e103f](https://github.com/rango-exchange/rango-client/commit/a3e103f116062f0ebfe4062179ed8794a6f24bc2))
- display correct state in confirm wallets modal ([46417f1](https://github.com/rango-exchange/rango-client/commit/46417f1b75c4daf3d3cb4d43af8b695cdcc71720))
- display error message from response instead of default fallback ([188e130](https://github.com/rango-exchange/rango-client/commit/188e130a1603a8533f19db3545a445523187593b))
- make widget compatible with rango-types ([d8e8ef9](https://github.com/rango-exchange/rango-client/commit/d8e8ef996efc3179932dc91224d97bc7f54ae09f))
- turn autocomplete off for history search input ([97bc186](https://github.com/rango-exchange/rango-client/commit/97bc18649d0f1ee292c46837db2a1a7f00df97b1))
- show correct terms in routing section of cross-chain transactions ([0554412](https://github.com/rango-exchange/rango-client/commit/055441200814c904d258158e0e10a14abea7386b))



## Widget [0.36.0] (2025-05-26)
_includes `@arlert-dev/widget-embedded@0.43.0`_

### Features

- Use psbt for bitcoin on xdefi/ctrl wallet ([86abfbf](https://github.com/rango-exchange/rango-client/commit/86abfbfe725ce66de5cd344bd7a5c9894271c77e))

## Widget [0.35.0] (2025-05-21)
_includes `@arlert-dev/widget-embedded@0.42.3`_

### Bug Fixes

- Prevent crash in search history by moving currentStep after swap check ([5a520f0](https://github.com/rango-exchange/rango-client/commit/5a520f0750700f70a50c7f35e73c3c401d7755f5))

## Widget [0.34.0] (2025-05-12)

_includes `@arlert-dev/widget-embedded@0.42.2`_

### Bug Fixes

- Resolve widget height issues in iframe ([2fb4aa9](https://github.com/rango-exchange/rango-client/commit/2fb4aa99b5562183a9623d0a9ca219919a316c5e))

## Widget [0.33.0] (2025-05-04)

_includes `@arlert-dev/widget-embedded@0.42.1`_

### Bug Fixes

- Add api key to ethereum rpc url ([1591335](https://github.com/rango-exchange/rango-client/commit/159133507fb0f85f045b1f4104ad9b1d6846bb2c))

## Widget [0.32.0] (2025-04-30)

_includes `@arlert-dev/widget-embedded@0.42.0`_

### Features

- Update sui to consider recent api changes ([d764b25](https://github.com/rango-exchange/rango-client/commit/d764b2501df9bb295f63cdbc0b05acd4a3abb4b9))
- Add can eager connect to namespaces ([16b4792](https://github.com/rango-exchange/rango-client/commit/16b4792f877b565ccf767be22ebe14fa79ddd8c6))
- Implement updated design for initial connect modal ([2873c63](https://github.com/rango-exchange/rango-client/commit/2873c630de0740bb3b9f4e52bfa018857bd54dcd))
- Sui support for Phantom ([3769b8b](https://github.com/rango-exchange/rango-client/commit/3769b8ba174783190e242103548bcf4da28cff14))
- Update wallets readme ([0d52ecb](https://github.com/rango-exchange/rango-client/commit/0d52ecbee31b0d3241be71a6f77d508e4a15d3c4))
- Add slippage validation on Settings page ([e65caab](https://github.com/rango-exchange/rango-client/commit/e65caab8d5a547405728c7e2d44da9a90b0ba770))
- Add wallet name to waiting for connect wallet warning message ([68695c1](https://github.com/rango-exchange/rango-client/commit/68695c1e7e0dc904f6490a8dccee377ced56cd3c))
- Adjust the number of blockchains in the token selector based on widget height changes ([1fcc81a](https://github.com/rango-exchange/rango-client/commit/1fcc81a7e4f62e0c9fd52f631b9421d428b6b395))
- Handle connecting wallet with exactly one namespace for hub ([bbeca1d](https://github.com/rango-exchange/rango-client/commit/bbeca1dc28c0b6049463446c8045dfaf3cd53def))
- Improve widget ux on small devices with dynamic height ([47275b0](https://github.com/rango-exchange/rango-client/commit/47275b01001a953b8aee218aa0429bbf3307ba3b))
- Make the swap header scrollable on the swap details page ([7f10f49](https://github.com/rango-exchange/rango-client/commit/7f10f49b3e859c9432d86164166b75428ed169f0))

### Bug Fixes

- Rename pbt to ptb for sui ([3d6d89f](https://github.com/rango-exchange/rango-client/commit/3d6d89f2265766607a15d61e0df92643fb33072b))
- Show network name instead of namespace ([0d46834](https://github.com/rango-exchange/rango-client/commit/0d46834cc820ff93165279d655a7d80b469320d8))
- Error rethrow in or action ([61bc658](https://github.com/rango-exchange/rango-client/commit/61bc658f6a0dab513bb595e2943c85b675c65ada))
- Optional namespace removal to prevent error for wallets without autoconnect ([2d20f87](https://github.com/rango-exchange/rango-client/commit/2d20f87820f59abb082770731ee0c64b309d800e))
- Swap subtitle for history page ([320d095](https://github.com/rango-exchange/rango-client/commit/320d095e60acf17d1a4a7d713b38569d3f9e8feb))
- Adjust the warning alert position for custom tokens on the homepage ([cdb5815](https://github.com/rango-exchange/rango-client/commit/cdb5815f4860e9ebde7bd0745566c71eb9a9fdab))
- Fix long token names in widget home page ([0a16339](https://github.com/rango-exchange/rango-client/commit/0a163391f2a1f1b00ac2b259a1130ef38839d4b9))

## Widget [0.31.0] (2025-03-17)

_includes `@arlert-dev/widget-embedded@0.41.1`_

## Bug Fixes

- Resolve the issue with the custom tokens balance state ([86722e8dc](https://github.com/rango-exchange/rango-client/commit/86722e8dcb946196d5247c93b454b39733af0a4e))
- Fix banner not showing on initial page load ([8683a607e](https://github.com/rango-exchange/rango-client/commit/8683a607ec4cf3487c7ac674f0582dd57c01d7a0))
- Batching state updates for fetchBalances ([32f055f9e](https://github.com/rango-exchange/rango-client/commit/32f055f9e2fb7672f221ad52a9bc83bd1b0a25af))
- Fix swap-box banner overflow ([8a01c95c7](https://github.com/rango-exchange/rango-client/commit/8a01c95c701f65f28323c5ea7dc5b0c83dd0239b))
- Resolve wallet is possibly undefined error in useSubscribeToWidgetEvents ([6231d4610](https://github.com/rango-exchange/rango-client/commit/6231d4610e9967840236e23ee45b9263adfa4c53))

## Widget [0.30.0] (2025-03-11)

_includes `@arlert-dev/widget-embedded@0.41.0`_

### Features

- Add sui namespace support for widget ([990d4c3](https://github.com/rango-exchange/rango-client/commit/990d4c32e7ad674c01140ca0bd557d541c596bbb))
- Update the event payload for failed step and failed route events ([75aa989](https://github.com/rango-exchange/rango-client/commit/75aa9898040aede600aee2d9aa8188295a5a37ae))
- Creating a signer package for sui ([de9b976](https://github.com/rango-exchange/rango-client/commit/de9b9764a7474e3ee446da5d28da35c209997580))
- Add bitcoin signer for phantom on hub ([750124e](https://github.com/rango-exchange/rango-client/commit/750124e693753078abb537d4043964e2eebdbc01))
- Add sui namespace to wallets-core ([5bcf5dd](https://github.com/rango-exchange/rango-client/commit/5bcf5ddd1444bcabb894ddfac0e3766c88988fbd))
- Add functionality to display a banner at the bottom of the swap box ([8f4893e](https://github.com/rango-exchange/rango-client/commit/8f4893e26d383552bb5b3cb6188c9b12206abb12))
- Fetch balance for custom tokens ([1676730](https://github.com/rango-exchange/rango-client/commit/1676730960ef56374ad632a95011b8da0a102792))
- Implement search functionality for custom tokens ([d479cc6](https://github.com/rango-exchange/rango-client/commit/d479cc64ab122a65f87a8ee46e8c27dabe7a71c1))
- Add trophy icon ([22f40aa](https://github.com/rango-exchange/rango-client/commit/22f40aaf3e13222a6769174bb1230f52679b81eb))

## Bug Fixes

- Avoid problematic routes for contract wallets ([0c82a83](https://github.com/rango-exchange/rango-client/commit/0c82a83008de6fe22f3685f1d22ab54bd59e5362))

## Widget [0.29.0] (2025-02-25)

_includes `@arlert-dev/widget-embedded@0.40.1`_

### Bug Fixes

- fix incorrect input amount on max button click

## Widget [0.28.0] (2025-02-23)

_includes `@arlert-dev/widget-embedded@0.40.0`_

### Features

- Add an adapter for Hub for wallets-react and enabling Hub by default ([a14bdf961](https://github.com/rango-exchange/rango-client/commit/a14bdf9619e448bc4568d6b758ca86d2359e1740))
- Add chain change subscribe to evm namespace ([0a7e7ee6b](https://github.com/rango-exchange/rango-client/commit/0a7e7ee6b53c94dcb842fff7e34f9dcbf6120a37))
- Add fee details modal in widget full-expanded mode ([9e9b2a9d4](https://github.com/rango-exchange/rango-client/commit/9e9b2a9d4737176675129aaac0ffea6cdc07be35))
- Add route time warning for slow routes ([9a913f65d](https://github.com/rango-exchange/rango-client/commit/9a913f65deffc9877ebeb4dea24071613ed313fe))
- Update ctrl wallet name and info ([fcde42144](https://github.com/rango-exchange/rango-client/commit/fcde42144a995ec655388b95b606abc669a8c1a8))
- Storing network alongside namespace for hub localstorage ([c5437fa0f](https://github.com/rango-exchange/rango-client/commit/c5437fa0f5117d9d762358cf7cf8ca4627c43406))
- Add number blocks icon ([57808ae62](https://github.com/rango-exchange/rango-client/commit/57808ae62af95e3c1472a88e05ad2c360f3c7c0d))
- Display a warning if the output amount changes on the confirm swap page ([a77422dd4](https://github.com/rango-exchange/rango-client/commit/a77422dd4707d3a66711dcfe6e7982b6ab31c439))
- Add profile banner to widget success modal ([8abbf5152](https://github.com/rango-exchange/rango-client/commit/8abbf51523a2ff57d9d76eb0ed91b599236b88b0))
- Add pencil icon ([282307bc0](https://github.com/rango-exchange/rango-client/commit/282307bc04aa725df4ea4e50968c7a25d2b0cb2b))
- Add sending solana transaction on multiple nodes ([5b5ee8e4b](https://github.com/rango-exchange/rango-client/commit/5b5ee8e4bd8e5c732df674bc94b112b5d2b198c0))
- Add money bag icon ([23f3961fe](https://github.com/rango-exchange/rango-client/commit/23f3961fe84f854ae71a8ccf2ff42a20b6e4f287))
- Update payload for events ([36a11b6ce](https://github.com/rango-exchange/rango-client/commit/36a11b6cebc153eced9e01f97fa1fabaf9a44e9f))
- Add disconnect all to hub adapter ([c9934cc1a](https://github.com/rango-exchange/rango-client/commit/c9934cc1ab883b6de6309be6225e5d590e6e5bf6))
- Introducing store events for hub and fix switching accounts using that ([ba95ba258](https://github.com/rango-exchange/rango-client/commit/ba95ba2584f41e2a4b4b2984a62c737ab74d7cd8))
- Add base chain to phantom evm supported chains ([58a2d54c0](https://github.com/rango-exchange/rango-client/commit/58a2d54c0eff18e8d5ecf980b2487f7c8dada59f))
- Add link to profile banner ([b752c6f2b](https://github.com/rango-exchange/rango-client/commit/b752c6f2bf19eead23121503494a36ea39923206))

### Bug Fixes

- Fix frozen accounts array ([543843882](https://github.com/rango-exchange/rango-client/commit/54384388239adafc35e7d7b1afbb58ff6f6a0d79))
- Improve handling of disabled swappers in widget ([d1b42e999](https://github.com/rango-exchange/rango-client/commit/d1b42e999b4d4bf606886481be884866d594fa4b))
- Handle token not found error for custom tokens ([b33059e91](https://github.com/rango-exchange/rango-client/commit/b33059e911de7ebf86b629e0adc68ba656a7a3a1))
- Add cookie icon ([9538a97ed](https://github.com/rango-exchange/rango-client/commit/9538a97ed27049226c364e1f09e441a8217d3724))
- Fix ctrl wallet fail to connect problem ([f1bfedcf4](https://github.com/rango-exchange/rango-client/commit/f1bfedcf4e9bf4cf55c2bee7c954b83dbbb6376c))
- Showing correct network in notification ([3c4ef1320](https://github.com/rango-exchange/rango-client/commit/3c4ef1320f773dadc174d49a707ebfae73b7c0db))
- Clean up old balances when switching account ([78d559f0e](https://github.com/rango-exchange/rango-client/commit/78d559f0ef52bc6a6a80f824b075157eb7274bc1))
- Switching to not connected account should disconnect evm as well ([8ea7d4056](https://github.com/rango-exchange/rango-client/commit/8ea7d40569972fe14dbde630b1e0ba9c4d6b0df5))
- Fix hub problems with wallets config ([822f209d5](https://github.com/rango-exchange/rango-client/commit/822f209d5e013ef4cc05f23c9b5f33acba336fcc))
- Incorrect default language setting ([007ed70a1](https://github.com/rango-exchange/rango-client/commit/007ed70a19b5ee549f3a4dbc48d42e4af1bdc182))
- Ctrl wallet is changing 'keplr' named function to undefined ([f1b7f2a81](https://github.com/rango-exchange/rango-client/commit/f1b7f2a814f45441639174b36d498a1e341bb559))
- Make hub compatible with external wallets ([316f18c4b](https://github.com/rango-exchange/rango-client/commit/316f18c4b270b5e94b7e475d6bf7922cdcc9c712))
- Adding balances to ConnectedWallet for WidgetInfo ([e0711113f](https://github.com/rango-exchange/rango-client/commit/e0711113faff56d87f61af9da869d214eb74b2ff))
- Fix total balance calculation for WidgetInfo ([a1a474aab](https://github.com/rango-exchange/rango-client/commit/a1a474aab2a37b9cd7001cc5419788d297a96deb))
- Close wallet connection modal after connect with namespace ([29dff4486](https://github.com/rango-exchange/rango-client/commit/29dff448650f83deda8892e3f3ba62dd1f3df555))
- UsdValue shouldn't be formatted to calculate the total value ([0e2d987c4](https://github.com/rango-exchange/rango-client/commit/0e2d987c4fff601e421989f9a8afd6330125e5a6))
- Updated profile banner format from png to jpg ([3100a66ea](https://github.com/rango-exchange/rango-client/commit/3100a66ea31a26919c738e10ff5dd9db203d371d))
- Update connected namespaces in storage on switch account ([782ec1d16](https://github.com/rango-exchange/rango-client/commit/782ec1d1624fd9305c3bcf4ba0254ecbcdcdb2a2))
- Remove namespace from storage on auto connect failure ([6b6504f32](https://github.com/rango-exchange/rango-client/commit/6b6504f32f34041f5c33ef3348a244d32bffe399))
- Resolve issue with connecting to solana namespace ([1bde85823](https://github.com/rango-exchange/rango-client/commit/1bde858230744fcea6ac4d313aed82e2a4af7b21))
- Fix incorrect wallet state after switch account ([5ee5dda42](https://github.com/rango-exchange/rango-client/commit/5ee5dda42a31a0630462be3ec56ce45f9992f916))
- Make connect namespaces sequential ([b430c5611](https://github.com/rango-exchange/rango-client/commit/b430c561197fdcf34a710581c345c31f0c596636))
- Display correct network in switch network modal ([8a558f190](https://github.com/rango-exchange/rango-client/commit/8a558f190cc1c25e15a1ca57a7c3f760906fd067))
- Add unsupported tokens to wallets details ([3db55383c](https://github.com/rango-exchange/rango-client/commit/3db55383cb0ffa21b186489d4d20583065266d02))
- Update explorer url on connected wallets ([ebb5e0836](https://github.com/rango-exchange/rango-client/commit/ebb5e0836c8221a6cf70eb9cb7b639bb7c70817e))
- Update balance after transaction with max amount ([9915cbaf1](https://github.com/rango-exchange/rango-client/commit/9915cbaf1b27ded6265ba638f62ad42b07448968))
- Update balance only if account is still connected ([b65e3b242](https://github.com/rango-exchange/rango-client/commit/b65e3b242f00a42858385ebefd3cd515a9556ea3))
- Change balance key separator ([1f3da972a](https://github.com/rango-exchange/rango-client/commit/1f3da972a7da2cebe2b9876c058980ba9d32ad65))
- Fix incorrect default install link for wallets ([09fee1314](https://github.com/rango-exchange/rango-client/commit/09fee1314dc20ba84935ed8ac7d7674619b055a2))
- Remove connected wallet on namespace disconnect ([4f0be8a1e](https://github.com/rango-exchange/rango-client/commit/4f0be8a1eab99af9e6077b7c8c45fdfc6d40f4e9))
- Resolve error in clickable wallet component ([7e15e1fa2](https://github.com/rango-exchange/rango-client/commit/7e15e1fa20ddee5ffe37bddd13d12059e8dbc953))
- Switch only selected accounts to loading state and handle failure on fetch balance ([ff8429d93](https://github.com/rango-exchange/rango-client/commit/ff8429d9311e25b877886c4d826e6a817e393f9c))
- Fix balance not updating properly after transaction ([e607dfc70](https://github.com/rango-exchange/rango-client/commit/e607dfc706e79f5d68fc140ff9a4f5f8e6fc91fe))

### Test

- Add tests for wallets-react ([f3f52e04d](https://github.com/rango-exchange/rango-client/commit/f3f52e04d88de831089e60fdb5e6642e0a96857e))

### Performance Improvements

- Improve getConnectedWalletsDetails query by memozing ([7a0dcae93](https://github.com/rango-exchange/rango-client/commit/7a0dcae938c74a9fa6d6aaa37c958055e0b704f7))

## Widget [0.27.0] (2025-01-27)

_includes `@arlert-dev/widget-embedded@0.39.0`_

### Features

- Update payload for events ([36a11b6](https://github.com/rango-exchange/rango-client/commit/36a11b6cebc153eced9e01f97fa1fabaf9a44e9f))

## Widget [0.26.0] (2025-01-20)

_includes `@arlert-dev/widget-embedded@0.38.0`_

### Features

- Add sending solana transaction on multiple nodes ([5b5ee8e](https://github.com/rango-exchange/rango-client/commit/5b5ee8e4bd8e5c732df674bc94b112b5d2b198c0))

## Widget [0.25.0] (2024-12-31)

_includes `@arlert-dev/widget-embedded@0.37.0`_

### Bug Fixes

- Fix ctrl wallet fail to connect problem ([f1bfedc](https://github.com/rango-exchange/rango-client/commit/f1bfedcf4e9bf4cf55c2bee7c954b83dbbb6376c))

### Features

- Update ctrl wallet name and info ([fcde421](https://github.com/rango-exchange/rango-client/commit/fcde42144a995ec655388b95b606abc669a8c1a8))

## Widget [0.24.0] (2024-11-27)

_includes `@arlert-dev/widget-embedded@0.36.0`_

### Bug Fixes

- fix error display for bad requests ([82c0381](https://github.com/rango-exchange/rango-client/commit/82c03811b64a9197680314ac4f506d8680afec0c))

### Features

- Add support for MyTonWallet ([7027755](https://github.com/rango-exchange/rango-client/commit/7027755740426359f42b088b842dfd01590df5c3))
- Add support for TonConnect ([2a2dbb7](https://github.com/rango-exchange/rango-client/commit/2a2dbb79022263f19446ced49d298e04d63f927f))
- Accepting routing params (avoidNativeFee, maxLength) ([2a89744](https://github.com/rango-exchange/rango-client/commit/2a8974440d1269d9a12700fc7100f1f78371d277))
- Show warning if source and destination token is same ([979cb0d](https://github.com/rango-exchange/rango-client/commit/979cb0d20c0730be9c94c2cd96d66630ea8e86ba))

## Widget [0.23.0] (2024-11-12)

_includes `@arlert-dev/widget-embedded@0.35.0`_

### Features

- add more languages to widget ([bc37fe9](https://github.com/rango-exchange/rango-client/commit/bc37fe97586545f993d7a2675a43b64aaa743791))

### Bug Fixes

- fix solana signer by migrating confirm transaction to get signature statuses ([07b2b89](https://github.com/rango-exchange/rango-client/commit/07b2b89fec1d22a09ed9215691ff296a6e77a382))

## Widget [0.22.0] (2024-10-12)

_includes `@arlert-dev/widget-embedded@0.34.0`_

### Bug Fixes

- bump sdk and fix type issues ([d442208](https://github.com/rango-exchange/rango-client/commit/d4422083bf5dd27d5f509ce1db7f9560d05428c8))
- resolve issues with the sign message method for certain solana providers ([cbe83a3](https://github.com/rango-exchange/rango-client/commit/cbe83a3da8b48560b206fc2a7fa7cf062cdeaa23))
- cosmostation wallet connection error ([b3747ba](https://github.com/rango-exchange/rango-client/commit/b3747ba77d06a5c02ce670affb337771e606434b))
- add chart icon and handle dark theme in BarChart component ([fd4f246](https://github.com/rango-exchange/rango-client/commit/fd4f24684e42deb1b47fb9a6584ac4f9a1519599))
- add prepare data function for chart package ([a9f8c6b](https://github.com/rango-exchange/rango-client/commit/a9f8c6b092ca5343756e220238c943dbc369a62b))
- fix issues in the tabs component ([497c387](https://github.com/rango-exchange/rango-client/commit/497c3871241f3e067682526c156014dcd8189395))

### Features

- add signature to versioned transactions ([d7f374b](https://github.com/rango-exchange/rango-client/commit/d7f374b460dc6a51e761614235575eb924f8d71a))
- introducing hub, our new wallet management ([92692fe](https://github.com/rango-exchange/rango-client/commit/92692fe7a05be72caea8b99bcc4ac5e2326f2f5a))
- add chart package ([f5ae7e4](https://github.com/rango-exchange/rango-client/commit/f5ae7e449ec1e385188ff904e9d59862fa8ef1d2))
- add id property to buttons ([39824e3](https://github.com/rango-exchange/rango-client/commit/39824e3ce8b1804b9944eb0faf71da7cdccf59ea))
- add mobile menu icons ([d4358bc](https://github.com/rango-exchange/rango-client/commit/d4358bc189a61c49c508c517b2cd674d435aa3b7))
- implement scrollable variant for tabs component ([0635f77](https://github.com/rango-exchange/rango-client/commit/0635f774af9dfd03fcc8f7adfcd32591c86efa25))

### Performance Improvements

- lazy load signer packages ([7b88f18](https://github.com/rango-exchange/rango-client/commit/7b88f1834f7b29b4b81ab6c81a07bb88e8ccf55c))
- enable code splitting in build process ([fe5a41e](https://github.com/rango-exchange/rango-client/commit/fe5a41e0e297298de11cd74ca5825544742aa03a))

## Widget [0.20.0] (2024-09-10)

_includes `@arlert-dev/widget-embedded@0.33.0`_

### Bug Fixes

- add slippage icon to setting page ([2e29351](https://github.com/rango-exchange/rango-client/commit/2e29351d957f4e751a25f66b7cb173e5d9956378))
- clear timeout for success modal to avoid closing upcoming modals unexpectedly ([0d54a60](https://github.com/rango-exchange/rango-client/commit/0d54a6092e6a412b1497b9a3e26af6f669eea181))
- correct translation bugs ([0107f1d](https://github.com/rango-exchange/rango-client/commit/0107f1df7a587d9910c5376c4f99acd23b95e1a4))
- fix wallet state issue after retrying to fetch the balance following a failed attempt ([181bac3](https://github.com/rango-exchange/rango-client/commit/181bac3f54727847f8d16ff47164cce80aa64931))
- if state is on connecting, we should call disconnect in terminateconnectingWallets as well ([ad16056](https://github.com/rango-exchange/rango-client/commit/ad1605631df82e4d692f7e75999b2a5c51216958))
- improve header component to center the title properly ([a9929bb](https://github.com/rango-exchange/rango-client/commit/a9929bb518ccbb2033b646fbcb5c034852b039b2))
- reset derivation path if it's string and switching from custom mode ([c94c71a](https://github.com/rango-exchange/rango-client/commit/c94c71a94f3ac910ca13433ea616ce548559dc58))
- ensure proper cleanup of the modal component after it is removed from the dom ([394e4f0](https://github.com/rango-exchange/rango-client/commit/394e4f017eb09ac99f90a10be94ef8a742632586))
- fix incorrect error message on Trezor wallet transaction rejection ([3998563](https://github.com/rango-exchange/rango-client/commit/3998563fa06c694b34a61730b4f6c13f3323a407))
- fix solfare and solfare-snap signers ([896c70b](https://github.com/rango-exchange/rango-client/commit/896c70b8cc8b5e29ec6dfcd98378ef0b3f05698f))
- update signMessage in the default Solana signer to return a base58 string instead of base64 ([b60609b](https://github.com/rango-exchange/rango-client/commit/b60609b71d55ff205324aee87fb440d23cba5c79))

### Features

- export a new hook for handling required data for connect called useStateful ([0d00a45](https://github.com/rango-exchange/rango-client/commit/0d00a45b4434e0e2b53228a1d1c0be4fa579e21b))
- export StatefulConnect components and helpers ([c28a94b](https://github.com/rango-exchange/rango-client/commit/c28a94bd2721b4dbd16f9471f1cb0ddc45aa8904))
- implement bordered variant for tabs component ([1de8888](https://github.com/rango-exchange/rango-client/commit/1de8888d6d4ae13a765aaee0173eebf0d49f4a11))

## Widget [0.19.0] (2024-08-17)

_includes `@arlert-dev/widget-embedded@0.32.1`_

### Features

- add functionality to support custom tokens ([a1aa0af](https://github.com/rango-exchange/rango-client/commit/a1aa0afed98f164488a3caffaaff2fd060ab8b3d))

## Widget [0.18.0] (2024-08-11)

_includes `@arlert-dev/widget-embedded@0.31.0`_

### Bug Fixes

- address the issue where the token list does not update when the balance changes ([d1fb4e4](https://github.com/rango-exchange/rango-client/commit/d1fb4e4bb57e97cd730cba4c33ca0b2202600c09))
- fix bug in swap input handling empty value ([3c9b082](https://github.com/rango-exchange/rango-client/commit/3c9b082b7b548ddd3981fff100d4dc880581b98d))
- fix flicker in playground ([6ae2d58](https://github.com/rango-exchange/rango-client/commit/6ae2d588ba36822856a43cea7cabc3618cf72c11))
- fix missing usd value in estimated output ([a46d19a](https://github.com/rango-exchange/rango-client/commit/a46d19a80b4f6fc1ca29e289e1b6441e89aa730c))
- fix sort logic of notifications ([ffcf4c2](https://github.com/rango-exchange/rango-client/commit/ffcf4c2d70da7887e17042f3e6fe46224cd21fe1))
- fix wallet modal closing bug ([146f7e2](https://github.com/rango-exchange/rango-client/commit/146f7e24450be278aee53b03319399934cf84f17))
- recalculate supported tokens even if it's empty list ([8ccda6b](https://github.com/rango-exchange/rango-client/commit/8ccda6b2e246425102e6f6ab5f0d1edd131c6794))

### Features

- add derivation path modal for trezor wallet ([364422f](https://github.com/rango-exchange/rango-client/commit/364422f099b202a27a529591c5e3628bbb35508d))
- add filter and clear to widget history ([d43b603](https://github.com/rango-exchange/rango-client/commit/d43b603462feabf297d5be389fcaa35402d667b5))
- add functionality to update the quote inputs from outside the widget ([d9722fb](https://github.com/rango-exchange/rango-client/commit/d9722fbd5629ecb760b94a3d4a9ad7c0a07687ad))
- add preventable event and a new ui event called CLICK_CONNECT_WALLET ([e4363bb](https://github.com/rango-exchange/rango-client/commit/e4363bb6fb98d49b22c1b608ecf6d37650ff3035))
- add the option to define a default custom destination for each blockchain in the widget config ([7982ab6](https://github.com/rango-exchange/rango-client/commit/7982ab633dcb5b07ee5c313c9414d68baa6cbc38))
- changing the request ID copy process ([490cdfa](https://github.com/rango-exchange/rango-client/commit/490cdfa41131eea20d8a552f8f0714b77d21ac71))
- hide balance and max button when no wallet connected ([80b2754](https://github.com/rango-exchange/rango-client/commit/80b27547376394a3070aea7065d4bb9652f454e4))

### Performance Improvements

- improve token list performance by caching target tokens on load and config change ([3cc55ff](https://github.com/rango-exchange/rango-client/commit/3cc55ff95dde1f87f53efb2496e995beeb943b00))

## Widget [0.17.0] (2024-07-09)

_includes `@arlert-dev/widget-embedded@0.30.0`_

### Bug Fixes

- fix tx data for evm signers when transfering native tokens ([a5d9f6e](https://github.com/rango-exchange/rango-client/commit/a5d9f6e3f5bada210a05c0d1f5c57d7917bf869c))
- import Trezor module ([cd71eb5](https://github.com/rango-exchange/rango-client/commit/cd71eb5f390f1b07974ea9e2368f35db383a8c82))
- fix the bug where xdefi is not displayed for experimental networks ([723eb2d](https://github.com/rango-exchange/rango-client/commit/723eb2dc3bfacce8753eeee011910b595d45028d))
- bug in updating input & output amount ([49c902b](https://github.com/rango-exchange/rango-client/commit/49c902be7adc1ba9ae7808f145ec975c724a728f))
- fix bug displaying the same token list for blockchains with the same number of tokens ([f4dc82f](https://github.com/rango-exchange/rango-client/commit/f4dc82f5f319f9133fac7d8a68023596a773cd96))
- improve generate colors for tokens label and price impact color ([5f2893c](https://github.com/rango-exchange/rango-client/commit/5f2893c03b17af24a8b3886e12b1631b5cc208fb))
- refactor numeric tooltip and fix missing translations ([59f1fb9](https://github.com/rango-exchange/rango-client/commit/59f1fb96027a9b51cea5f6362b247b6cf180d809))
- fix playground exported config bugs and slider color bug ([9505b63](https://github.com/rango-exchange/rango-client/commit/9505b6330363839aa5acc7abfdb6cd7288f946d6))
- fix state of custom destination in playground ([ae9cd78](https://github.com/rango-exchange/rango-client/commit/ae9cd783aebc797ffa98e2cd0fb87744ae92caf8))

### Features

- support new widget events ([37a9b6c](https://github.com/rango-exchange/rango-client/commit/37a9b6c023cba660c87af27bcbfceadfb8daa8d0))
- improve solana simulation failed errors ([c7ccb97](https://github.com/rango-exchange/rango-client/commit/c7ccb97cbdc571b615ee3129a8fcadd52cb0bc9f))
- add a modal for setting custom derivation path for ledger ([5b74ec0](https://github.com/rango-exchange/rango-client/commit/5b74ec049393ed74e3e7547edc72b68bd70b7dce))
- add support for Trezor hardware wallet ([6edecbb](https://github.com/rango-exchange/rango-client/commit/6edecbb14fd008fc741c892bfa3e025c10160b9b))
- integrate rabby wallet extension ([145fb8f](https://github.com/rango-exchange/rango-client/commit/145fb8ffbbf5e46e7e8386aeffcefc8f4ddb22e7))
- integrate tomo wallet extension ([9f0f065](https://github.com/rango-exchange/rango-client/commit/9f0f0650fcd213a621dcc6ddca3e32424c1a5ada))
- adding 'shadows' to widget config for theme ([2be1f1a](https://github.com/rango-exchange/rango-client/commit/2be1f1aa508fb642a797610471b63219cd3d2ccf))
- display all notifications in the notification popover ([c3eda22](https://github.com/rango-exchange/rango-client/commit/c3eda22cf1f06b928fdf0c98512fd444cc46823c))
- export useWalletList for use in dapp ([e5fb662](https://github.com/rango-exchange/rango-client/commit/e5fb662adc119fb341db2c6c68b3b9e45c0353a2))
- make update settings optional to make it enable in playground ([c13a902](https://github.com/rango-exchange/rango-client/commit/c13a902fba9a03b111bde6fed02a1f3a081ee590))
- add credit and disconnect icons ([b5e5357](https://github.com/rango-exchange/rango-client/commit/b5e5357cf3a5b13f602b8d5cdb829f3699ee3197))

### Performance Improvements

- improve finding tokens from store ([3e890bd](https://github.com/rango-exchange/rango-client/commit/3e890bdcd47971b072f347c368c4370225cb11ff))

## Playground [0.17.0] (2024-07-09)

### Bug Fixes

- fix playground exported config bugs and slider color bug ([9505b63](https://github.com/rango-exchange/rango-client/commit/9505b6330363839aa5acc7abfdb6cd7288f946d6))
- fix state of custom destination in playground ([ae9cd78](https://github.com/rango-exchange/rango-client/commit/ae9cd783aebc797ffa98e2cd0fb87744ae92caf8))

### Features

- make update settings optional to make it enable in playground ([c13a902](https://github.com/rango-exchange/rango-client/commit/c13a902fba9a03b111bde6fed02a1f3a081ee590))

## Widget [0.16.0] (2024-06-01)

_includes `@arlert-dev/widget-embedded@0.29.0`_

### Bug Fixes

- update design for not-selected blockchain or token ([8915101](https://github.com/rango-exchange/rango-client/commit/8915101d4e7a7092fbb5f38bbd95789e124f8ae3))
- resolve custom slippage bug ([54bef0f](https://github.com/rango-exchange/rango-client/commit/54bef0f6d73d1078ab170e8b049a6aa311fff02d))
- sync notifications with persisted swaps ([2ecaf38](https://github.com/rango-exchange/rango-client/commit/2ecaf38750dacc828ebaee7f8348b502a7645a88))
- exclude ledger on mobile and fix injected wallet bug ([a6d90aa](https://github.com/rango-exchange/rango-client/commit/a6d90aa01b7b1fcea01ab46d1a74583ff6f98ff8))
- fix init config minor bug ([7d671e3](https://github.com/rango-exchange/rango-client/commit/7d671e336050cd4d4cc0589cfd83e341421fe859))
- fix the automatic selection of the connected wallets in the confirm wallets modal ([0b85d81](https://github.com/rango-exchange/rango-client/commit/0b85d81bc9ce6ec055e832e37eb6289a1b107d39))

### Features

- update wallets page to add filter by transaction types ([0aa7c73](https://github.com/rango-exchange/rango-client/commit/0aa7c73333bd32912f7b2e90a660f3f43e64f4f7))
- add more predefined fonts list from google fonts ([693f257](https://github.com/rango-exchange/rango-client/commit/693f25790497f6829dd74c800d3d5574d8ee0bed))
- add custom solana rpc url to config ([8d46ebf](https://github.com/rango-exchange/rango-client/commit/8d46ebf4fcd58c7ecd180ea29c071176c0f863e9))
- add an option to wallet connect provider to open a desktop wallet directly ([bee0a1f](https://github.com/rango-exchange/rango-client/commit/bee0a1f57ef5470564f6cdc379d00981e7d34b0a))
- update explorer icon and add paste to custom destination ([61468a0](https://github.com/rango-exchange/rango-client/commit/61468a0e227517b91def21a85a8f7d72b7411862))
- generate theme color tints and shades using the new method of overriding them separately ([a46b8a9](https://github.com/rango-exchange/rango-client/commit/a46b8a93bff1d8d6766c2fd636091983a8ee1baa))

## Widget [0.15.0] (2024-05-14)

_includes `@arlert-dev/widget-embedded@0.28.0`_

### Features

- add solana to ledger ([77b6695](https://github.com/rango-exchange/rango-client/commit/77b6695758165f9258a0ba5bd3b2cf39b0b2aab5))
- improve all routes button ([efcb61e](https://github.com/rango-exchange/rango-client/commit/efcb61ee5920b1a05c44dfa8edf23dc8d3d7f035))
- migrate storybook components to new package ([d926ae2](https://github.com/rango-exchange/rango-client/commit/d926ae220360077ef49ee919dbb2e15f6bec0548))
- add test to check workflow ([69a4c3e](https://github.com/rango-exchange/rango-client/commit/69a4c3e144a7e9cd1ce24c3a2f7a3d7a4b4a1eab))
- add auto retry for fetching confirm swap ([5945d82](https://github.com/rango-exchange/rango-client/commit/5945d82030b89006f5c62c8f5ce5d492cc2ed220))
- add a new package to deploy the storybook preview ([06aaa44](https://github.com/rango-exchange/rango-client/commit/06aaa444408f07c7a053432af081c9758f157052))
- detect proper error related to wallet connect params ([a0d8d95](https://github.com/rango-exchange/rango-client/commit/a0d8d95ed977fffbd0244f498c81f7ce3550ee71))
- clean solana signer simulation errors ([5d623ab](https://github.com/rango-exchange/rango-client/commit/5d623ab632945cb28581ea896fb95d7c84f92607))

### Bug Fixes

- fix the entrance animation of the confirm wallets modal ([1907ad2](https://github.com/rango-exchange/rango-client/commit/1907ad25cef2a25c303e2c91194dbae2b8e6fd56))
- fix space between of routes and swap box in expanded mode ([cbca33e](https://github.com/rango-exchange/rango-client/commit/cbca33ef31d634466b6595ee01fa337952076b89))
- fix multiwallets config initial value check bug ([94dbf07](https://github.com/rango-exchange/rango-client/commit/94dbf074ab51f56bf1267cb668be4e58781554bf))
- fix bugs in fetching quotes ([2b533ea](https://github.com/rango-exchange/rango-client/commit/2b533ead6fa90d2d8b3d9b8de2699072cc57d55b))
- display the swapper's title instead of the swapper's group as their displayed name ([1142d94](https://github.com/rango-exchange/rango-client/commit/1142d9417e690bf4b0093ee84e42352dab149793))

## Widget (2024-05-08)

_includes `@arlert-dev/widget-embedded@0.27.3`_

### Bug Fixes

- disable the confirm wallet button if all required wallets are not selected ([521883f](https://github.com/rango-exchange/rango-client/commit/521883f9e381d311bf0cdad275b234646da2a648))

## Widget (2024-04-27)

_includes `@arlert-dev/widget-embedded@0.27.2`_

### Bug Fixes

- make sure to correctly pass validation parameters when setting up a new swap ([4f6d37e](https://github.com/rango-exchange/rango-client/commit/4f6d37ea9b59caca4d0064c1b33b05077b0b59a3))

## Widget (2024-04-24)

_includes `@arlert-dev/widget-embedded@0.27.1`_

### Features

- add ethereum for ledger ([084aae2](https://github.com/rango-exchange/rango-client/commit/084aae28adaf0310dffe3a3100dd783252393053))

## Widget (2024-04-23)

_includes `@arlert-dev/widget-embedded@0.27.0`_

### Bug Fixes

- address passing wallet-connect project id ([80a6b80](https://github.com/rango-exchange/rango-client/commit/80a6b8046cc93bc8e88b84a201331b2e7adc0c73))
- fix token selector hover ui for token explorer link ([ede0fac](https://github.com/rango-exchange/rango-client/commit/ede0fac0e987b0cd6983ccd427207d78f65eeb96))
- fix token selector infinite loader ([1122dd6](https://github.com/rango-exchange/rango-client/commit/1122dd6db1fecadd41d56f22d5dfd95fbaa645a0))
- remove setting option from confirm swap page ([1f204c1](https://github.com/rango-exchange/rango-client/commit/1f204c1ebf544348a2969aa35c2cf8c9841ea3ff))
- improve solana transaction sign flow ([65b7be0](https://github.com/rango-exchange/rango-client/commit/65b7be0ce02bed88c98280999b615bc405e95cb6))
- set current state for current network in conencting multi-chain wallets ([dc62af0](https://github.com/rango-exchange/rango-client/commit/dc62af03f0edc10400394ba600c7d83e1250b4e8))
- resolve conflicts between evm providers ([9a6734c](https://github.com/rango-exchange/rango-client/commit/9a6734cf1537bf0504cf9058d4d775313a9e8e80))

### Features

- add solflare snap connect and signer ([42aa2b0](https://github.com/rango-exchange/rango-client/commit/42aa2b039dd910e8e44db473e1acd28689a8b43b))
- add animation for switch swap button ([601af2d](https://github.com/rango-exchange/rango-client/commit/601af2dde7ed87c7aa803cb0b79a13c21ff0386d))
- add unit test for app store ([9df49a8](https://github.com/rango-exchange/rango-client/commit/9df49a8aaf0d03fea01d9e9790953c7326e8999d))

---

You can use the following template:

## Widget or Playground [VERSION] (DATE)

_includes `@arlert-dev/widget-embedded@VERSION`_

### Bug Fixes

- commit message

### Features

- commit message
