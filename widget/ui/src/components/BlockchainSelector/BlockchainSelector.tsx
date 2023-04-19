import React from 'react';
import { BlockchainMeta } from 'rango-sdk';
import { BlockchainsList } from '../BlockchainsList';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';
import { Spinner } from '../Spinner';
import { styled } from '../../theme';
import { CSSProperties } from '@stitches/react';
import { containsText } from '../../helper';
import { LoadingStatus } from '../../types/meta';
import { LoadingFailedAlert } from '../Alert/LoadingFailedAlert';
import { NotFoundAlert } from '../Alert/NotFoundAlert';
import { LoaderContainer } from '../TokenSelector/TokenSelector';

const ListContainer = styled('div', {
  overflowY: 'auto',
  padding: '0 $4',
});

const filterBlockchains = (list: BlockchainMeta[], searchedFor: string) =>
  list.filter(
    (blockchain) =>
      containsText(blockchain.name, searchedFor) ||
      containsText(blockchain.displayName, searchedFor)
  );

export interface PropTypes {
  type?: 'Source' | 'Destination';
  list: BlockchainMeta[];
  selected?: BlockchainMeta | null;
  onChange: (blockchain: BlockchainMeta) => void;
  onBack?: () => void;
  loadingStatus: LoadingStatus;
  hasHeader?: boolean;
  listContainerStyle?: CSSProperties;
  multiSelect?: boolean;
  selectedList?: BlockchainMeta[] | 'all';
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
      textFieldPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Network`}
      onBack={onBack}
    >
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
                    <NotFoundAlert
                      catergory="Blockchain"
                      searchedFor={searchedFor}
                    />
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
