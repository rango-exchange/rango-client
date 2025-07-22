import type { Language, theme } from '@arlert-dev/ui';
import type { LegacyProviderInterface } from '@arlert-dev/wallets-core/dist/legacy/mod';
import type { WalletType } from '@arlert-dev/wallets-shared';
import type { Asset } from 'rango-sdk';
import type { ReactElement } from 'react';

export type WidgetVariant = 'default' | 'expanded' | 'full-expanded';

/**
 * The above type defines a set of optional color properties for a widget.
 * @property {string} background
 * @property {string} foreground
 * @property {string} primary
 * @property {string} secondary
 *
 */
export type WidgetColorsKeys = keyof WidgetColors;

export type ThemeColors = {
  [key in string]?: string;
};

export interface WidgetColors extends ThemeColors {
  background?: string;
  foreground?: string;
  neutral?: string;
  primary?: string;
  secondary?: string;
}

/**
 * The `WidgetTheme` defines the properties of a widget theme, including mode, font family, colors, border
 * radius, width, and height.
 * @property {'auto' | 'light' | 'dark'} mode - The mode property is used to specify the default theme for
 * the widget.
 * @property {string} fontFamily - The font family to be used in the widget. If you want to do this, include the font of your choice in your HTML file.
 * @property {{ light?: WidgetColors; dark?: WidgetColors }} colors - The `colors` property is a sub-property of the `WidgetTheme` object that
 * defines the color scheme for the widget. It is of type `Colors`, which is likely another object that
 * contains specific color values for various parts of the widget (e.g. background color, text color,
 * border color
 * @property {number} borderRadius - `borderRadius` is a property of the `WidgetTheme` type that
 * specifies the radius of the corners of a widget.
 * @property {number} secondaryBorderRadius - `secondaryBorderRadius` is a property of the `WidgetTheme` type that
 * specifies the radius of the buttons of a widget.
 * @property {number} width - The `width` property is a number that represents the width of the widget.
 * @property {number} height - The `height` property is a number that specifies the height of the widget.
 * @property {boolean} singleTheme - The `singleTheme` property is a boolean that specifies the theme is support dark and light or only light.
 */
export type WidgetTheme = {
  mode?: 'auto' | 'light' | 'dark';
  fontFamily?: string;
  colors?: { light?: WidgetColors; dark?: WidgetColors };
  shadows?: typeof theme.shadows;
  borderRadius?: number;
  secondaryBorderRadius?: number;
  width?: number;
  height?: number;
  singleTheme?: boolean;
};

/**
 * If you want to charge users fee per transaction, you should
 * pass `WidgetAffiliate` including affiliateRef, affiliatePercent, and affiliateWallets.
 * @property {string | null} ref - To enable dApps to charge affiliate fees and generate income from
 * users' transactions, the affiliate referral code should be provided. You can create this code by
 * visiting the following link: https://app.rango.exchange/affiliate.
 * @property {number | null} percent - If you want to change the default affiliate fee percentage,
 * you can provide a new value here.
 * @property {{ [key: string]: string }} wallets - If you want to change the default affiliate wallet
 *  addresses, you can provide new values here. (Map of route blockchains to affiliate address)
 */
export type WidgetAffiliate = {
  ref?: string;
  percent?: number;
  wallets?: { [key: string]: string };
};

/**
 * `Tokens`
 *
 * @property {boolean} isExcluded - This is a boolean property capable of removing tokens from all or a blockchain.
 * @property {Asset[]} tokens - The `tokens` property is an array of `Asset` objects that
 * you could use that to limit tokens to some limited ones.
 */

export type Tokens = {
  isExcluded: boolean;
  tokens: Asset[];
};

/**
 * `BlockchainAndTokenConfig`
 *
 * @property {string} blockchain - This property is optional and represents the default selected blockchain.
 * @property {Asset} token - The `token` property is a type of `Asset` and represents the default token
 * which is selected. e.g. {blockchain: 'BSC', symbol: 'BNB', address: null}
 * @property {string[]} blockchains - An optional array of strings representing the supported
 * blockchains. e.g. ['BSC','ETHEREUM']
 * @property {Asset[] |{ [blockchain: string]: Tokens }} tokens - The `tokens` property is an optional object of `blockchain` objects or array of `Asset` objects
 * that you could use that to limit tokens to some limited ones.
 * @property {Asset} pinnedTokens - The `pinnedTokens` property is an optional array of `Asset` objects that
 * you could use to pin tokens of your choice to the top of the token list.
 */
