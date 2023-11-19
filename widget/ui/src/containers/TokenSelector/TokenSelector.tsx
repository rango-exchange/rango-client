import type { TokenWithAmount } from '../../components/TokenList/TokenList';
import type { LoadingStatus } from '../../types/meta';

import React from 'react';

import { LoadingFailedAlert, SecondaryPage, Spinner } from '../../components';
import { NotFoundAlert } from '../../components/Alert/NotFoundAlert';
import { TokenList } from '../../components/TokenList/TokenList';
import { styled } from '../../theme';
import { containsText } from '../../utils';

export const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  paddingTop: '33%',
  flex: 1,
});
export interface PropTypes {
  list: TokenWithAmount[];
  type?: 'Source' | 'Destination';
  selected: TokenWithAmount | null;
  onChange: (token: TokenWithAmount) => void;
  onBack?: () => void;
  loadingStatus: LoadingStatus;
  hasHeader?: boolean;
}

const filterTokens = (list: TokenWithAmount[], searchedFor: string) =>
  list.filter(
    (token) =>
      containsText(token.symbol, searchedFor) ||
      containsText(token.address || '', searchedFor) ||
      containsText(token.name || '', searchedFor)
  );

export function TokenSelector(props: PropTypes) {
  const { list, type, selected, hasHeader, onChange, onBack, loadingStatus } =
    props;

  return (
    <SecondaryPage
      textField={true}
      hasHeader={hasHeader}
      title={`Select ${type} token`}
      onBack={onBack}
      textFieldPlaceholder="Search tokens by name">
      {(searchedFor) => {
        const filteredTokens = filterTokens(list, searchedFor);

        return loadingStatus === 'loading' ? (
          <LoaderContainer>
            <Spinner size={24} />
          </LoaderContainer>
        ) : loadingStatus === 'failed' ? (
          <LoadingFailedAlert />
        ) : filteredTokens.length ? (
          <TokenList
            searchedText={searchedFor}
            list={filteredTokens}
            selected={selected}
            onChange={onChange}
          />
        ) : (
          <NotFoundAlert catergory="Token" searchedFor={searchedFor} />
        );
      }}
    </SecondaryPage>
  );
}
