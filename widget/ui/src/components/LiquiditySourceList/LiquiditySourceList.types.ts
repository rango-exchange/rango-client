import type { LoadingStatus } from '../../types/meta';
import type { CSSProperties } from '@stitches/react';

export interface LiquiditySource {
  title: string;
  logo: string;
  type: 'BRIDGE' | 'AGGREGATOR' | 'DEX';
  selected: boolean;
}

export interface PropTypes {
  list: LiquiditySource[];
  onChange: (liquiditySource: LiquiditySource) => void;
  listContainerStyle?: CSSProperties;
  loadingStatus: LoadingStatus;
  searchedFor: string;
  catergory: 'Exchange' | 'Bridge';
}
