import React from 'react';
import { BlockchainMeta } from 'rango-sdk';
import { BlockchainsList } from '../BlockchainsList';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';
import { Alert } from '../Alert';
import { Spinner } from '../Spinner';
import { styled } from '../../theme';
import { CSSProperties } from '@stitches/react';
import { containsText } from '../../helper';

const ListContainer = styled('div', {
  height: '450px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const filterBlockchains = (list: BlockchainMeta[], searchedFor: string) =>
  list.filter(
    (blockchain) =>
      containsText(blockchain.name, searchedFor) ||
      containsText(blockchain.displayName, searchedFor)
  );

export type LoadingStatus = 'loading' | 'success' | 'failed';

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
      Content={({ searchedFor }) => {
        const filteredBlockchains = filterBlockchains(list, searchedFor);
        return (
          <ListContainer style={listContainerStyle}>
            {loadingStatus === 'loading' && (
              <div>
                <Spinner size={24} />
              </div>
            )}
            {loadingStatus === 'failed' && (
              <Alert
                type="error"
                description="Error connecting server, please reload the app and try again"
              />
            )}
            {loadingStatus === 'success' && (
              <>
                {filteredBlockchains.length > 0 ? (
                  <BlockchainsList
                    list={filteredBlockchains}
                    selected={selected}
                    multiSelect={multiSelect}
                    selectedList={selectedList}
                    onChange={onChange}
                  />
                ) : (
                  <Alert
                    type="secondary"
                    description={`${searchedFor} not found`}
                  />
                )}
              </>
            )}
          </ListContainer>
        );
      }}
    />
  );
}
