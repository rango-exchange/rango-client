export enum SearchParams {
  FROM_BLOCKCHAIN = 'fromBlockchain',
  FROM_TOKEN = 'fromToken',
  TO_BLOCKCHAIN = 'toBlockchain',
  TO_TOKEN = 'toToken',
  FROM_AMOUNT = 'fromAmount',
  AUTO_CONNECT = 'autoConnect',

  // This is for custom tokens
  BLOCKCHAIN = 'blockchain',
  /*
   * dApps can transmit liquidity sources as a search parameter,
   * and these take precedence over widget configurations
   */
  LIQUIDITY_SOURCES = 'liquiditySources',
  // iframe environments
  CLIENT_URL = 'clientUrl',
}
