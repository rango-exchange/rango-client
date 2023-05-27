import React from 'react';
import { ProviderMeta } from 'rango-types';
import { BlockchainsList } from '../../components/BlockchainsList';
import { SecondaryPage } from '../../components/SecondaryPage/SecondaryPage';
import { Spinner } from '../../components/Spinner';
import { styled } from '../../theme';
import { CSSProperties } from '@stitches/react';
import { containsText } from '../../helper';
import { LoadingStatus } from '../../types/meta';
import { LoadingFailedAlert } from '../../components/Alert/LoadingFailedAlert';
import { NotFoundAlert } from '../../components/Alert/NotFoundAlert';
import { LoaderContainer } from '../TokenSelector/TokenSelector';

const ListContainer = styled('div', {
  overflowY: 'auto',
  padding: '0 $4',
});

const filterBlockchains = (list: ProviderMeta[], searchedFor: string) =>
  list.filter(
    (blockchain) =>
      containsText(blockchain.name, searchedFor) ||
      containsText(blockchain.displayName as string, searchedFor),
  );

export interface PropTypes {
  type?: 'Source' | 'Destination';
  list: ProviderMeta[];
  selected?: ProviderMeta | null;
  onChange: (blockchain: ProviderMeta) => void;
  onBack?: () => void;
  loadingStatus: LoadingStatus;
  hasHeader?: boolean;
  listContainerStyle?: CSSProperties;
  multiSelect?: boolean;
  selectedList?: ProviderMeta[] | 'all';
}

export function BlockchainSelector(props: PropTypes) {
  const {
    type,
    list,
    onChange,
    selected,
    onBack,
    loadingStatus,
    hasHeader,
    listContainerStyle,
    multiSelect,
    selectedList,
  } = props;

  return (
    <SecondaryPage
      textField={true}
      hasHeader={hasHeader}
      textFieldPlaceholder="Search blockchains by name"
      title={`Select ${type} Blockchain`}
      onBack={onBack}>
      {(searchedFor) => {
        const filteredBlockchains = filterBlockchains(list, searchedFor);
        return (
          <>
            {loadingStatus === 'loading' && (
              <LoaderContainer>
                <Spinner size={24} />
              </LoaderContainer>
            )}
            <ListContainer style={listContainerStyle} key="1">
              {loadingStatus === 'failed' && <LoadingFailedAlert />}
              {loadingStatus === 'success' && (
                <>
                  {filteredBlockchains.length ? (
                    <BlockchainsList
                      list={filteredBlockchains}
                      selected={selected}
                      multiSelect={multiSelect}
                      selectedList={selectedList}
                      onChange={onChange}
                    />
                  ) : (
                    <NotFoundAlert catergory="Blockchain" searchedFor={searchedFor} />
                  )}
                </>
              )}
            </ListContainer>
          </>
        );
      }}
    </SecondaryPage>
  );
}
