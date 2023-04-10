import React from 'react';
import { BlockchainMeta } from 'rango-sdk';
import { BlockchainsList } from '../BlockchainsList';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';
import { Alert } from '../Alert';
import { Spinner } from '../Spinner';
import { styled } from '../../theme';
import { CSSProperties } from '@stitches/react';
import { containsText } from '../../helper';
import { Typography } from '../Typography';

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
  onClose?: () => void;

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
      hasSearch={true}
      hasHeader={hasHeader}
      searchPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Network`}
      onBack={onBack}
    >
      {(searchedFor) => {
        const filteredBlockchains = filterBlockchains(list, searchedFor);
        return (
          <ListContainer style={listContainerStyle} key="1">
            {loadingStatus === 'loading' && (
              <div>
                <Spinner size={24} />
              </div>
            )}
            {loadingStatus === 'failed' && (
              <Alert type="error">
                <Typography variant="body2">
                  Error connecting server, please reload the app and try again
                </Typography>
              </Alert>
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
                  <Alert type="secondary">
                    <Typography variant="body2">{`${searchedFor} not found`}</Typography>
                  </Alert>
                )}
              </>
            )}
          </ListContainer>
        );
      }}
    </SecondaryPage>
  );
}
