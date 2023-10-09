import type BigNumber from 'bignumber.js';

export interface PropTypes {
  openModal: boolean;
  onToggle: (open: boolean) => void;
  totalFeeInUsd: BigNumber | null;
  outputUsdValue: BigNumber | null;
  inputUsdValue: BigNumber | null;
  percentageChange: BigNumber | null;
  highValueLoss: boolean;
  priceImpactCanNotBeComputed: boolean;
  loading: boolean;
  extraSpace: boolean;
}

type ModalPropTypesKeys = keyof Omit<
  PropTypes,
  'priceImpactCanNotBeComputed' | 'openModal' | 'extraSpace' | 'loading'
>;

export type ModalPropTypes = Pick<PropTypes, ModalPropTypesKeys> & {
  open: boolean;
};

export interface ModalContentData {
  title: string;
  value: string;
  valueColor?: string;
}