export type BlockchainAndTokenConfig = {
  blockchain?: string;
  token?: Asset;
  blockchains?: string[];
  pinnedTokens?: Asset[];
  tokens?: Asset[] | { [blockchain: string]: Tokens };
};

/**
 * `SignersConfig`
 *
 * @property {string | string[]} customSolanaRPC - This is an optional property that can be used to set custom Solana RPCs.
 */
export type SignersConfig = {
  customSolanaRPC?: string | string[];
};

/**
 * `Features`
 *
 * @property {'visible' | 'hidden'} [theme]
 * - The visibility state for the theme feature. Optional property.
 *
 * @property {'visible' | 'hidden'} [language]
 * - The visibility state for the language feature. Optional property.
 *
 * @property {'visible' | 'hidden'} [connectWalletButton]
 * - The visibility state for the connect wallet button feature. Optional property.
 *
 * @property {'visible' | 'hidden'} [notification]
 * - The visibility state for the notification feature. Optional property.
 *
 * @property {'visible' | 'hidden'} [liquiditySource]
 * - The visibility state for the liquiditySource feature. Optional property.
 */
export type Features = Partial<
  Record<
    | 'theme'
    | 'language'
    | 'connectWalletButton'
    | 'notification'
    | 'liquiditySource'
    | 'customTokens',
    'visible' | 'hidden'
  >
>;

/**
 * `Routing`
 *
 * @property {'disabled' | 'enabled'} [avoidNativeFee]
 * - If you want to exclude swappers that have native tokens as fee, for example when you are using an AA account, you could set this parameter.
 *
 * @property {number} [maxLength]
 * - If you want to limit the maximum acceptable length of a route, you could set this parameter.
 *
 * @property {'disabled' | 'enabled'} [experimental]
 * - Use this parameter to enable experimental routes. This settings shouldn't be used in your production environment.
 *
 * @property {'disabled' | 'enabled'} [enableCentralizedSwappers]
 * - If you want to enable routing from the centralized protocols like XO Swap, you could set this parameter.
 */
export type Routing = Partial<
  Record<
    'experimental' | 'avoidNativeFee' | 'enableCentralizedSwappers',
    'disabled' | 'enabled'
  >
> &
  Partial<Record<'maxLength', number>>;

export type TrezorManifest = {
  appUrl: string;
  email: string;
};

/**
 *
 * @property {string} manifestUrl - The URL of the TON Connect [manifest]{@link https://github.com/ton-connect/docs/blob/main/requests-responses.md#app-manifest}, containing the Dapp metadata to be displayed in the user’s wallet.
 *
 */
export type TonConnectConfig = {
  manifestUrl?: string;
};

