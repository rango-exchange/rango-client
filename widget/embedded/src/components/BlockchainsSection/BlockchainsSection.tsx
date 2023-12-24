/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PropTypes } from './BlockchainsSection.types';

import { i18n } from '@lingui/core';
import {
  BlockchainsChip,
  Divider,
  Image,
  Skeleton,
  Tooltip,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import { BLOCKCHAIN_LIST_SIZE } from '../../constants/configs';
import { usePrepareBlockchainList } from '../../hooks/usePrepareBlockchainList';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { getContainer } from '../../utils/common';

import { Blockchains } from './BlockchainsSection.styles';

const NUMBER_OF_LOADING = 12;

export function BlockchainsSection(props: PropTypes) {
  const { blockchains, type, blockchain, onChange, onMoreClick } = props;
  const blockchainsList = usePrepareBlockchainList(blockchains, {
    limit: BLOCKCHAIN_LIST_SIZE,
    selected: blockchain?.name,
  });

  const { fetchStatus } = useAppStore();
  const resetToBlockchain = useQuoteStore.use.resetToBlockchain();
  const resetFromBlockchain = useQuoteStore.use.resetFromBlockchain();
  const hasMoreItemsInList = blockchainsList.more.length > 0;
  /**
   * When only one item is left on list, we will not show the `More` button and will show the item itself instead.
   */
  const onlyOneItemInList = blockchainsList.more.length === 1;
  const showMoreButton = !onlyOneItemInList && hasMoreItemsInList;

  return (
    <>
      <Divider size={12} />
      <Typography variant="label" size="large">
        {i18n.t('Select Blockchain')}
      </Typography>
      <Divider size={12} />
      <Blockchains>
        {fetchStatus === 'loading' &&
          Array.from(Array(NUMBER_OF_LOADING), (e) => (
            <Skeleton key={e} variant="rounded" height={50} />
          ))}
        {fetchStatus === 'success' && (
          <>
            <BlockchainsChip
              selected={!blockchain}
              onClick={() => {
                if (type === 'from') {
                  resetFromBlockchain();
                } else {
                  resetToBlockchain();
                }
              }}>
              <Typography variant="body" size="xsmall" color="secondary500">
                {i18n.t('All')}
              </Typography>
            </BlockchainsChip>
            {blockchainsList.list.map((item) => (
              <Tooltip
                key={item.name}
                content={item.shortName}
                side="bottom"
                sideOffset={2}
                container={getContainer()}>
                <BlockchainsChip
                  key={item.name}
                  selected={!!blockchain && blockchain.name === item.name}
                  onClick={() => onChange(item)}>
                  <Image src={item.logo} size={30} />
                </BlockchainsChip>
              </Tooltip>
            ))}

            {onlyOneItemInList ? (
              <BlockchainsChip
                key={blockchainsList.more[0].name}
                selected={
                  !!blockchain &&
                  blockchain.name === blockchainsList.more[0].name
                }
                onClick={() => onChange(blockchainsList.more[0])}>
                <Image src={blockchainsList.more[0].logo} size={30} />
              </BlockchainsChip>
            ) : null}

            {showMoreButton ? (
              <BlockchainsChip onClick={onMoreClick} key="more-blockchains">
                <Typography variant="body" size="xsmall" color="secondary500">
                  {i18n._('More +{count}', {
                    count: blockchainsList.more.length,
                  })}
                </Typography>
              </BlockchainsChip>
            ) : null}
          </>
        )}
      </Blockchains>
    </>
  );
}
