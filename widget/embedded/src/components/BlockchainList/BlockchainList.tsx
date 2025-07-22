import type { PropTypes } from './BlockchainList.types';
import type { BlockchainMeta } from 'rango-sdk';

import { i18n } from '@lingui/core';
import {
  Divider,
  Image,
  ListItemButton,
  NotFound,
  Typography,
} from '@arlert-dev/ui';
import React, { useEffect, useState } from 'react';

import { useAppStore } from '../../store/AppStore';

import { filterBlockchains } from './BlockchainList.helpers';
import { BlockchainListContainer, List } from './BlockchainList.styles';
import { LoadingBlockchainList } from './LoadingBlockchainList';

export function BlockchainList(props: PropTypes) {
  const {
    list,
    searchedFor,
    onChange,
    blockchainCategory,
    showTitle = true,
  } = props;
  const [blockchains, setBlockchains] = useState<BlockchainMeta[]>(list);
  const { fetchStatus } = useAppStore();

  useEffect(() => {
    setBlockchains([
      ...filterBlockchains(list, searchedFor, blockchainCategory),
    ]);
  }, [list, searchedFor, blockchainCategory]);

  const renderList = () => {
    if (!blockchains.length && !!searchedFor) {
      return (
        <NotFound
          title={i18n.t('No results found')}
          description={i18n.t('Try using different keywords')}
        />
      );
    }
    return (
      <List
        as="ul"
        key={`${blockchainCategory}-${searchedFor}`}
        id="widget-blockchain-list">
        {blockchains.map((item) => (
          <ListItemButton
            key={`${item.name}-${item.chainId}`}
            className={`widget-blockchain-list-item-btn`}
            hasDivider
            onClick={() => onChange(item)}
            start={<Image src={item.logo} size={30} />}
            title={
              <Typography variant="title" size="medium">
                {item.displayName}
              </Typography>
            }
            id={item.name}
          />
        ))}
      </List>
    );
  };

  return (
    <>
      {showTitle && (
        <>
          <Typography variant="label" size="large">
            {i18n.t('Select Chain')}
          </Typography>
          <Divider size={4} />
        </>
      )}
      <BlockchainListContainer>
        {fetchStatus === 'loading' && <LoadingBlockchainList />}
        {fetchStatus === 'success' && renderList()}
      </BlockchainListContainer>
    </>
  );
}
