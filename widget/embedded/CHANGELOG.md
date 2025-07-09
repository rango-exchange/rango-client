# 0.45.0 (2025-07-09)


### Bug Fixes

*  fix playground exported config bugs and slider color bug ([b552d5a](https://github.com/rango-exchange/rango-client/commit/b552d5ab3727f53e033003d9de3cfc24e75e8e86))
* add a default variant to widget config store ([b6d8016](https://github.com/rango-exchange/rango-client/commit/b6d80165146bb43f2d89c0d628bd8680776e5152))
* add ethers dependency to embedded ([642a79c](https://github.com/rango-exchange/rango-client/commit/642a79cd932b85b4549506328f3c8ee36a138f6b))
* add initial state with props in app store and fix bug of passing liquidity sources via config ([9854c5e](https://github.com/rango-exchange/rango-client/commit/9854c5edb1536df43ba7ef4a5d24b0db6bce93ce))
* add presets from v1 ([0dbb7fc](https://github.com/rango-exchange/rango-client/commit/0dbb7fca63e1d2ed9847aa5c50afa229cac866de))
* add reject modal for experimental suggest chain ([e186871](https://github.com/rango-exchange/rango-client/commit/e18687110850f5729f669195092038c50eec7b8f))
* add sanitizeInputAmount for blur normalization of zero values ([859773f](https://github.com/rango-exchange/rango-client/commit/859773fd8e82c5202df9f54119e19484a9a1d686))
* add slippage icon to setting page ([d4e3a19](https://github.com/rango-exchange/rango-client/commit/d4e3a199ef47a193d0ac3c26e79b13467611bcb1))
* add suggest and connect to wallet for  experimental chain ([501b9e4](https://github.com/rango-exchange/rango-client/commit/501b9e4242b96717bfc0ee90b708bebb314e4728))
* add unsupported tokens to wallets details ([f61636a](https://github.com/rango-exchange/rango-client/commit/f61636a6059f03b7cd2291ae88c5facfa16d25d3))
* adding balances to ConnectedWallet for WidgetInfo ([baecf21](https://github.com/rango-exchange/rango-client/commit/baecf216bff3a54456d12dc1d4439c9ffa629688))
* adding lingui to ui and embedded packages ([ecc140e](https://github.com/rango-exchange/rango-client/commit/ecc140e5abe324618b6cc86591436c819f753b8b))
* address apikey config bug in iframe ([7481537](https://github.com/rango-exchange/rango-client/commit/748153787757578d0cf5070aa198be188907fde1))
* address passing wallet-connect project id ([cce879e](https://github.com/rango-exchange/rango-client/commit/cce879e9d02d5f5c06a6173563b2430cd5c76f76))
* address some minor bugs in swapHistory & wallet page loading ([80f9d1c](https://github.com/rango-exchange/rango-client/commit/80f9d1cf0c74733b8ac17e1471ddad12668a31d0))
* address sub setting issues ([af7d3c0](https://github.com/rango-exchange/rango-client/commit/af7d3c0e4c8d99f8a37f6734b82c1479a3ccdbc0))
* address the issue where the token list does not update when the balance changes ([21711c9](https://github.com/rango-exchange/rango-client/commit/21711c930896d689137adf3d5a17d30f3d32dabc))
* address tooltips position ([891f397](https://github.com/rango-exchange/rango-client/commit/891f397f3a648cc30fd26150aa068955aec2c251))
* apply minor improvements to the widget ([d2d7c8d](https://github.com/rango-exchange/rango-client/commit/d2d7c8dd6c8fb12739dc88ce34bdf9dea40d89ff))
* autocomplete off for search inputs ([f130ae3](https://github.com/rango-exchange/rango-client/commit/f130ae3da6db60285190ff86e0826717b7b534b3))
* avoid problematic routes for contract wallets ([fe0635c](https://github.com/rango-exchange/rango-client/commit/fe0635ca73b41d1af7625bf8db5fd09f0bc4cf4d))
* batching state updates for fetchBalances ([fd37adf](https://github.com/rango-exchange/rango-client/commit/fd37adf3e39058d1ee65404357b21ffed6b1cf1d))
* bug in updating input & output amount ([cab8bc6](https://github.com/rango-exchange/rango-client/commit/cab8bc6051f9c6399a68a0e44c19d739f6a05a7e))
* build error on embeded ([bd1246c](https://github.com/rango-exchange/rango-client/commit/bd1246c548c6d056a24a131891161107cf615be4))
* bump sdk and fix type issues ([c297c46](https://github.com/rango-exchange/rango-client/commit/c297c46620f853b6317664dae04061af3dfbbd71))
* change `faker.number.float` precision option to `multipleOf` ([998289b](https://github.com/rango-exchange/rango-client/commit/998289ba82a1e1370338aa9ecfb23411497377f3))
* change balance key separator ([81fc0ea](https://github.com/rango-exchange/rango-client/commit/81fc0eab07dd4ac2efd661294f12af80915bd96d))
* clean up old balances when switching account ([0145175](https://github.com/rango-exchange/rango-client/commit/014517567e36e986bf48dc45fd89155e8819c4db))
* cleanup wallets' subscriber when setProvider get null ([a05dfba](https://github.com/rango-exchange/rango-client/commit/a05dfba623facc20debeee3d149fddc779e66278))
* clear timeout for success modal to avoid closing upcoming modals unexpectedly ([1544764](https://github.com/rango-exchange/rango-client/commit/15447649becea01bf0ee68507f00501ab0a33943))
* close completeModal when requestId is changed ([c774939](https://github.com/rango-exchange/rango-client/commit/c774939564aeffe36768eefce3eab3bc16b83f0f))
* close wallet connection modal after connect with namespace ([a6fea0b](https://github.com/rango-exchange/rango-client/commit/a6fea0b8beb3cb48affba521d5a6303325545ccc))
* comments ([8556ef8](https://github.com/rango-exchange/rango-client/commit/8556ef872f39c8b8dd6b6fec081361592efa8637))
* complete and check missing translations ([9ac03eb](https://github.com/rango-exchange/rango-client/commit/9ac03eba5e72753f43ce06e5bd8ebd4ce1d28934))
* convert string to i18n function ([7e301ca](https://github.com/rango-exchange/rango-client/commit/7e301caa675247e18a3e2009462049fd0f35329c))
* correct default values of hidden features ([fee2cdc](https://github.com/rango-exchange/rango-client/commit/fee2cdc57982ac01ee5271e3aa60159b0705d6f5))
* correct height of widget & address full-expanded hover & spacing ([48f0084](https://github.com/rango-exchange/rango-client/commit/48f00841f016d89f8ebb1bbc947e8986095f0f62))
* correct set-as-read behavior in swap-details ([ab0a93f](https://github.com/rango-exchange/rango-client/commit/ab0a93ff3b52f5491b222273dae702a30a7283d1))
* correct sharp styles in swap inputs in different variants ([3d3065c](https://github.com/rango-exchange/rango-client/commit/3d3065c84c8e0e1ac8ba18cf0f47543c5e3d999a))
* correct showing wallets on mobile screens ([7bd5c93](https://github.com/rango-exchange/rango-client/commit/7bd5c93064d2c58dc617d678c3e8c9b29134d4ee))
* correct the formatting of the total payable fee in the fee details modal ([4c44cf0](https://github.com/rango-exchange/rango-client/commit/4c44cf0c9c3cd33b9f73cd9abf45a00690fe8ba7))
* correct translation bugs ([2a6930a](https://github.com/rango-exchange/rango-client/commit/2a6930a69fba60adb62d2319363e574232331bc0))
* correctly display small exchange rate values on the home page ([ca09b29](https://github.com/rango-exchange/rango-client/commit/ca09b29201ac2cc897bd31d473aab422b21d619c))
* default theme shouldn't be override on what user has set ([83f62dc](https://github.com/rango-exchange/rango-client/commit/83f62dc4d736401348de7fbe94df06883d79bda8))
* disable the confirm wallet button if all required wallets are not selected ([1fb200c](https://github.com/rango-exchange/rango-client/commit/1fb200c3dbb76c2e0f19688f8b2128a3b207cad7))
* display correct state in confirm wallets modal ([38ddfa3](https://github.com/rango-exchange/rango-client/commit/38ddfa331fbcbb7dec738107ac8090b76bfb4866))
* display error message from response instead of default fallback ([d017f50](https://github.com/rango-exchange/rango-client/commit/d017f50809d3c4b5c0d0501c60cfcdec49256e45))
* display the swapper's title instead of the swapper's group as their displayed name ([5f43457](https://github.com/rango-exchange/rango-client/commit/5f434575fc3435b655834b4d8995a47635e7ac72))
* error in wallet-connect projectId ([e9695dd](https://github.com/rango-exchange/rango-client/commit/e9695dd9156b854e70889f42634b671e4e80eaf3))
* exclud ledger on mobile and fix injected wallet bug ([409f742](https://github.com/rango-exchange/rango-client/commit/409f7429a9e0dd34180c5136f1c7bc4e28e15fba))
* fallback to empty string if image is null ([fb7529f](https://github.com/rango-exchange/rango-client/commit/fb7529f9d5c1f40ff286c579a54b826ecd12a9f1))
* fix a bug in searching history items and add a skeleton for history list labels ([063d96d](https://github.com/rango-exchange/rango-client/commit/063d96d1e0b2c2aabc1a236d1ef38c17bc97c3c1))
* fix balance not updating properly after transaction ([efb6f0d](https://github.com/rango-exchange/rango-client/commit/efb6f0df40e0d275de47ead7e282fd36919f7d7f))
* fix banner not showing on initial page load ([87cfc78](https://github.com/rango-exchange/rango-client/commit/87cfc7898959debd329099b6a7981663927e69d3))
* fix bug displaying the same token list for blockchains with the same number of tokens ([02fd3e2](https://github.com/rango-exchange/rango-client/commit/02fd3e2449e5ae654e2686cc780f8be78645c4b3))
* fix bug in routing when usd value is unknown ([0ee893e](https://github.com/rango-exchange/rango-client/commit/0ee893e25d3e6f7330a05890417e22617409df61))
* fix bug in swap input handling empty value ([dbd4ccc](https://github.com/rango-exchange/rango-client/commit/dbd4ccc35cefec4ffed8db0582cc0278f44c4a4c))
* fix bug of duplicate modals for wallet connect ([1cf61cc](https://github.com/rango-exchange/rango-client/commit/1cf61ccab17c687c5422677eaf6d54d9666f5773))
* fix bugs in displaying quote error modals ([10acdf1](https://github.com/rango-exchange/rango-client/commit/10acdf10b47e501d9ce12110ce5c3a8120e1655e))
* fix bugs in fetching quotes ([69c56a6](https://github.com/rango-exchange/rango-client/commit/69c56a64e3a304d40ae215a09867d1e915798877))
* fix console warning in widget ([2521344](https://github.com/rango-exchange/rango-client/commit/2521344661d752ee22a8b0ed9e5825d6b1b9b4cf))
* fix default injected wallet display logic and catch unhandled errors ([0c7b8a3](https://github.com/rango-exchange/rango-client/commit/0c7b8a39cf37f33f7c94947d799a5d3170b18d6b))
* fix dynamic content issue in crowdin ([f3c5cb5](https://github.com/rango-exchange/rango-client/commit/f3c5cb5954768b45a4e378a52acdf3639cafdd54))
* fix emitting failed event in swap execution ([d7e6610](https://github.com/rango-exchange/rango-client/commit/d7e66104ad52d928dd6f4d0413e6a47d3de410f5))
* fix error display for bad requests ([1721a85](https://github.com/rango-exchange/rango-client/commit/1721a8576858818cfffc4e814ef6bb87e3bfe098))
* fix export refresh modal ([072cf1e](https://github.com/rango-exchange/rango-client/commit/072cf1e0776d59446845c966f537521bd234cd44))
* fix flicker in playground ([528fffd](https://github.com/rango-exchange/rango-client/commit/528fffda1abad22e20ebc58d11cbd7ef04754115))
* fix full expanded design issues ([4ab87b3](https://github.com/rango-exchange/rango-client/commit/4ab87b3b7e4d6c583b26957e822f0971c83270ed))
* fix HMR for widget and playground ([71c15da](https://github.com/rango-exchange/rango-client/commit/71c15dadab4d161006b9f05a77c286b05c931528))
* fix hub problems with wallets config ([93994e0](https://github.com/rango-exchange/rango-client/commit/93994e0cc94fbf50e2055b617efeffa9fffb336b))
* fix incorrect input amount on max button click ([ad1f8e5](https://github.com/rango-exchange/rango-client/commit/ad1f8e555bd669f021e7c241f58e2a1f65158783))
* fix init config minor bug ([adf83a8](https://github.com/rango-exchange/rango-client/commit/adf83a81a57e046c1c38665cbb27eaff277a1387))
* fix lingui version ([ffe5b9c](https://github.com/rango-exchange/rango-client/commit/ffe5b9cfa94a83185fe53864d24f49144cd290fb))
* fix minor bugs ([767c3df](https://github.com/rango-exchange/rango-client/commit/767c3df9d1a4621da2542cb64768a6ab03e564b3))
* fix missing usd value in estimated output ([0b65555](https://github.com/rango-exchange/rango-client/commit/0b65555dec51933926c47f8081a1329411c5a330))
* fix multiwallets config initial value check bug ([f8bed19](https://github.com/rango-exchange/rango-client/commit/f8bed192798f64316356372cc82c488582b9ebee))
* fix performance issues on token selector ([0c19237](https://github.com/rango-exchange/rango-client/commit/0c19237f29e767edc71c27f83b1a94f7923d30ef))
* fix queue manager context in widget embedded ([88c47e2](https://github.com/rango-exchange/rango-client/commit/88c47e24ffa67d0d9b17c2f91ba5d707fd983712))
* fix quote info bugs ([ee4b407](https://github.com/rango-exchange/rango-client/commit/ee4b407047a212c13c136f0c04c58eefde30cd89))
* fix retry logic in failed swaps ([2395df7](https://github.com/rango-exchange/rango-client/commit/2395df7744b894369add0f020930b8651eaae1ce))
* fix retry swap on connect wallet ([bd15e9a](https://github.com/rango-exchange/rango-client/commit/bd15e9ab862564b4e6bef1156a34b608892a93e6))
* fix settings page issues ([2ee1391](https://github.com/rango-exchange/rango-client/commit/2ee1391c5cce9d8a60b064dd18c754f3062f397c))
* fix some swap messages in widget-embedded ([548c236](https://github.com/rango-exchange/rango-client/commit/548c2362859b686de8c95475b3ce610c8301226f))
* fix sort logic of notifications ([21d1aab](https://github.com/rango-exchange/rango-client/commit/21d1aab0a16db311043b96fdc959132daac6d93e))
* fix space between of routes and swap box in expanded mode ([1ca8c90](https://github.com/rango-exchange/rango-client/commit/1ca8c9045ee31ca1059739b65042156429003e4c))
* fix state of custom destination in playground ([3c224a9](https://github.com/rango-exchange/rango-client/commit/3c224a904a2894b89a3d6cedbc6aed48bfa3115a))
* fix swap detail styles issue ([58cf6a8](https://github.com/rango-exchange/rango-client/commit/58cf6a8fbe07f14ffb6b5a9ed903b294bffc84e9))
* fix swap-box banner overflow ([b1c44cc](https://github.com/rango-exchange/rango-client/commit/b1c44cc3b15219e98f8392a0141f598209a61ab0))
* fix tab manager error in Next.js ([8786880](https://github.com/rango-exchange/rango-client/commit/87868802736938f0ecc49f01dfa9d34c95adb067))
* fix the automatic selection of the connected wallets in the confirm wallets modal ([a7daefd](https://github.com/rango-exchange/rango-client/commit/a7daefdf192e112062053810d440af39897f201d))
* fix the entrance animation of the confirm wallets modal ([a37c2f3](https://github.com/rango-exchange/rango-client/commit/a37c2f324417534b769905ce78c5eb7a42170e00))
* fix token selector hover ui for token explorer link ([e8d2a20](https://github.com/rango-exchange/rango-client/commit/e8d2a20c39afe5c12b4c0667c7a4b36e097c3ffd))
* fix token selector infinite loader ([71efbd5](https://github.com/rango-exchange/rango-client/commit/71efbd52f9d978f931f1e54084937b0c59e83fbc))
* fix total balance calculation for WidgetInfo ([7a6dfc1](https://github.com/rango-exchange/rango-client/commit/7a6dfc195f8c7abf1d6a2eb2fd3ec31900be8ad2))
* fix unmounting router on changing language ([c14076d](https://github.com/rango-exchange/rango-client/commit/c14076d6e8deb4481ee8d32106abb24eff6e40b3))
* fix wallet button state in swap details page ([0ce6a7a](https://github.com/rango-exchange/rango-client/commit/0ce6a7abcf6d1bacd9a8324e737ebbc818f834ac))
* fix wallet modal closing bug ([9a39cf9](https://github.com/rango-exchange/rango-client/commit/9a39cf9e7141a740686d33801cf48ea3505dce9c))
* fix wallet state issue after retrying to fetch the balance following a failed attempt ([78d78d1](https://github.com/rango-exchange/rango-client/commit/78d78d11c6d35f60094a70c632d9956377eb5f26))
* fix widget event hook ([497f61c](https://github.com/rango-exchange/rango-client/commit/497f61c0d161ca041170fc2d34b4e7f0c3c4f6aa))
* fix widget icon size issue and add connected wallet tooltip ([a8d2dd9](https://github.com/rango-exchange/rango-client/commit/a8d2dd959ae7e25646f27c19c15e7eb674a564b9))
* fix widget navigation bugs ([1bab3a6](https://github.com/rango-exchange/rango-client/commit/1bab3a647d56effa684f5686ac778a1e58f1e016))
* fix widget ui minor bugs ([2ba56d3](https://github.com/rango-exchange/rango-client/commit/2ba56d3b94e13a512d7e725d9847b6daa7e2c622))
* fix widget-iframe styles ([7126f1a](https://github.com/rango-exchange/rango-client/commit/7126f1a6022a9411556763e9afc767e3f1b242eb))
* fix zustand persistance issue with ssr ([d66b9c7](https://github.com/rango-exchange/rango-client/commit/d66b9c73c70383c1bbcb78dad0fe0ee46139e727))
* Fixed colorpicker ([6bffe81](https://github.com/rango-exchange/rango-client/commit/6bffe8152574a7993d0fa7e66c5ff62de94b06d0))
* fixed onMouseLeave in tooltip ([e328864](https://github.com/rango-exchange/rango-client/commit/e3288643c90698f5e0fc54377376c6f9fa4c345f))
* get theme from config when singleTheme is true ([90450e4](https://github.com/rango-exchange/rango-client/commit/90450e4536dc0ff42505f827b632ee001fd53583))
* handle safe wallet in widget ([8e98b59](https://github.com/rango-exchange/rango-client/commit/8e98b59652ca67bc7501f6b13b549915583f48bf))
* handle token not found error for custom tokens ([148ae17](https://github.com/rango-exchange/rango-client/commit/148ae1779e092862f807c4d7cccc9c15c39dad87))
* if state is on connecting, we should call disconnect in terminateconnectingWallets as well ([3f85781](https://github.com/rango-exchange/rango-client/commit/3f857816073134bcf11d72932e739d3cc445f5ce))
* improve generate colors for tokens label and price impact color ([f094bb1](https://github.com/rango-exchange/rango-client/commit/f094bb1ebfe321896a4ca455a5535de9b4a3c228))
* improve handling of disabled swappers in widget ([0d26ab0](https://github.com/rango-exchange/rango-client/commit/0d26ab0ae8c95f180abf83129fe2bca9c6bbadb4))
* improve header component to center the title properly ([4aea6f8](https://github.com/rango-exchange/rango-client/commit/4aea6f854f37eaa3c141c56eb6fb2102099d0188))
* improve search token ([e3a8619](https://github.com/rango-exchange/rango-client/commit/e3a861920654848ffd7d36ae1a59103c8fc4bd15))
* improve ton signer and mytonwallet provider ([2abd51b](https://github.com/rango-exchange/rango-client/commit/2abd51b23e87a598771215438b510adf6c77ade0))
* improve widget for smaller screens ([3661ac9](https://github.com/rango-exchange/rango-client/commit/3661ac94dd710b9051dce44e24178c2b55eff457))
* input outlines & blockchains displayNames ([f10eca0](https://github.com/rango-exchange/rango-client/commit/f10eca0e7e3c16010a75e8d7608537d18483f644))
* layout shift on custom slippage input ([73cb0d3](https://github.com/rango-exchange/rango-client/commit/73cb0d39a932c3ccff271ac96e56f8b083ec3e2c))
* make hub compatible with external wallets ([180402a](https://github.com/rango-exchange/rango-client/commit/180402a2f8ae59e15b3583c94078e7112a0da2f7))
* make sure to correctly pass validation parameters when setting up a new swap ([ce7816f](https://github.com/rango-exchange/rango-client/commit/ce7816f3c388b6e1fe62ce9ed4f334ca0ee8d8d4))
* make widget compatible with rango-types ([d87f907](https://github.com/rango-exchange/rango-client/commit/d87f9072119155b28f913cc4f7d13ff8b7352597))
* not-found position in swap history ([a8f78ea](https://github.com/rango-exchange/rango-client/commit/a8f78eae4322eabaf46ff5416a5cadb91c3fd9c5))
* persist language in store ([5c51276](https://github.com/rango-exchange/rango-client/commit/5c5127644ab7954410e9b3892348078d0cf1bfb0))
* persist recommended slippage correctly as custom or preset ([34c2375](https://github.com/rango-exchange/rango-client/commit/34c23758b6cebd260a3b576c63a2d3bbfe779e4e))
* prevent crash in search history by moving currentStep after swap check ([b9d4354](https://github.com/rango-exchange/rango-client/commit/b9d4354cbf513075052ef8fb74ebb1427f4ee978))
* prevent reconnect on strict mode remount ([1f8801f](https://github.com/rango-exchange/rango-client/commit/1f8801fe20a5ef9138974092a4b51b506f522949))
* quote summary width ([776a94c](https://github.com/rango-exchange/rango-client/commit/776a94ccc919724f96cb0ecf832e10ad05def372))
* reading and showing blockchains/tokens based on config ([76972b9](https://github.com/rango-exchange/rango-client/commit/76972b92a763266f11e623f190174111502fd281))
* reading directly from specific path can break import for users ([083485a](https://github.com/rango-exchange/rango-client/commit/083485a3fb427f7fb8fc246d9cf5ff1287ba29df))
* recalculate supported tokens even if it's empty list ([70b36da](https://github.com/rango-exchange/rango-client/commit/70b36daf6804c00efa8caadf73eb17c955dff7fc))
* remove auto scroll behavior from collapsible components ([0648164](https://github.com/rango-exchange/rango-client/commit/064816418af4e7c3b96dc0ef3e3932fd353bb950))
* remove connected wallet on namespace disconnect ([c98358b](https://github.com/rango-exchange/rango-client/commit/c98358bd80b2b3095dccac38d7b412cc52bee501))
* remove redundant punctuation from settings page ([7be0a51](https://github.com/rango-exchange/rango-client/commit/7be0a512181f0f2b40f8ea934998b5e6c4751ef8))
* remove setting option from confirm swap page ([d93ce68](https://github.com/rango-exchange/rango-client/commit/d93ce68c5928758c6d2d989b396ef99cc717e204))
* rename pbt to ptb for sui ([6023ef8](https://github.com/rango-exchange/rango-client/commit/6023ef84340b25430001d5efd0e005bdd96ff2ae))
* rerfactor numeric tooltip and fix missing translations ([5b7c2ef](https://github.com/rango-exchange/rango-client/commit/5b7c2ef3a14f2a44cd2ecb30df3a10ae86432d0c))
* reset connecting state on close wallet modal ([7ce39e0](https://github.com/rango-exchange/rango-client/commit/7ce39e02b9faa3bb2a446d4f22fbc4a034d75d3b))
* reset derivation path if it's string and switching from custom mode ([77995e5](https://github.com/rango-exchange/rango-client/commit/77995e56a3cbbd0d2b04ed52e68b1df26cbda1e0))
* reset position of scroll in chain/token selector ([b1c72e0](https://github.com/rango-exchange/rango-client/commit/b1c72e0d1d779e166df2d296912e0b83b7cb3fb3))
* reset the quote when the source token matches the destination token ([a898bb8](https://github.com/rango-exchange/rango-client/commit/a898bb84c4aba5bc01fb474a8a5e44449d9d69e5))
* reset wallet state that remains in the connecting ([aafa3b2](https://github.com/rango-exchange/rango-client/commit/aafa3b231921dd41df4db9a12e3a386362987a00))
* resolve custom slippage bug ([3b7363b](https://github.com/rango-exchange/rango-client/commit/3b7363b5fce46ad53155c7ce54c109013c2ae84e))
* resolve issues for prices and dates, and add tooltips for prices ([f1066e9](https://github.com/rango-exchange/rango-client/commit/f1066e963395f27e5c3db90744eadae4928db0ad))
* resolve the issue with the custom tokens balance state ([8a447a7](https://github.com/rango-exchange/rango-client/commit/8a447a714902faa9fd62bcb484427189204fbe7d))
* resolve wallet is possibly undefined error in useSubscribeToWidgetEvents ([86edd40](https://github.com/rango-exchange/rango-client/commit/86edd4060def42dd50e493461ba4f7a6d4463fe5))
* resolve widget height issues in iframe ([2780a03](https://github.com/rango-exchange/rango-client/commit/2780a036817625a7cf17297a8b1b332d948f3731))
* skip showing drawer for fast wallet connecting ([47333b8](https://github.com/rango-exchange/rango-client/commit/47333b8586c8f4db1783edb0352c1e5f6e77f3a5))
* Some functions were transferred to helper ([6583908](https://github.com/rango-exchange/rango-client/commit/65839085b88e8bc82e9fce900b2a8761031bd3ac))
* some polishment on playground ([0fb82ca](https://github.com/rango-exchange/rango-client/commit/0fb82ca5c6d0d4d3cda07689028fb613e09f3b04))
* styling issues on layout ([579cd49](https://github.com/rango-exchange/rango-client/commit/579cd49e50669ee8a48a1450443bf115e17164e7))
* swap subtitle for history page ([b616e37](https://github.com/rango-exchange/rango-client/commit/b616e37d0107ab1fd1bdc42dd98b0ae964a76a3a))
* switch only selected accounts to loading state and handle failure on fetch balance ([978b195](https://github.com/rango-exchange/rango-client/commit/978b1953aa42df67af1d60cf65d2c5be2c5f6d7b))
* sync notifications with persisted swaps ([e91783b](https://github.com/rango-exchange/rango-client/commit/e91783bda87657d0e7bbe77bb11a73c53f0f99e3))
* translate bug ([7a8ae9b](https://github.com/rango-exchange/rango-client/commit/7a8ae9bd2e5fd32405a2d493df641758dedc64d9))
* turn autocomplete off for history search input ([b72a55c](https://github.com/rango-exchange/rango-client/commit/b72a55c8d9afa4234cbc8963885164ed892285f2))
* update balance after transaction with max amount ([7ec0b01](https://github.com/rango-exchange/rango-client/commit/7ec0b015f6b76fe92c2448f348328cf99d23e8d5))
* update balance only if account is still connected ([274ee2a](https://github.com/rango-exchange/rango-client/commit/274ee2af169dcbff5f04f89c05115a3a5ec68a17))
* update blockchain category icons ([4b0c740](https://github.com/rango-exchange/rango-client/commit/4b0c7406ce84b3764c483ff0ef757014651c62b7))
* update classNames to new pattern for conflict prevention ([5abc4a4](https://github.com/rango-exchange/rango-client/commit/5abc4a439f4b9c3a082c392417f504ab881c8a8b))
* update design for not-selected blockchain or token ([6dc735f](https://github.com/rango-exchange/rango-client/commit/6dc735f5e43b89a29f8b347d776170c245c0e358))
* update explorer url on connected wallets ([bcb5235](https://github.com/rango-exchange/rango-client/commit/bcb5235e4a019b916486991d9fb625d84d09b4f6))
* update rango-types and fix notification bugs ([e5660ec](https://github.com/rango-exchange/rango-client/commit/e5660ec9e67c96c9f27ddd29773b67aaa60a69d2))
* update widget affiliate config ([e3149f9](https://github.com/rango-exchange/rango-client/commit/e3149f9e19698d5bbe740593bff91fb7cfd8a39e))
* updated profile banner format from png to jpg ([59b7a78](https://github.com/rango-exchange/rango-client/commit/59b7a783d8997cbcec90e011beeb9761517571d0))
* updating query params ([b69c133](https://github.com/rango-exchange/rango-client/commit/b69c133163d7339f9eafba1c89136b06befec512))
* usdValue shouldn't be formatted to calculate the total value ([e7ef168](https://github.com/rango-exchange/rango-client/commit/e7ef1683f4b04660216f306d9417379c8d25efb5))
* widget config for default amount/chain/token ([8c1ed31](https://github.com/rango-exchange/rango-client/commit/8c1ed31f77d7363515714e64bd2d00a0057c60a9))
* widget ui bugs ([0a6069d](https://github.com/rango-exchange/rango-client/commit/0a6069dc8681174be71f9cf211353ab2afe65555))
* **widget:** Showing history for selected blockchain if a blockchain selected from main list ([ee7ffa8](https://github.com/rango-exchange/rango-client/commit/ee7ffa811b0c5b2fc14ddba5d1125fac9d1842b6))
* zustand store in context ([779669a](https://github.com/rango-exchange/rango-client/commit/779669a9b90adb06058d2a1c48ee54f986211286))


### Features

* add a modal for setting custom derivation path for ledger ([6e33216](https://github.com/rango-exchange/rango-client/commit/6e332160cd1febeded77230c30bb04bea70853c9))
* add an adapter for Hub for wallets-react and enabling Hub by default. ([016fe92](https://github.com/rango-exchange/rango-client/commit/016fe924f30426b5ee92313c2bb9213a31210d71))
* add an expand mode for our compact widget ([f6cc8c2](https://github.com/rango-exchange/rango-client/commit/f6cc8c2624be5d874c446bedafd9ba7e648f9624))
* add an option to wallet connect provider to open a desktop wallet directly ([975ccbe](https://github.com/rango-exchange/rango-client/commit/975ccbe93b1892200a0fa43bfc42e78b26815df2))
* add animation for modal ([54b7fa8](https://github.com/rango-exchange/rango-client/commit/54b7fa8647d1e4876476a16019dfc97d10dc4c98))
* add animation for switch swap button ([496a7a7](https://github.com/rango-exchange/rango-client/commit/496a7a7ef50ac7e4dbc092404c1965d434c54b94))
* add auto retry for fetching confirm swap ([b597fb5](https://github.com/rango-exchange/rango-client/commit/b597fb53aaca988a7bad971f847b3a95fbff12a9))
* add custom solana rpc url to config ([513b5ae](https://github.com/rango-exchange/rango-client/commit/513b5aef7bdeec0898f11a6fdf5ea7e23be2fe66))
* add dark/light theme to playground ([694cc67](https://github.com/rango-exchange/rango-client/commit/694cc672181fd7342f2aaa2951dab0970487c2e2))
* add default injected wallet ([4d9bfaa](https://github.com/rango-exchange/rango-client/commit/4d9bfaab7baf2558f7ca2f5d5a828b9c1bee7763))
* add derivation path modal for trezor wallet ([74fb02e](https://github.com/rango-exchange/rango-client/commit/74fb02ee9c91f4d16f6787e3fe30f3d8c697885d))
* add detached connect wallet modal ([7dbfe35](https://github.com/rango-exchange/rango-client/commit/7dbfe35e449d059c7011fe3cf87f55bad45873e7))
* add dynamicHeight to iframe ([e31958c](https://github.com/rango-exchange/rango-client/commit/e31958c927b56625de6cc1a2723b6e2b1f0d73f8))
* add enabling centralized swappers to config ([a6940c5](https://github.com/rango-exchange/rango-client/commit/a6940c505778b00dbf2cd01c1e3babd0d82f510f))
* add fee details modal in widget full-expanded mode ([7cfc12d](https://github.com/rango-exchange/rango-client/commit/7cfc12d09eacbad5d25b7eeb5f77dcb7b96e25b2))
* add filter and clear to widget history ([580bfa4](https://github.com/rango-exchange/rango-client/commit/580bfa49ef0e015c6fd7a4e9153eaad877ecbfe0))
* add full expanded variant to widget ([7aca1c2](https://github.com/rango-exchange/rango-client/commit/7aca1c2b93d7861a953a81bcb5289b30ff68efaf))
* add functionality to display a banner at the bottom of the swap box ([2132710](https://github.com/rango-exchange/rango-client/commit/2132710b9af4b9d9abd4e0b453f6bfe645452eb3))
* add functionality to support custom tokens ([e7c87ca](https://github.com/rango-exchange/rango-client/commit/e7c87caa28a52418d5daed0a6fb2ff6c2b726e16))
* add functionality to update the quote inputs from outside the widget ([8a88a15](https://github.com/rango-exchange/rango-client/commit/8a88a15fe90ba3ac6432704d2a88255437683906))
* add id property to buttons ([e3e41da](https://github.com/rango-exchange/rango-client/commit/e3e41da61da78c24443e9edf48ddf9a114ec5657))
* add langugage section to Playground ([a56d763](https://github.com/rango-exchange/rango-client/commit/a56d7637e1ab0fb91dd1939770e3a1b2a4c35eb6))
* add link to profile banner ([2e975da](https://github.com/rango-exchange/rango-client/commit/2e975da02391bb46ffd8fac033aad12b4770b681))
* add more languages to widget ([2897a0d](https://github.com/rango-exchange/rango-client/commit/2897a0d2b0611265bfdba3a92bbd4ca774b96904))
* add more languages to widget ([8eb6415](https://github.com/rango-exchange/rango-client/commit/8eb64158f78dc6c9855858ffee34841c3c89bac7))
* add more predefined fonts list from google fonts ([88180d2](https://github.com/rango-exchange/rango-client/commit/88180d2a749a31eea16d4b12362dd88b7d89317d))
* add new states for wallet buttons ([ee6d29d](https://github.com/rango-exchange/rango-client/commit/ee6d29d1eef11d8eb5d271b4a06c51ece093fa0c))
* add notification to widget ([0eba391](https://github.com/rango-exchange/rango-client/commit/0eba391751003a9718190636f6809bd8e3bbe2a0))
* add portuguese language to widget ([18e3c9f](https://github.com/rango-exchange/rango-client/commit/18e3c9fdeaf767421dbfa5589f845bc2dfadd4a4))
* add preventable event and a new ui event called CLICK_CONNECT_WALLET ([d98efca](https://github.com/rango-exchange/rango-client/commit/d98efca36ae87ce0bfe544326035e6b9b1bb631b))
* add profile banner to widget success modal ([8c65cb2](https://github.com/rango-exchange/rango-client/commit/8c65cb2081ad434e91d393e7f575fdbcfb015c0e))
* add project id as a external value ([a4146ea](https://github.com/rango-exchange/rango-client/commit/a4146eab7586754312c9a4f5ed91e072a8f6c391))
* add right anchor prop to modal component ([0af3d6d](https://github.com/rango-exchange/rango-client/commit/0af3d6d1d4efe26731e3cac0cc6fe7d948ecca2c))
* add route skeleton component ([c56a75e](https://github.com/rango-exchange/rango-client/commit/c56a75e9777a221112bf44c51295a0e6854d66d0))
* add route time warning for slow routes ([26a86e9](https://github.com/rango-exchange/rango-client/commit/26a86e9c11697901d5e70cb6f0a28d6c48d32958))
* add routing params to widget config ([c739178](https://github.com/rango-exchange/rango-client/commit/c7391781d7faa4a002bdb62917458196e1f89640))
* add sending solana transaction on multiple nodes ([3d67674](https://github.com/rango-exchange/rango-client/commit/3d6767492c6ff4d66d19705203b3403a758a68e2))
* add skeleton for wallet-page & showing its error ([c8df42d](https://github.com/rango-exchange/rango-client/commit/c8df42db420e7dc8e4cfe0b292ba77d7f1c6a17c))
* add slippage validation on Settings page ([828d702](https://github.com/rango-exchange/rango-client/commit/828d7028da8c399e6699b212bba5383bb87b53ea))
* add solana to ledger ([2db1c76](https://github.com/rango-exchange/rango-client/commit/2db1c76bbf3a158a4f9fc9d14f8458e829a94763))
* add sort filter for multi routing (compact mode) ([bf5f54f](https://github.com/rango-exchange/rango-client/commit/bf5f54f38a02625217aff73b3062eace38f638f0))
* add state of wallets' details to useWidget ([80c2fad](https://github.com/rango-exchange/rango-client/commit/80c2fadb122534bd843bd8132c44f9172ead2f2b))
* add state wallet modal ([1788040](https://github.com/rango-exchange/rango-client/commit/178804040d27e17456392116db8a74ea868c8ad8))
* add static test attributes ([92c01ac](https://github.com/rango-exchange/rango-client/commit/92c01ac7b776b421d44ba88cd9571cd39f1a0c19))
* add support for Trezor hardware wallet ([838a17d](https://github.com/rango-exchange/rango-client/commit/838a17db0e780664f19b3c6edde82f1972af858d))
* add test to check workflow ([6054715](https://github.com/rango-exchange/rango-client/commit/6054715f11b5f9485f155ae80f9614fd95f1dae1))
* add the option to define a default custom destination for each blockchain in the widget config ([84787ca](https://github.com/rango-exchange/rango-client/commit/84787ca723856acd9adcc5ee3e54c4e22b04a223))
* add ton connect provider ([250ca69](https://github.com/rango-exchange/rango-client/commit/250ca69a7c4fa19d2bc9b054dc82cfab8b905fd5))
* add unit test for app store ([695e1f8](https://github.com/rango-exchange/rango-client/commit/695e1f8f437d4b45016bde65bd6bfbe4c650076d))
* add wallet name to waiting for connect wallet warning message ([4eb24e7](https://github.com/rango-exchange/rango-client/commit/4eb24e7052ba6db267161eaa77d7b3585d13f289))
* add widget events and refactor swap execution events ([3c1c828](https://github.com/rango-exchange/rango-client/commit/3c1c8286c86a06692528d7581e528aeef6b6451b))
* adding 'shadows' to widget config for theme ([116dbc9](https://github.com/rango-exchange/rango-client/commit/116dbc93ada181caa8ec4d65e618e9ffe0d98b45))
* adding a modal for fee on quote component ([8073004](https://github.com/rango-exchange/rango-client/commit/8073004acc18f895941828466cafc8861b2946b9))
* Adding title to config and export IDs for accessing blockchain image and swap input ([0319b59](https://github.com/rango-exchange/rango-client/commit/0319b59e3cb5b8adcf1b4614d7b778e163d91037))
* adjust the number of blockchains in the token selector based on widget height changes ([e03a11e](https://github.com/rango-exchange/rango-client/commit/e03a11ef827dd10d517c289c23358775ad0eae8f))
* attach config object to window for debugging purposes ([3fbb573](https://github.com/rango-exchange/rango-client/commit/3fbb57384bae25646a18bbd3b01a7f69ea473a95))
* change colors theme ([d3684c1](https://github.com/rango-exchange/rango-client/commit/d3684c15f5fec482e4724ae4f3b00319a1483500))
* change modal & toast interface ([1d83e46](https://github.com/rango-exchange/rango-client/commit/1d83e46048a84c678212be9feddc23b6eb248e7b))
* changing the request ID copy process ([99374f3](https://github.com/rango-exchange/rango-client/commit/99374f3e2376ecce4cfffe4ccb576a8295c3abe1))
* consider internalswaps in second bestRoute & select wallets ([cd8f9ad](https://github.com/rango-exchange/rango-client/commit/cd8f9adf419883f570aff89f4dae3acbcb4976a3))
* custom colors for presets (style sidebar) ([78cf04d](https://github.com/rango-exchange/rango-client/commit/78cf04d4fdfec01aa70052446b876b24a53f05b1))
* design history item page ([6bfb4ef](https://github.com/rango-exchange/rango-client/commit/6bfb4ef922d0e29049724f053ae93b403bff0557))
* detect proper error related to wallet connect params ([915ebf3](https://github.com/rango-exchange/rango-client/commit/915ebf3c2fe99392afb375cd324598572ec08d97))
* display a warning if the output amount changes on the confirm swap page ([a46faba](https://github.com/rango-exchange/rango-client/commit/a46fabaef16f8f0bea9c3fbbbc9e416f87df3ed7))
* display all notifications in the notification popover ([fa9c6e7](https://github.com/rango-exchange/rango-client/commit/fa9c6e74c3e077ce5f9f358daf98d33ee7ec93bb))
* display detached modal when fully connected wallet is clicked ([490629a](https://github.com/rango-exchange/rango-client/commit/490629a499d73c4033286e21260f40e4481a4388))
* display same source and destination token warning on widget ([70f2b50](https://github.com/rango-exchange/rango-client/commit/70f2b502ab34f9b7cc1ca64fc4504b3d0473ae4b))
* don't show safe when not injected ([94becf8](https://github.com/rango-exchange/rango-client/commit/94becf80f85bad2663a81cc88d1ac7d18836ab79))
* export a new hook for handling required data for connect called useStateful ([8e53946](https://github.com/rango-exchange/rango-client/commit/8e53946f4be569dd8aa2793fc88d09311bcc1a46))
* export meta and additional logics from useWidget ([0067f95](https://github.com/rango-exchange/rango-client/commit/0067f95b2336532b3fd0b07630a456be5ae77407))
* export notifications from useWidget ([bb615cb](https://github.com/rango-exchange/rango-client/commit/bb615cb80e8457dc745b65ec275ac779f8ef9573))
* export StatefulConnect components and helpers ([cbff154](https://github.com/rango-exchange/rango-client/commit/cbff15405311c59f67ec7b2c7528b02fb065621b))
* export useWalletList for use in dapp ([6a88438](https://github.com/rango-exchange/rango-client/commit/6a88438409cf8b8938d60e0b9075f7c2b8b06959))
* feature management from server ([a5e61d8](https://github.com/rango-exchange/rango-client/commit/a5e61d87a9fbf690a3eb6be3285bb195b54e5553))
* fetch balance for custom tokens ([aefce88](https://github.com/rango-exchange/rango-client/commit/aefce88ef3d0714d2aef76ebed3957b9bcbcb481))
* for long routes, we should show a shorter version and hide the rest in a button. ([bd0c7c9](https://github.com/rango-exchange/rango-client/commit/bd0c7c905b26bf9f3bd8bf810202c55c3f2be61f))
* generate theme color tints and shades using the new method of overriding them separately ([1ed421a](https://github.com/rango-exchange/rango-client/commit/1ed421a5876d154546cb1cb1f29f22f7d739181e))
* Get Wallet Connect project id from config ([74d189e](https://github.com/rango-exchange/rango-client/commit/74d189e095d44dffba5b4145c8cf264e8e6a1a37))
* handle active tab in widget-embedded ([42d3c4a](https://github.com/rango-exchange/rango-client/commit/42d3c4a795e775289d27583a169f06976b92f4f6))
* handle connecting wallet with exactly one namespace for hub ([c21f929](https://github.com/rango-exchange/rango-client/commit/c21f929609a116dcf78158fbb98792fa4e536a94))
* handle wallet referrer in widget ([12fbe22](https://github.com/rango-exchange/rango-client/commit/12fbe22f26680760af71712cdc1f3c2081daf4e2))
* Header redesign ([1b5ba34](https://github.com/rango-exchange/rango-client/commit/1b5ba3442ce16af2324975d9d13020722e44d3d4))
* hide balance and max button when no wallet connected ([79c94d8](https://github.com/rango-exchange/rango-client/commit/79c94d856ed6d05eb7d8518bdaf9a7769a45ab67))
* history list page loading ([e5ac9c2](https://github.com/rango-exchange/rango-client/commit/e5ac9c22d19d43e5a55bd81d163f96f18763f8e0))
* implement auto-refresh for routes ([ac4a969](https://github.com/rango-exchange/rango-client/commit/ac4a9693530caaf80d09ae607ce8dbc39cc07ddc))
* implement default chain/token/amount section to playground ([a84302a](https://github.com/rango-exchange/rango-client/commit/a84302a7b16d460500cad65fc80ca986f605ee4c))
* implement expanded-mode route ([ac248c2](https://github.com/rango-exchange/rango-client/commit/ac248c2ba22667885d930ece316686267a0bd25f))
* implement feature disabling in widget config ([dc3b64d](https://github.com/rango-exchange/rango-client/commit/dc3b64da85eeec88030b47d718b702d12017c24f))
* implement general style options for playground ([0ee56c4](https://github.com/rango-exchange/rango-client/commit/0ee56c4f513cbe43cbac0d886f904d5e59e55789))
* implement hover state for full-expanded-route ([a2612ad](https://github.com/rango-exchange/rango-client/commit/a2612ad0b658a561239e31fd5eaef98d57d59980))
* implement liquidity sources for playground ([1097661](https://github.com/rango-exchange/rango-client/commit/109766184f77067cc402d37aa375f7a2e3cc752e))
* implement multi routing in widget ([63ae513](https://github.com/rango-exchange/rango-client/commit/63ae5130813f753b9b52c1836f7da6794804568d))
* implement pin tokens in From and To ([9fed56d](https://github.com/rango-exchange/rango-client/commit/9fed56d9da386e9efd9d7901a412639bf2a14255))
* implement playgroud wallet section ([8224030](https://github.com/rango-exchange/rango-client/commit/8224030eeff77c0dda03b0de90a22bae2476804b))
* implement route errors/warnings ([c4dabd0](https://github.com/rango-exchange/rango-client/commit/c4dabd0156b42e7e3f5344aa19be9295e684b9fc))
* implement search functionality for custom tokens ([53a0c7b](https://github.com/rango-exchange/rango-client/commit/53a0c7bd6336e414de761d8e86c5f68fa1905adc))
* implement supportedBlockchain in playground ([a734995](https://github.com/rango-exchange/rango-client/commit/a7349952e3065be789b677ac23ca7bc71733463f))
* implement supportedTokens for playground ([712ca34](https://github.com/rango-exchange/rango-client/commit/712ca34a688e1d7b357d6e072fafd0f922e34b2e))
* implement Themes section in Style for playground ([7da3cf5](https://github.com/rango-exchange/rango-client/commit/7da3cf52a3301696d9ff821c8aabfd67416f45cd))
* implement updated design for initial connect modal ([469ff34](https://github.com/rango-exchange/rango-client/commit/469ff34f1d72e0bcda94d804c95055ce613d9803))
* implement WidgetProvider & useWidget for accessing specific widget data ([1dfb8fa](https://github.com/rango-exchange/rango-client/commit/1dfb8fa32910ca46e786fb04b76a6a5a04004512))
* implemnting Wallet & Tooltip ([37785d2](https://github.com/rango-exchange/rango-client/commit/37785d2eeb7e4723d8e4a9c51bf2db51fddaabe7))
* improve all routes button ([aea9b72](https://github.com/rango-exchange/rango-client/commit/aea9b72813b34cc2a2c3803652135f9d020d3ce2))
* improve header buttons and notifications ([507cd91](https://github.com/rango-exchange/rango-client/commit/507cd916871975de9351401c693faf861045c63a))
* improve playground mobile view and widget variants and liquidity sources ([74d9b11](https://github.com/rango-exchange/rango-client/commit/74d9b11af6e29a15c6e12f638007bced708d2551))
* improve widget ux on small devices with dynamic height ([5a40c62](https://github.com/rango-exchange/rango-client/commit/5a40c627ecd9aafd9302d130d681c54ed0a0ec9b))
* introducing store events for hub and fix switching accounts using that ([c22a5fa](https://github.com/rango-exchange/rango-client/commit/c22a5fa7aede26c26838029c658b3d6b30ccc1c5))
* keep user history for selected chains ([aa92670](https://github.com/rango-exchange/rango-client/commit/aa92670f2237d81a0fb7b6bd4a2a9b1f555acc82))
* loading for bridges and exchanges ([856b185](https://github.com/rango-exchange/rango-client/commit/856b185495c9a6fad7cfcdee066274228edb966a))
* loading swap history item ([825406f](https://github.com/rango-exchange/rango-client/commit/825406fd85971d8e6f0ef9ea411565137817cd11))
* make the swap header scrollable on the swap details page ([34860d9](https://github.com/rango-exchange/rango-client/commit/34860d952280514f957e6b154582ef2e8b5594ed))
* make update settings optional to make it enable in playground ([bf081d7](https://github.com/rango-exchange/rango-client/commit/bf081d700d968001327a531e928e5328be41564a))
* passing enabled swappers/bridges to widget through the url for campaigns ([bcb48b4](https://github.com/rango-exchange/rango-client/commit/bcb48b4f379ec7f10203f9730d81edee5a757da9))
* re-design modal & drawer & add message box ([fffd1cf](https://github.com/rango-exchange/rango-client/commit/fffd1cffb01d5ec5422c89996ffcc071e56f3629))
* re-design switch & radio component ([d4d9d6e](https://github.com/rango-exchange/rango-client/commit/d4d9d6e9e49282d0ef1fbe5c99b80e398c21e30c))
* re-implement history list page ([4fbeefc](https://github.com/rango-exchange/rango-client/commit/4fbeefcd4641092fd828a81ece253ce2c92328c4))
* redesign of connect wallet page ([5912ae5](https://github.com/rango-exchange/rango-client/commit/5912ae5d9c052520fed80a1355a71e149f5743e3))
* redesign setting page ([d3c4d52](https://github.com/rango-exchange/rango-client/commit/d3c4d52675631c5c5565c0bae1274c74d97cd551))
* redesign skeleton & add swap to/from swap page ([c226fc8](https://github.com/rango-exchange/rango-client/commit/c226fc884c722f54a9423f35810f2c4a39a7986a))
* redesign sub setting page ([b5b09dd](https://github.com/rango-exchange/rango-client/commit/b5b09dd8aac631df97f4b8ef4605edfe5970af63))
* redesign switching theme in settings ([ac0a740](https://github.com/rango-exchange/rango-client/commit/ac0a740975f9487a2e317e796f53686f04f287db))
* refinement home page ([f0a46fb](https://github.com/rango-exchange/rango-client/commit/f0a46fb81376327b538b4000be85ec7d19a69573))
* setup crowdin localization ([0be1009](https://github.com/rango-exchange/rango-client/commit/0be1009468a5b8d29d12772fc5bccadbea45dee6))
* setup lingui for multi-language in widget ([4ebc59c](https://github.com/rango-exchange/rango-client/commit/4ebc59cc9fb5685c903694cb7da49a10232d1535))
* show a modal with page reload when meta hasn't loaded ([c833b6a](https://github.com/rango-exchange/rango-client/commit/c833b6ac55f3c60a24e58b31c94e56098ac1e532))
* show slippage and rate in swap box ([1370bd9](https://github.com/rango-exchange/rango-client/commit/1370bd9e5e5ca65a36765c76872e10e1929d249f))
* support experimental features ([eaef1f6](https://github.com/rango-exchange/rango-client/commit/eaef1f6b0cac29d89bed2adb0f13ecf843eeeead))
* support for external wallets ([44c4ee0](https://github.com/rango-exchange/rango-client/commit/44c4ee0078f19bc8091edcaa739e83f2e9c17a8f))
* support multi languages ([e7bd148](https://github.com/rango-exchange/rango-client/commit/e7bd148a6203b15758643ca7b4ac138c410b944e))
* support new widget events ([cf3521d](https://github.com/rango-exchange/rango-client/commit/cf3521d459cd3dde2cef4aaebedf04a99e3431f3))
* sync swap process with notifications ([eb369f5](https://github.com/rango-exchange/rango-client/commit/eb369f53690d6d73154197d934095ffbbbea8688))
* token/chain selector problems ([0c573da](https://github.com/rango-exchange/rango-client/commit/0c573da1e58ce32739a556837c56bf199f12bb68))
* update active tab warning position ([f7ff221](https://github.com/rango-exchange/rango-client/commit/f7ff22155b32fda415e4fd13f5a2a78fe677a6ff))
* update colours for quote variant for rango/default theme ([d8d3583](https://github.com/rango-exchange/rango-client/commit/d8d35831fdd87421ab84437800162ff5128cd4ab))
* update confirm swap and confirm wallets components ([0bfcee3](https://github.com/rango-exchange/rango-client/commit/0bfcee3b14455ead392c6912c309f168f1c3b16f))
* update explorer icon and add paste to custom destination ([041d111](https://github.com/rango-exchange/rango-client/commit/041d111f0ab4e6377b336523e3ebf3c827874c9a))
* update filter tokens interface in widget ([889fa30](https://github.com/rango-exchange/rango-client/commit/889fa30c308dad7b690879bc6f2262703c9cce15))
* update sui to consider recent api changes ([265ff47](https://github.com/rango-exchange/rango-client/commit/265ff47fc90db86fd3c94183b3e48105241e6ae6))
* update wallets page to add filter by transaction types (category) ([5b3f6c7](https://github.com/rango-exchange/rango-client/commit/5b3f6c7ee07bb9feec7319587c71207b1fbd439e))
* widget colors! ([b8e1a8e](https://github.com/rango-exchange/rango-client/commit/b8e1a8e96bbc354984ad2cf1dbe2d08efcadaf26))
* **widget-v2:** redesign button ([41637f3](https://github.com/rango-exchange/rango-client/commit/41637f360025504c820692c7faa59f5720e219c3))


### Performance Improvements

* improve finding tokens from store ([ab2a0ea](https://github.com/rango-exchange/rango-client/commit/ab2a0ea487d80f400d392d3c41cbfcfa15cd1a19))
* improve getConnectedWalletsDetails query by memozing ([655216a](https://github.com/rango-exchange/rango-client/commit/655216ad6c8cb70c334685b290817c234339b128))
* improve token list performance by caching target tokens on load and config change ([babe82d](https://github.com/rango-exchange/rango-client/commit/babe82df0d89ae9fa453de65f14a1586b754a94a))


### Reverts

* Revert "support for rango-types cjs format" ([4e95f25](https://github.com/rango-exchange/rango-client/commit/4e95f254e9ffa5938666eb088f6d073795af80e7))
* reset wallet state that remains in the connecting ([ac7f473](https://github.com/rango-exchange/rango-client/commit/ac7f473021141327bbff672dcf471fef27e98b5b))



## [0.44.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.44.0...widget-embedded@0.44.1) (2025-06-10)


### Bug Fixes

* layout shift on custom slippage input ([8a8fb3b](https://github.com/rango-exchange/rango-client/commit/8a8fb3b7fd88928828c4b6331dd9481fec32ed50))



# [0.44.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.43.0...widget-embedded@0.44.0) (2025-06-09)


### Bug Fixes

* add sanitizeInputAmount for blur normalization of zero values ([9691146](https://github.com/rango-exchange/rango-client/commit/969114619abfc7865b55fa2b003b4d0ce19bc36d))
* autocomplete off for search inputs ([4b47521](https://github.com/rango-exchange/rango-client/commit/4b475216395fb9c0404fdd28a2f26e2c69c12318))
* correct the formatting of the total payable fee in the fee details modal ([ee052d3](https://github.com/rango-exchange/rango-client/commit/ee052d3f3e5bd8ab4284a01a6e9d92dc627efb68))
* correctly display small exchange rate values on the home page ([a3e103f](https://github.com/rango-exchange/rango-client/commit/a3e103f116062f0ebfe4062179ed8794a6f24bc2))
* display correct state in confirm wallets modal ([46417f1](https://github.com/rango-exchange/rango-client/commit/46417f1b75c4daf3d3cb4d43af8b695cdcc71720))
* display error message from response instead of default fallback ([188e130](https://github.com/rango-exchange/rango-client/commit/188e130a1603a8533f19db3545a445523187593b))
* fix retry swap on connect wallet ([f6c45b6](https://github.com/rango-exchange/rango-client/commit/f6c45b6c4a6b92a208e04606b42ed98d327ad349))
* make widget compatible with rango-types ([d8e8ef9](https://github.com/rango-exchange/rango-client/commit/d8e8ef996efc3179932dc91224d97bc7f54ae09f))
* turn autocomplete off for history search input ([97bc186](https://github.com/rango-exchange/rango-client/commit/97bc18649d0f1ee292c46837db2a1a7f00df97b1))


### Features

* add detached connect wallet modal ([b2d7d6f](https://github.com/rango-exchange/rango-client/commit/b2d7d6fda2bdfe3e9f72baba95a1a7694e3db21a))
* add new states for wallet buttons ([d337aee](https://github.com/rango-exchange/rango-client/commit/d337aeed2315173a7820d3adedb412a4a1704fcd))
* add static test attributes ([51b1433](https://github.com/rango-exchange/rango-client/commit/51b1433ab464a7255ec9f54499df65fbf98aa66b))
* show slippage and rate in swap box ([54aea4e](https://github.com/rango-exchange/rango-client/commit/54aea4e69413bc7383716893f091b2ef1b0ae693))



# [0.43.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.42.3...widget-embedded@0.43.0) (2025-05-26)



## [0.42.3](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.42.2...widget-embedded@0.42.3) (2025-05-21)


### Bug Fixes

* prevent crash in search history by moving currentStep after swap check ([5a520f0](https://github.com/rango-exchange/rango-client/commit/5a520f0750700f70a50c7f35e73c3c401d7755f5))



## [0.42.2](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.42.1...widget-embedded@0.42.2) (2025-05-12)


### Bug Fixes

* resolve widget height issues in iframe ([2fb4aa9](https://github.com/rango-exchange/rango-client/commit/2fb4aa99b5562183a9623d0a9ca219919a316c5e))



## [0.42.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.42.0...widget-embedded@0.42.1) (2025-05-04)



# [0.42.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.41.1...widget-embedded@0.42.0) (2025-04-30)


### Bug Fixes

* rename pbt to ptb for sui ([3d6d89f](https://github.com/rango-exchange/rango-client/commit/3d6d89f2265766607a15d61e0df92643fb33072b))
* swap subtitle for history page ([320d095](https://github.com/rango-exchange/rango-client/commit/320d095e60acf17d1a4a7d713b38569d3f9e8feb))


### Features

* add slippage validation on Settings page ([e65caab](https://github.com/rango-exchange/rango-client/commit/e65caab8d5a547405728c7e2d44da9a90b0ba770))
* add wallet name to waiting for connect wallet warning message ([68695c1](https://github.com/rango-exchange/rango-client/commit/68695c1e7e0dc904f6490a8dccee377ced56cd3c))
* adjust the number of blockchains in the token selector based on widget height changes ([1fcc81a](https://github.com/rango-exchange/rango-client/commit/1fcc81a7e4f62e0c9fd52f631b9421d428b6b395))
* handle connecting wallet with exactly one namespace for hub ([bbeca1d](https://github.com/rango-exchange/rango-client/commit/bbeca1dc28c0b6049463446c8045dfaf3cd53def))
* implement updated design for initial connect modal ([2873c63](https://github.com/rango-exchange/rango-client/commit/2873c630de0740bb3b9f4e52bfa018857bd54dcd))
* improve widget ux on small devices with dynamic height ([47275b0](https://github.com/rango-exchange/rango-client/commit/47275b01001a953b8aee218aa0429bbf3307ba3b))
* make the swap header scrollable on the swap details page ([7f10f49](https://github.com/rango-exchange/rango-client/commit/7f10f49b3e859c9432d86164166b75428ed169f0))
* update sui to consider recent api changes ([d764b25](https://github.com/rango-exchange/rango-client/commit/d764b2501df9bb295f63cdbc0b05acd4a3abb4b9))



## [0.41.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.41.0...widget-embedded@0.41.1) (2025-03-17)


### Bug Fixes

* batching state updates for fetchBalances ([32f055f](https://github.com/rango-exchange/rango-client/commit/32f055f9e2fb7672f221ad52a9bc83bd1b0a25af))
* fix banner not showing on initial page load ([8683a60](https://github.com/rango-exchange/rango-client/commit/8683a607ec4cf3487c7ac674f0582dd57c01d7a0))
* fix swap-box banner overflow ([8a01c95](https://github.com/rango-exchange/rango-client/commit/8a01c95c701f65f28323c5ea7dc5b0c83dd0239b))
* resolve the issue with the custom tokens balance state ([86722e8](https://github.com/rango-exchange/rango-client/commit/86722e8dcb946196d5247c93b454b39733af0a4e))
* resolve wallet is possibly undefined error in useSubscribeToWidgetEvents ([6231d46](https://github.com/rango-exchange/rango-client/commit/6231d4610e9967840236e23ee45b9263adfa4c53))



# [0.41.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.40.1...widget-embedded@0.41.0) (2025-03-11)


### Bug Fixes

* avoid problematic routes for contract wallets ([0c82a83](https://github.com/rango-exchange/rango-client/commit/0c82a83008de6fe22f3685f1d22ab54bd59e5362))


### Features

* add functionality to display a banner at the bottom of the swap box ([8f4893e](https://github.com/rango-exchange/rango-client/commit/8f4893e26d383552bb5b3cb6188c9b12206abb12))
* fetch balance for custom tokens ([1676730](https://github.com/rango-exchange/rango-client/commit/1676730960ef56374ad632a95011b8da0a102792))
* implement search functionality for custom tokens ([d479cc6](https://github.com/rango-exchange/rango-client/commit/d479cc64ab122a65f87a8ee46e8c27dabe7a71c1))



## [0.40.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.40.0...widget-embedded@0.40.1) (2025-02-25)


### Bug Fixes

* fix incorrect input amount on max button click ([715a526](https://github.com/rango-exchange/rango-client/commit/715a526d8137f3ce92683639d5b67180452a0404))



# [0.40.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.39.0...widget-embedded@0.40.0) (2025-02-23)


### Bug Fixes

* add unsupported tokens to wallets details ([3db5538](https://github.com/rango-exchange/rango-client/commit/3db55383cb0ffa21b186489d4d20583065266d02))
* adding balances to ConnectedWallet for WidgetInfo ([e071111](https://github.com/rango-exchange/rango-client/commit/e0711113faff56d87f61af9da869d214eb74b2ff))
* change balance key separator ([1f3da97](https://github.com/rango-exchange/rango-client/commit/1f3da972a7da2cebe2b9876c058980ba9d32ad65))
* clean up old balances when switching account ([78d559f](https://github.com/rango-exchange/rango-client/commit/78d559f0ef52bc6a6a80f824b075157eb7274bc1))
* close wallet connection modal after connect with namespace ([29dff44](https://github.com/rango-exchange/rango-client/commit/29dff448650f83deda8892e3f3ba62dd1f3df555))
* fix balance not updating properly after transaction ([e607dfc](https://github.com/rango-exchange/rango-client/commit/e607dfc706e79f5d68fc140ff9a4f5f8e6fc91fe))
* fix hub problems with wallets config ([822f209](https://github.com/rango-exchange/rango-client/commit/822f209d5e013ef4cc05f23c9b5f33acba336fcc))
* fix total balance calculation for WidgetInfo ([a1a474a](https://github.com/rango-exchange/rango-client/commit/a1a474aab2a37b9cd7001cc5419788d297a96deb))
* handle token not found error for custom tokens ([b33059e](https://github.com/rango-exchange/rango-client/commit/b33059e911de7ebf86b629e0adc68ba656a7a3a1))
* improve handling of disabled swappers in widget ([d1b42e9](https://github.com/rango-exchange/rango-client/commit/d1b42e999b4d4bf606886481be884866d594fa4b))
* make hub compatible with external wallets ([316f18c](https://github.com/rango-exchange/rango-client/commit/316f18c4b270b5e94b7e475d6bf7922cdcc9c712))
* remove connected wallet on namespace disconnect ([4f0be8a](https://github.com/rango-exchange/rango-client/commit/4f0be8a1eab99af9e6077b7c8c45fdfc6d40f4e9))
* switch only selected accounts to loading state and handle failure on fetch balance ([ff8429d](https://github.com/rango-exchange/rango-client/commit/ff8429d9311e25b877886c4d826e6a817e393f9c))
* update balance after transaction with max amount ([9915cba](https://github.com/rango-exchange/rango-client/commit/9915cbaf1b27ded6265ba638f62ad42b07448968))
* update balance only if account is still connected ([b65e3b2](https://github.com/rango-exchange/rango-client/commit/b65e3b242f00a42858385ebefd3cd515a9556ea3))
* update explorer url on connected wallets ([ebb5e08](https://github.com/rango-exchange/rango-client/commit/ebb5e0836c8221a6cf70eb9cb7b639bb7c70817e))
* updated profile banner format from png to jpg ([3100a66](https://github.com/rango-exchange/rango-client/commit/3100a66ea31a26919c738e10ff5dd9db203d371d))
* usdValue shouldn't be formatted to calculate the total value ([0e2d987](https://github.com/rango-exchange/rango-client/commit/0e2d987c4fff601e421989f9a8afd6330125e5a6))


### Features

* add an adapter for Hub for wallets-react and enabling Hub by default. ([a14bdf9](https://github.com/rango-exchange/rango-client/commit/a14bdf9619e448bc4568d6b758ca86d2359e1740))
* add fee details modal in widget full-expanded mode ([9e9b2a9](https://github.com/rango-exchange/rango-client/commit/9e9b2a9d4737176675129aaac0ffea6cdc07be35))
* add link to profile banner ([b752c6f](https://github.com/rango-exchange/rango-client/commit/b752c6f2bf19eead23121503494a36ea39923206))
* add profile banner to widget success modal ([8abbf51](https://github.com/rango-exchange/rango-client/commit/8abbf51523a2ff57d9d76eb0ed91b599236b88b0))
* add route time warning for slow routes ([9a913f6](https://github.com/rango-exchange/rango-client/commit/9a913f65deffc9877ebeb4dea24071613ed313fe))
* display a warning if the output amount changes on the confirm swap page ([a77422d](https://github.com/rango-exchange/rango-client/commit/a77422dd4707d3a66711dcfe6e7982b6ab31c439))
* introducing store events for hub and fix switching accounts using that ([ba95ba2](https://github.com/rango-exchange/rango-client/commit/ba95ba2584f41e2a4b4b2984a62c737ab74d7cd8))


### Performance Improvements

* improve getConnectedWalletsDetails query by memozing ([7a0dcae](https://github.com/rango-exchange/rango-client/commit/7a0dcae938c74a9fa6d6aaa37c958055e0b704f7))



# [0.39.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.38.0...widget-embedded@0.39.0) (2025-01-27)



# [0.38.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.37.0...widget-embedded@0.38.0) (2025-01-20)


### Features

* add sending solana transaction on multiple nodes ([5b5ee8e](https://github.com/rango-exchange/rango-client/commit/5b5ee8e4bd8e5c732df674bc94b112b5d2b198c0))



# [0.37.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.36.0...widget-embedded@0.37.0) (2024-12-30)



# [0.36.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.35.0...widget-embedded@0.36.0) (2024-11-27)


### Bug Fixes

* fix error display for bad requests ([82c0381](https://github.com/rango-exchange/rango-client/commit/82c03811b64a9197680314ac4f506d8680afec0c))
* improve ton signer and mytonwallet provider ([7027755](https://github.com/rango-exchange/rango-client/commit/7027755740426359f42b088b842dfd01590df5c3))


### Features

* add routing params to widget config ([2a89744](https://github.com/rango-exchange/rango-client/commit/2a8974440d1269d9a12700fc7100f1f78371d277))
* add ton connect provider ([2a2dbb7](https://github.com/rango-exchange/rango-client/commit/2a2dbb79022263f19446ced49d298e04d63f927f))
* display same source and destination token warning on widget ([979cb0d](https://github.com/rango-exchange/rango-client/commit/979cb0d20c0730be9c94c2cd96d66630ea8e86ba))



# [0.35.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.34.5...widget-embedded@0.35.0) (2024-11-12)


### Features

* add more languages to widget ([bc37fe9](https://github.com/rango-exchange/rango-client/commit/bc37fe97586545f993d7a2675a43b64aaa743791))



## [0.34.5](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.34.4...widget-embedded@0.34.5) (2024-11-06)



## [0.34.4](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.34.3...widget-embedded@0.34.4) (2024-11-06)



## [0.34.3](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.34.2...widget-embedded@0.34.3) (2024-11-06)



## [0.34.2](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.34.1...widget-embedded@0.34.2) (2024-11-06)



## [0.34.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.34.0...widget-embedded@0.34.1) (2024-10-30)



# [0.34.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.33.3...widget-embedded@0.34.0) (2024-10-12)


### Bug Fixes

* bump sdk and fix type issues ([d442208](https://github.com/rango-exchange/rango-client/commit/d4422083bf5dd27d5f509ce1db7f9560d05428c8))


### Features

* add id property to buttons ([39824e3](https://github.com/rango-exchange/rango-client/commit/39824e3ce8b1804b9944eb0faf71da7cdccf59ea))



## [0.33.3](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.33.2...widget-embedded@0.33.3) (2024-10-05)



## [0.33.2](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.33.1...widget-embedded@0.33.2) (2024-09-25)



## [0.33.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.33.0...widget-embedded@0.33.1) (2024-09-16)



# [0.33.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.32.1...widget-embedded@0.33.0) (2024-09-10)


### Bug Fixes

* add slippage icon to setting page ([2e29351](https://github.com/rango-exchange/rango-client/commit/2e29351d957f4e751a25f66b7cb173e5d9956378))
* clear timeout for success modal to avoid closing upcoming modals unexpectedly ([0d54a60](https://github.com/rango-exchange/rango-client/commit/0d54a6092e6a412b1497b9a3e26af6f669eea181))
* correct translation bugs ([0107f1d](https://github.com/rango-exchange/rango-client/commit/0107f1df7a587d9910c5376c4f99acd23b95e1a4))
* fix wallet state issue after retrying to fetch the balance following a failed attempt ([181bac3](https://github.com/rango-exchange/rango-client/commit/181bac3f54727847f8d16ff47164cce80aa64931))
* if state is on connecting, we should call disconnect in terminateconnectingWallets as well ([ad16056](https://github.com/rango-exchange/rango-client/commit/ad1605631df82e4d692f7e75999b2a5c51216958))
* improve header component to center the title properly ([a9929bb](https://github.com/rango-exchange/rango-client/commit/a9929bb518ccbb2033b646fbcb5c034852b039b2))
* reset derivation path if it's string and switching from custom mode ([c94c71a](https://github.com/rango-exchange/rango-client/commit/c94c71a94f3ac910ca13433ea616ce548559dc58))


### Features

* export a new hook for handling required data for connect called useStateful ([0d00a45](https://github.com/rango-exchange/rango-client/commit/0d00a45b4434e0e2b53228a1d1c0be4fa579e21b))
* export StatefulConnect components and helpers ([c28a94b](https://github.com/rango-exchange/rango-client/commit/c28a94bd2721b4dbd16f9471f1cb0ddc45aa8904))



## [0.32.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.32.0...widget-embedded@0.32.1) (2024-08-17)



# [0.32.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.31.0...widget-embedded@0.32.0) (2024-08-17)


### Features

* add functionality to support custom tokens ([a1aa0af](https://github.com/rango-exchange/rango-client/commit/a1aa0afed98f164488a3caffaaff2fd060ab8b3d))



# [0.31.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.30.1...widget-embedded@0.31.0) (2024-08-11)


### Bug Fixes

* address the issue where the token list does not update when the balance changes ([d1fb4e4](https://github.com/rango-exchange/rango-client/commit/d1fb4e4bb57e97cd730cba4c33ca0b2202600c09))
* fix bug in swap input handling empty value ([3c9b082](https://github.com/rango-exchange/rango-client/commit/3c9b082b7b548ddd3981fff100d4dc880581b98d))
* fix flicker in playground ([6ae2d58](https://github.com/rango-exchange/rango-client/commit/6ae2d588ba36822856a43cea7cabc3618cf72c11))
* fix missing usd value in estimated output ([a46d19a](https://github.com/rango-exchange/rango-client/commit/a46d19a80b4f6fc1ca29e289e1b6441e89aa730c))
* fix sort logic of notifications ([ffcf4c2](https://github.com/rango-exchange/rango-client/commit/ffcf4c2d70da7887e17042f3e6fe46224cd21fe1))
* fix wallet modal closing bug ([146f7e2](https://github.com/rango-exchange/rango-client/commit/146f7e24450be278aee53b03319399934cf84f17))
* recalculate supported tokens even if it's empty list ([8ccda6b](https://github.com/rango-exchange/rango-client/commit/8ccda6b2e246425102e6f6ab5f0d1edd131c6794))


### Features

* add derivation path modal for trezor wallet ([364422f](https://github.com/rango-exchange/rango-client/commit/364422f099b202a27a529591c5e3628bbb35508d))
* add filter and clear to widget history ([d43b603](https://github.com/rango-exchange/rango-client/commit/d43b603462feabf297d5be389fcaa35402d667b5))
* add functionality to update the quote inputs from outside the widget ([d9722fb](https://github.com/rango-exchange/rango-client/commit/d9722fbd5629ecb760b94a3d4a9ad7c0a07687ad))
* add preventable event and a new ui event called CLICK_CONNECT_WALLET ([e4363bb](https://github.com/rango-exchange/rango-client/commit/e4363bb6fb98d49b22c1b608ecf6d37650ff3035))
* add the option to define a default custom destination for each blockchain in the widget config ([7982ab6](https://github.com/rango-exchange/rango-client/commit/7982ab633dcb5b07ee5c313c9414d68baa6cbc38))
* changing the request ID copy process ([490cdfa](https://github.com/rango-exchange/rango-client/commit/490cdfa41131eea20d8a552f8f0714b77d21ac71))
* hide balance and max button when no wallet connected ([80b2754](https://github.com/rango-exchange/rango-client/commit/80b27547376394a3070aea7065d4bb9652f454e4))


### Performance Improvements

* improve token list performance by caching target tokens on load and config change ([3cc55ff](https://github.com/rango-exchange/rango-client/commit/3cc55ff95dde1f87f53efb2496e995beeb943b00))



## [0.30.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.30.0...widget-embedded@0.30.1) (2024-07-14)



# [0.30.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.28.2...widget-embedded@0.30.0) (2024-07-09)


### Bug Fixes

*  fix playground exported config bugs and slider color bug ([9505b63](https://github.com/rango-exchange/rango-client/commit/9505b6330363839aa5acc7abfdb6cd7288f946d6))
* bug in updating input & output amount ([49c902b](https://github.com/rango-exchange/rango-client/commit/49c902be7adc1ba9ae7808f145ec975c724a728f))
* exclud ledger on mobile and fix injected wallet bug ([a6d90aa](https://github.com/rango-exchange/rango-client/commit/a6d90aa01b7b1fcea01ab46d1a74583ff6f98ff8))
* fix bug displaying the same token list for blockchains with the same number of tokens ([f4dc82f](https://github.com/rango-exchange/rango-client/commit/f4dc82f5f319f9133fac7d8a68023596a773cd96))
* fix init config minor bug ([7d671e3](https://github.com/rango-exchange/rango-client/commit/7d671e336050cd4d4cc0589cfd83e341421fe859))
* fix state of custom destination in playground ([ae9cd78](https://github.com/rango-exchange/rango-client/commit/ae9cd783aebc797ffa98e2cd0fb87744ae92caf8))
* fix the automatic selection of the connected wallets in the confirm wallets modal ([0b85d81](https://github.com/rango-exchange/rango-client/commit/0b85d81bc9ce6ec055e832e37eb6289a1b107d39))
* improve generate colors for tokens label and price impact color ([5f2893c](https://github.com/rango-exchange/rango-client/commit/5f2893c03b17af24a8b3886e12b1631b5cc208fb))
* rerfactor numeric tooltip and fix missing translations ([59f1fb9](https://github.com/rango-exchange/rango-client/commit/59f1fb96027a9b51cea5f6362b247b6cf180d809))
* resolve custom slippage bug ([54bef0f](https://github.com/rango-exchange/rango-client/commit/54bef0f6d73d1078ab170e8b049a6aa311fff02d))
* sync notifications with persisted swaps ([2ecaf38](https://github.com/rango-exchange/rango-client/commit/2ecaf38750dacc828ebaee7f8348b502a7645a88))
* update design for not-selected blockchain or token ([8915101](https://github.com/rango-exchange/rango-client/commit/8915101d4e7a7092fbb5f38bbd95789e124f8ae3))


### Features

* add a modal for setting custom derivation path for ledger ([5b74ec0](https://github.com/rango-exchange/rango-client/commit/5b74ec049393ed74e3e7547edc72b68bd70b7dce))
* add an option to wallet connect provider to open a desktop wallet directly ([bee0a1f](https://github.com/rango-exchange/rango-client/commit/bee0a1f57ef5470564f6cdc379d00981e7d34b0a))
* add custom solana rpc url to config ([8d46ebf](https://github.com/rango-exchange/rango-client/commit/8d46ebf4fcd58c7ecd180ea29c071176c0f863e9))
* add more predefined fonts list from google fonts ([693f257](https://github.com/rango-exchange/rango-client/commit/693f25790497f6829dd74c800d3d5574d8ee0bed))
* add support for Trezor hardware wallet ([6edecbb](https://github.com/rango-exchange/rango-client/commit/6edecbb14fd008fc741c892bfa3e025c10160b9b))
* adding 'shadows' to widget config for theme ([2be1f1a](https://github.com/rango-exchange/rango-client/commit/2be1f1aa508fb642a797610471b63219cd3d2ccf))
* display all notifications in the notification popover ([c3eda22](https://github.com/rango-exchange/rango-client/commit/c3eda22cf1f06b928fdf0c98512fd444cc46823c))
* export useWalletList for use in dapp ([e5fb662](https://github.com/rango-exchange/rango-client/commit/e5fb662adc119fb341db2c6c68b3b9e45c0353a2))
* generate theme color tints and shades using the new method of overriding them separately ([a46b8a9](https://github.com/rango-exchange/rango-client/commit/a46b8a93bff1d8d6766c2fd636091983a8ee1baa))
* make update settings optional to make it enable in playground ([c13a902](https://github.com/rango-exchange/rango-client/commit/c13a902fba9a03b111bde6fed02a1f3a081ee590))
* support new widget events ([37a9b6c](https://github.com/rango-exchange/rango-client/commit/37a9b6c023cba660c87af27bcbfceadfb8daa8d0))
* update explorer icon and add paste to custom destination ([61468a0](https://github.com/rango-exchange/rango-client/commit/61468a0e227517b91def21a85a8f7d72b7411862))
* update wallets page to add filter by transaction types (category) ([0aa7c73](https://github.com/rango-exchange/rango-client/commit/0aa7c73333bd32912f7b2e90a660f3f43e64f4f7))


### Performance Improvements

* improve finding tokens from store ([3e890bd](https://github.com/rango-exchange/rango-client/commit/3e890bdcd47971b072f347c368c4370225cb11ff))



# [0.29.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.28.2...widget-embedded@0.29.0) (2024-06-01)


### Bug Fixes

* exclud ledger on mobile and fix injected wallet bug ([a6d90aa](https://github.com/rango-exchange/rango-client/commit/a6d90aa01b7b1fcea01ab46d1a74583ff6f98ff8))
* fix init config minor bug ([7d671e3](https://github.com/rango-exchange/rango-client/commit/7d671e336050cd4d4cc0589cfd83e341421fe859))
* fix the automatic selection of the connected wallets in the confirm wallets modal ([0b85d81](https://github.com/rango-exchange/rango-client/commit/0b85d81bc9ce6ec055e832e37eb6289a1b107d39))
* resolve custom slippage bug ([54bef0f](https://github.com/rango-exchange/rango-client/commit/54bef0f6d73d1078ab170e8b049a6aa311fff02d))
* sync notifications with persisted swaps ([2ecaf38](https://github.com/rango-exchange/rango-client/commit/2ecaf38750dacc828ebaee7f8348b502a7645a88))
* update design for not-selected blockchain or token ([8915101](https://github.com/rango-exchange/rango-client/commit/8915101d4e7a7092fbb5f38bbd95789e124f8ae3))


### Features

* add an option to wallet connect provider to open a desktop wallet directly ([bee0a1f](https://github.com/rango-exchange/rango-client/commit/bee0a1f57ef5470564f6cdc379d00981e7d34b0a))
* add custom solana rpc url to config ([8d46ebf](https://github.com/rango-exchange/rango-client/commit/8d46ebf4fcd58c7ecd180ea29c071176c0f863e9))
* add more predefined fonts list from google fonts ([693f257](https://github.com/rango-exchange/rango-client/commit/693f25790497f6829dd74c800d3d5574d8ee0bed))
* generate theme color tints and shades using the new method of overriding them separately ([a46b8a9](https://github.com/rango-exchange/rango-client/commit/a46b8a93bff1d8d6766c2fd636091983a8ee1baa))
* update explorer icon and add paste to custom destination ([61468a0](https://github.com/rango-exchange/rango-client/commit/61468a0e227517b91def21a85a8f7d72b7411862))
* update wallets page to add filter by transaction types (category) ([0aa7c73](https://github.com/rango-exchange/rango-client/commit/0aa7c73333bd32912f7b2e90a660f3f43e64f4f7))



## [0.28.2](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.28.1...widget-embedded@0.28.2) (2024-05-26)



## [0.28.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.28.0...widget-embedded@0.28.1) (2024-05-25)



# [0.28.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.27.3...widget-embedded@0.28.0) (2024-05-14)


### Bug Fixes

* display the swapper's title instead of the swapper's group as their displayed name ([1142d94](https://github.com/rango-exchange/rango-client/commit/1142d9417e690bf4b0093ee84e42352dab149793))
* fix bugs in fetching quotes ([2b533ea](https://github.com/rango-exchange/rango-client/commit/2b533ead6fa90d2d8b3d9b8de2699072cc57d55b))
* fix multiwallets config initial value check bug ([94dbf07](https://github.com/rango-exchange/rango-client/commit/94dbf074ab51f56bf1267cb668be4e58781554bf))
* fix space between of routes and swap box in expanded mode ([cbca33e](https://github.com/rango-exchange/rango-client/commit/cbca33ef31d634466b6595ee01fa337952076b89))
* fix the entrance animation of the confirm wallets modal ([1907ad2](https://github.com/rango-exchange/rango-client/commit/1907ad25cef2a25c303e2c91194dbae2b8e6fd56))


### Features

* add auto retry for fetching confirm swap ([5945d82](https://github.com/rango-exchange/rango-client/commit/5945d82030b89006f5c62c8f5ce5d492cc2ed220))
* add solana to ledger ([77b6695](https://github.com/rango-exchange/rango-client/commit/77b6695758165f9258a0ba5bd3b2cf39b0b2aab5))
* add test to check workflow ([69a4c3e](https://github.com/rango-exchange/rango-client/commit/69a4c3e144a7e9cd1ce24c3a2f7a3d7a4b4a1eab))
* detect proper error related to wallet connect params ([a0d8d95](https://github.com/rango-exchange/rango-client/commit/a0d8d95ed977fffbd0244f498c81f7ce3550ee71))
* improve all routes button ([efcb61e](https://github.com/rango-exchange/rango-client/commit/efcb61ee5920b1a05c44dfa8edf23dc8d3d7f035))



## [0.27.3](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.27.2...widget-embedded@0.27.3) (2024-05-08)


### Bug Fixes

* disable the confirm wallet button if all required wallets are not selected ([521883f](https://github.com/rango-exchange/rango-client/commit/521883f9e381d311bf0cdad275b234646da2a648))



## [0.27.2](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.27.1...widget-embedded@0.27.2) (2024-04-27)


### Bug Fixes

* make sure to correctly pass validation parameters when setting up a new swap ([4f6d37e](https://github.com/rango-exchange/rango-client/commit/4f6d37ea9b59caca4d0064c1b33b05077b0b59a3))



## [0.27.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.27.0...widget-embedded@0.27.1) (2024-04-24)



# [0.27.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.26.0...widget-embedded@0.27.0) (2024-04-24)



# [0.26.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.25.0...widget-embedded@0.26.0) (2024-04-23)


### Bug Fixes

* address passing wallet-connect project id ([80a6b80](https://github.com/rango-exchange/rango-client/commit/80a6b8046cc93bc8e88b84a201331b2e7adc0c73))
* fix token selector hover ui for token explorer link ([ede0fac](https://github.com/rango-exchange/rango-client/commit/ede0fac0e987b0cd6983ccd427207d78f65eeb96))
* fix token selector infinite loader ([1122dd6](https://github.com/rango-exchange/rango-client/commit/1122dd6db1fecadd41d56f22d5dfd95fbaa645a0))
* remove setting option from confirm swap page ([1f204c1](https://github.com/rango-exchange/rango-client/commit/1f204c1ebf544348a2969aa35c2cf8c9841ea3ff))


### Features

* add animation for switch swap button ([601af2d](https://github.com/rango-exchange/rango-client/commit/601af2dde7ed87c7aa803cb0b79a13c21ff0386d))
* add unit test for app store ([9df49a8](https://github.com/rango-exchange/rango-client/commit/9df49a8aaf0d03fea01d9e9790953c7326e8999d))



# [0.25.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.24.1...widget-embedded@0.25.0) (2024-04-09)


### Bug Fixes

* address tooltips position ([5ee60d1](https://github.com/rango-exchange/rango-client/commit/5ee60d1622dab29091d97578d417a2187f2ca6cf))
* correct showing wallets on mobile screens ([89ead7f](https://github.com/rango-exchange/rango-client/commit/89ead7f68e88352dfd69c2a3d1c6cb0b8cf2e5d5))
* fix export refresh modal ([0c0ec6c](https://github.com/rango-exchange/rango-client/commit/0c0ec6c7f22116a9b5d5c8d2b6a74ebf421fc015))
* fix widget event hook ([c8547b6](https://github.com/rango-exchange/rango-client/commit/c8547b6a31354afe13aa32c0b72be5b62b3f0d67))


### Features

* attach config object to window for debugging purposes ([70597b7](https://github.com/rango-exchange/rango-client/commit/70597b78e31ef2da1ef2d20ed398e5bdf0b59a63))
* implement hover state for full-expanded-route ([1c851d7](https://github.com/rango-exchange/rango-client/commit/1c851d7c62b71fe8f4aa6c05edbc0d6cc78d5437))
* show a modal with page reload when meta hasn't loaded ([0d3842f](https://github.com/rango-exchange/rango-client/commit/0d3842f9c2d7210cfd5a967d1f0e663ef3125421))



## [0.24.1](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.24.0...widget-embedded@0.24.1) (2024-03-12)



# [0.24.0](https://github.com/rango-exchange/rango-client/compare/widget-embedded@0.23.0...widget-embedded@0.24.0) (2024-03-12)


### Bug Fixes

* add a default variant to widget config store ([5f7c18e](https://github.com/rango-exchange/rango-client/commit/5f7c18e54d88ca44eb86de6fff6c252599d3adb9))
* apply minor improvements to the widget ([c4454e5](https://github.com/rango-exchange/rango-client/commit/c4454e5c3dd1257b48d18a975cb3d1ac19ce3f26))
* close completeModal when requestId is changed ([f00bee8](https://github.com/rango-exchange/rango-client/commit/f00bee8f9852f66157517c9a4d0bebf38b9a961d))
* correct default values of hidden features ([10ac5cf](https://github.com/rango-exchange/rango-client/commit/10ac5cf6db419567cc439db785615b00565461d7))
* correct height of widget & address full-expanded hover & spacing ([6390316](https://github.com/rango-exchange/rango-client/commit/639031622644ee99d3e708f1a783c16e7268fa20))
* correct set-as-read behavior in swap-details ([b0b5310](https://github.com/rango-exchange/rango-client/commit/b0b53103aef10083c2887f61bf68356eb26698e6))
* correct sharp styles in swap inputs in different variants ([8fd3232](https://github.com/rango-exchange/rango-client/commit/8fd3232f9353537da2dfdefd201d7f15b17b2434))
* default theme shouldn't be override on what user has set ([6e64239](https://github.com/rango-exchange/rango-client/commit/6e64239873bd673279bd163f5b54e49744b8abc2))
* fix bugs in displaying quote error modals ([c72a21e](https://github.com/rango-exchange/rango-client/commit/c72a21e233e48b20a9af0cf44d334fb752b1988b))
* fix console warning in widget ([d2353f2](https://github.com/rango-exchange/rango-client/commit/d2353f21945d38cfef4051d80b9577b7ab4da620))
* fix default injected wallet display logic and catch unhandled errors ([6654fcc](https://github.com/rango-exchange/rango-client/commit/6654fcc73481ac8e572da92be4346e059613febe))
* fix full expanded design issues ([d1aaaa3](https://github.com/rango-exchange/rango-client/commit/d1aaaa30404da6ef8c1ff264a52e718db74f438f))
* fix queue manager context in widget embedded ([312fe8c](https://github.com/rango-exchange/rango-client/commit/312fe8cfef6b5adb245c81f303694142cb99641b))
* fix unmounting router on changing language ([80e96dd](https://github.com/rango-exchange/rango-client/commit/80e96ddabd863a65f5e94d6631aecd23f9d12126))
* fix widget icon size issue and add connected wallet tooltip ([476267f](https://github.com/rango-exchange/rango-client/commit/476267feea9e176829a6df4bf0dbe6eef5ad4366))
* get theme from config when singleTheme is true ([8fa3caa](https://github.com/rango-exchange/rango-client/commit/8fa3caa2cf2965923c6427187283ecf53737c792))
* improve search token ([2f7bacc](https://github.com/rango-exchange/rango-client/commit/2f7bacc5358d4fc6da21c0883e46d49293f98a33))
* remove redundant punctuation from settings page ([51f3825](https://github.com/rango-exchange/rango-client/commit/51f3825fb4a1073de5baef7b9fa988990e2a7d36))


### Features

* add an expand mode for our compact widget ([eb90daa](https://github.com/rango-exchange/rango-client/commit/eb90daa540592c81efdca6e33032f6dbef371180))
* add enabling centralized swappers to config ([55f6f7d](https://github.com/rango-exchange/rango-client/commit/55f6f7d746aeab4dc65421c641c920c8687712d3))
* add full expanded variant to widget ([a3907a0](https://github.com/rango-exchange/rango-client/commit/a3907a0be9f0716c366a2c482253191eebd66301))
* add more languages to widget ([04f7855](https://github.com/rango-exchange/rango-client/commit/04f78551784b52e286f7f6206337d97bf8401063))
* add sort filter for multi routing (compact mode) ([d90ddc6](https://github.com/rango-exchange/rango-client/commit/d90ddc6959c63a1ec2ef5908c09fc6ab8c3da23c))
* implement expanded-mode route ([e75fcad](https://github.com/rango-exchange/rango-client/commit/e75fcad751dfdce0c4d84d08f2c9b41935584a75))
* improve header buttons and notifications ([5f2188d](https://github.com/rango-exchange/rango-client/commit/5f2188d5cae62576bf13a5cefdc83625b9910c11))
* improve playground mobile view and widget variants and liquidity sources ([3c2a4a6](https://github.com/rango-exchange/rango-client/commit/3c2a4a6375818d01a4c6682e03a60aa6972a8a02))
* redesign switching theme in settings ([7fe0bc5](https://github.com/rango-exchange/rango-client/commit/7fe0bc510a56b717bed1bb20d7889d549c7144a1))
* update active tab warning position ([9420667](https://github.com/rango-exchange/rango-client/commit/9420667d36ac508245fdf05901c1cb3074a3508b))
* update colours for quote variant for rango/default theme ([897683f](https://github.com/rango-exchange/rango-client/commit/897683f5aa550af9a74e011e4ab3d734d7c595f7))



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