/**
 * The type WidgetConfig defines the configuration options for a widget, including API key, affiliate
 * reference, amount, blockchain and token configurations, liquidity sources, wallet types, language,
 * and theme.
 *
 * @property {string} apiKey - The API key used to communicate with Rango API
 * @property {string} apiUrl - The API url used to set custom API url
 * @property {WidgetAffiliate} affiliate - If you want to charge users fee per transaction, you should
 * pass `WidgetAffiliate` including affiliateRef, affiliatePercent, and affiliateWallets.
 * @property {number} amount - The default input amount.
 * @property {BlockchainAndTokenConfig} from - The `from` property is an optional property of type
 * `BlockchainAndTokenConfig` that specifies the default blockchain and token from which the user wants to
 * exchange.It can also used to limit source swap blockchains/tokens to some limited ones.
 * @property {TrezorManifest} trezorManifest - Trezor Connect Manifest requires that you,
 * as a Trezor Connect integrator,share your e-mail and application url.
 * @property {TonConnectConfig} tonConnect - Configuration for the TON Connect provider.
 * @property {BlockchainAndTokenConfig} to - The "to" property is an optional property of type
 * "BlockchainAndTokenConfig" that specifies the default blockchain and token to which the user wants to
 * exchange.It can also used to limit destination swap blockchains/tokens to some limited ones.
 * blockchain during the transaction.
 * @property {string[]} liquiditySources - The `liquiditySources` property is an optional array of
 * strings that specifies the liquidity sources allowed dexes and bridges for the routing
 * @property {WalletType[]} wallets - The `wallets` property is an optional array of `WalletType`
 * values that represent the types of wallets that the widget should support. For example, it could
 * include values like `"metamask"`, `"kepler"`, or `"phantom"`.
 * @property {boolean} multiWallets - The `multiWallets` property is a boolean value that indicates
 * whether the widget should allow the user to select multiple wallets for the transaction.
 * @property {boolean} customDestination - A boolean value indicating whether the user can input a custom
 * address for the transaction. If set to true, the widget will allow the user to input a custom
 * address for the destination.
 * @property {{[blockchain: string]: string }} defaultCustomDestinations - The `defaultCustomDestinations` property is a map of supported `blockchain` names to an arbitrary blockchain address.
 * You could use it to set a default custom destination for some blockchains.  e.g. {'BSC': '0x2be.....c1','ETH': '0x2be.....c1'}
 * @property {string} language - The language property is an optional string that specifies the
 * default language in which the widget should be displayed. If not provided, the widget will default to the
 * language of the user's browser.
 * @property {WidgetTheme} theme - The `theme` property is a part of the `WidgetConfig` type and is
 * used to specify the visual theme of the widget. It is of type `WidgetTheme`, which is an interface
 * that defines the various properties of the theme, such as colors, fonts, and others.
 * @property {boolean} externalWallets
 * If `externalWallets` is `true`, you should add `WidgetWallets` to your app.
 * @property {boolean} excludeLiquiditySources - The `excludeLiquiditySources` property is a boolean value that when you
 * set it to true, the list of liquidity sources provided in `liquiditySources` will be excluded; otherwise, they will be included.
 * @property {Features} features - An optional object for configuring the visibility of various features.
 *   Keys include:
 *   - 'notification': Visibility state for the notification icon.
 *   - 'theme': Visibility state for the theme.
 *   - 'liquiditySource': Visibility state for liquidity source.
 *   - 'connectWalletButton': Visibility state for the wallet connect icon.
 *   - 'language': Visibility state for the language.
 *   - 'customTokens': Visibility state for the custom tokens.
 * @property {Routing} routing - An optional object for configuring the enablement or numeric of various features.
 *   Keys include:
 *   - 'maxLength': If you want to limit the maximum acceptable length of a route, you could set this parameter.
 *   - 'avoidNativeFee': If you want to exclude swappers that have native tokens as fee, for example when you are using an AA account, you could set this parameter.
 *   - 'experimental': Use this parameter to enable experimental routes. This settings shouldn't be used in your production environment.
 *   - 'enableCentralizedSwappers': If you want to enable routing from the centralized protocols like XO Swap, you could set this parameter.
 * @property {WidgetVariant} variant
 *   If it is expanded, multiple routes will show up on the home page;
 *   If it is full-expanded, multiple routes will show up on the home page with full routes;
 *   if not, you will need to go to a different page to see the suggested routes.
 */

export type WidgetConfig = {
  apiKey: string;
  apiUrl?: string;
  title?: string;
  walletConnectProjectId?: string;
  trezorManifest?: TrezorManifest;
  tonConnect?: TonConnectConfig;
  affiliate?: WidgetAffiliate;
  amount?: number;
  from?: BlockchainAndTokenConfig;
  to?: BlockchainAndTokenConfig;
  liquiditySources?: string[];
  wallets?: (WalletType | LegacyProviderInterface)[];
  multiWallets?: boolean;
  customDestination?: boolean;
  defaultCustomDestinations?: { [blockchain: string]: string };
  language?: Language;
  theme?: WidgetTheme;
  externalWallets?: boolean;
  excludeLiquiditySources?: boolean;
  features?: Features;
  variant?: WidgetVariant;
  signers?: SignersConfig;
  // These are likely to change or remove at anytime. Please use with a caution.
  __UNSTABLE_OR_INTERNAL__?: {
    walletConnectListedDesktopWalletLink?: string;
    autoUpdateSettings?: boolean; // If true, settings will be updated automatically based on the configuration.
    swapBoxBanner?: {
      element: ReactElement;
      routes?: string[];
    };
  };
  routing?: Routing;
};
