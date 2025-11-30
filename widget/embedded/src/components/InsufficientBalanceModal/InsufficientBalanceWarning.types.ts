export type Warning = {
  assetSymbol: string;
  title: string;
  requiredBalance: string;
  userBalance: string;
};

export type PropTypes = {
  warning: Warning;
};
