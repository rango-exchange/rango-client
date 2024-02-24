import type { FetchStatus } from '../../store/slices/data';

export type PropTypes = {
  fetchingQuote: boolean;
  fetchMetaStatus: FetchStatus;
  onClickToken: (mode: 'from' | 'to') => void;
};
