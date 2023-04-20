import { Asset } from 'rango-sdk';
import { WalletType } from '@rango-dev/wallets-shared';

/**
 * The above type defines a set of optional color properties for a widget.
 * @property {string} background
 * @property {string} foreground
 * @property {string} primary
 * @property {string} success
 * @property {string} error
 * @property {string} warning
 */
export type WidgetColors = {
  background?: string;
  foreground?: string;
  primary?: string;
  success?: string;
  error?: string;
  warning?: string;
};

/**
 * The `WidgetTheme` defines the properties of a widget theme, including mode, font family, colors, border
 * radius, width, and height.
 * @property {'auto' | 'light' | 'dark'} mode - The mode property is used to specify the default theme for
 * the widget.
 * @property {string} fontFamily - The font family to be used in the widget.
 * @property {Colors} colors - The `colors` property is a sub-property of the `WidgetTheme` object that
 * defines the color scheme for the widget. It is of type `Colors`, which is likely another object that
 * contains specific color values for various parts of the widget (e.g. background color, text color,
 * border color
 * @property {number} borderRadius - `borderRadius` is a property of the `WidgetTheme` type that
 * specifies the radius of the corners of a widget.
 * @property {number} width - The `width` property is a number that represents the width of the widget.
 * @property {number} height - The `height` property is a number that specifies the height of the widget.
 */
export type WidgetTheme = {
  mode?: 'auto' | 'light' | 'dark';
  fontFamily?: string;
  colors?: WidgetColors;
  borderRadius?: number;
  width?: number;
  height?: number;
};

/**
 * `BlockchainAndTokenConfig`
 *
 * @property {string} blockchain - This property is optional and represents the default selected blockchain.
 * @property {Asset} token - The `token` property is a type of `Asset` and represents the default token
 * which is selected. e.g. {blockchain: 'BSC', symbol: 'BNB', address: null}
 * @property {string[]} blockchains - An optional array of strings representing the supported
 * blockchains. e.g. ['BSC','ETHEREUM']
 * @property {Asset[]} tokens - The `tokens` property is an optional array of `Asset` objects that
 * you could use that to limit tokens to some limited ones.
 */
export type BlockchainAndTokenConfig = {
  blockchain?: string;
  token?: Asset;
  blockchains?: string[];
  tokens?: Asset[];
};

/**
 * The type WidgetConfig defines the configuration options for a widget, including API key, affiliate
 * reference, amount, blockchain and token configurations, liquidity sources, wallet types, language,
 * and theme.
 *
 * @property {string} apiKey - The API key used to communicate with Rango API
 * @property {string} affiliateRef - The affiliate reference is an optional string property in the
 * WidgetConfig type. It is used to set and track referrals or affiliations for the dApps.
 * @property {number} amount - The default input amount.
 * @property {BlockchainAndTokenConfig} from - The `from` property is an optional property of type
 * `BlockchainAndTokenConfig` that specifies the default blockchain and token from which the user wants to
 * exchange.It can also used to limit source swap blockchains/tokens to some limited ones.
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
 * @property {boolean} customAddress - A boolean value indicating whether the user can input a custom
 * address for the transaction. If set to true, the widget will allow the user to input a custom
 * address for the destination.
 * @property {string} language - The language property is an optional string that specifies the
 * default language in which the widget should be displayed. If not provided, the widget will default to the
 * language of the user's browser.
 * @property {WidgetTheme} theme - The `theme` property is a part of the `WidgetConfig` type and is
 * used to specify the visual theme of the widget. It is of type `WidgetTheme`, which is an interface
 * that defines the various properties of the theme, such as colors, fonts, and others.
 */
export type WidgetConfig = {
  apiKey: string;
  affiliateRef?: string;
  amount?: number;
  from?: BlockchainAndTokenConfig;
  to?: BlockchainAndTokenConfig;
  liquiditySources?: string[];
  wallets?: WalletType[];
  multiWallets?: boolean;
  customAddress?: boolean;
  language?: string;
  theme?: WidgetTheme;
};
