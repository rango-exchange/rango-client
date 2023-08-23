import type { PropTypes } from './BlockchainList.types';
import type { BlockchainMeta } from 'rango-sdk';

import { i18n } from '@lingui/core';
import {
  Divider,
  Image,
  ListItem,
  ListItemButton,
  NotFound,
  Skeleton,
  Typography,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { useMetaStore } from '../../store/meta';

import { filterBlockchains } from './BlockchainList.helpers';
import { ChainList, Content } from './BlockchainList.styles';

const SIZE = 20;
export function BlockchainList(props: PropTypes) {
  const { list, searchedFor, onChange, blockchainType } = props;
  const [blockchains, setBlockchains] = useState<BlockchainMeta[]>(list);
  const loadingStatus = useMetaStore.use.loadingStatus();

  useEffect(() => {
    setBlockchains([...filterBlockchains(list, searchedFor, blockchainType)]);
  }, [list, searchedFor, blockchainType]);

  return (
    <div>
      <Typography variant="label" size="large">
        {i18n.t('Select Chain')}
      </Typography>
      <Divider size={4} />
      <Content>
        {loadingStatus === 'loading' ? (
          <ChainList>
            {Array.from(Array(SIZE), (e) => (
              <ListItem
                key={e}
                start={<Skeleton variant="circular" width={35} height={35} />}
                title={<Skeleton variant="text" size="large" width={90} />}
              />
            ))}
          </ChainList>
        ) : !blockchains.length && !!searchedFor.length ? (
          <>
            <Divider size={32} />
            <NotFound
              title={i18n.t('No results found')}
              subTitle={i18n.t('Try using different keywords')}
            />
          </>
        ) : (
          <ChainList>
            {blockchains.map((item) => (
              <ListItemButton
                key={`${item.name}-${item.chainId}`}
                onClick={() => onChange(item)}
                start={<Image src={item.logo} size={30} />}
                title={
                  <Typography variant="title" size="medium">
                    {item.name}
                  </Typography>
                }
                id={item.chainId as string}
              />
            ))}
          </ChainList>
        )}
      </Content>
    </div>
  );
}
