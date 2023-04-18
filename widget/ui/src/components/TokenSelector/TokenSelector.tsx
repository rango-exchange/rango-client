import React from 'react';
import { containsText } from '../../helper';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';
import { TokenList } from '../TokenList';
import { TokenWithAmount } from '../TokenList/TokenList';
import { LoadingStatus } from '../../types/meta';
import { Spinner } from '../Spinner';
import { LoadingFailedAlert } from '../Alert/LoadingFailedAlert';
import { NotFoundAlert } from '../Alert/NotFoundAlert';
import { styled } from '../../theme';
import { Asset } from 'rango-sdk';

const Container = styled('div', {
  flex: '1',
});

export const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  position: 'absolute',
  top: '50%',
});
export interface PropTypes {
  list: TokenWithAmount[];
  type?: 'Source' | 'Destination';
  selected: TokenWithAmount | null;
  onChange: (token: TokenWithAmount) => void;
  hasHeader?: boolean;
  multiSelect?: boolean;
  onBack?: () => void;
  loadingStatus: LoadingStatus;
  selectedList?: Asset[];
}

const filterTokens = (list: TokenWithAmount[], searchedFor: string) =>
  list.filter(
    (token) =>
      containsText(token.symbol, searchedFor) ||
      containsText(token.address || '', searchedFor) ||
      containsText(token.name || '', searchedFor)
  );

export function TokenSelector(props: PropTypes) {
  const {
    list,
    type,
    selected,
    onChange,
    hasHeader,
    multiSelect,
    selectedList,
    onBack,
    loadingStatus,
  } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Token`}
      hasHeader={hasHeader}
      onBack={onBack}
    >
      {(searchedFor) => {
        const filteredTokens = filterTokens(list, searchedFor);
        return (
          <Container>
            {loadingStatus === 'loading' && (
              <LoaderContainer>
                <Spinner size={24} />
              </LoaderContainer>
            )}
            {loadingStatus === 'failed' && <LoadingFailedAlert />}
            {loadingStatus === 'success' && (
              <>
                {filteredTokens.length ? (
                  <TokenList
                    searchedText={searchedFor}
                    list={filteredTokens}
                    selected={selected}
                    selectedList={selectedList}
                    multiSelect={multiSelect}
                    onChange={onChange}
                  />
                ) : (
                  <NotFoundAlert catergory="Token" searchedFor={searchedFor} />
                )}
              </>
            )}
          </Container>
        );
      }}
    </SecondaryPage>
  );
}
