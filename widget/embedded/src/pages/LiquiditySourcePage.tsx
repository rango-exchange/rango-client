import type {
  LiquiditySourceType,
  UniqueSwappersGroupType,
} from '../utils/settings';

import { i18n } from '@lingui/core';
import {
  Button,
  Checkbox,
  Image,
  ListItemButton,
  NotFound,
  Typography,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { Layout } from '../components/Layout';
import { LoadingLiquiditySourceList } from '../components/LoadingLiquiditySourceList';
import { SearchInput } from '../components/SearchInput';
import {
  LiquiditySourceList,
  LiquiditySourceSuffix,
  NotFoundContainer,
  SettingsContainer,
} from '../components/SettingsContainer';
import { useAppStore } from '../store/AppStore';
import { containsText } from '../utils/numbers';
import { getUniqueSwappersGroups } from '../utils/settings';

interface PropTypes {
  sourceType: 'Exchanges' | 'Bridges';
}

export function LiquiditySourcePage({ sourceType }: PropTypes) {
  const fetchStatus = useAppStore().fetchStatus;
  const swappers = useAppStore().swappers();
  const disabledLiquiditySources = useAppStore().disabledLiquiditySources;
  const [searchedFor, setSearchedFor] = useState<string>('');
  const toggleLiquiditySource = useAppStore().toggleLiquiditySource;
  const supportedUniqueSwappersGroups: Array<UniqueSwappersGroupType> =
    getUniqueSwappersGroups(swappers, disabledLiquiditySources);

  const types = { Exchanges: i18n.t('Exchanges'), Bridges: i18n.t('Bridges') };
  const validTypes: Array<LiquiditySourceType> = [];
  if (sourceType === 'Exchanges') {
    validTypes.push('DEX');
  }
  if (sourceType === 'Bridges') {
    validTypes.push('BRIDGE');
    validTypes.push('AGGREGATOR');
  }

  const liquiditySources = supportedUniqueSwappersGroups.filter((uniqueItem) =>
    validTypes.includes(uniqueItem.type)
  );

  const hasSelectAll =
    liquiditySources.length ===
    liquiditySources.filter((sourceItem) => sourceItem.selected).length;

  const toggleAllSources = () => {
    liquiditySources.forEach((sourceItem) => {
      if (hasSelectAll) {
        toggleLiquiditySource(sourceItem.groupTitle);
      } else {
        if (!sourceItem.selected) {
          toggleLiquiditySource(sourceItem.groupTitle);
        }
      }
    });
  };

  const list = liquiditySources.map((sourceItem) => {
    const { selected, groupTitle, logo } = sourceItem;
    return {
      start: <Image src={logo} size={22} type="circular" />,
      onClick: () => toggleLiquiditySource(groupTitle),
      end: <Checkbox checked={selected} />,
      title: (
        <Typography variant="title" size="xmedium">
          {i18n.t(groupTitle)}
        </Typography>
      ),
      ...sourceItem,
    };
  });

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchedFor(value);
  };

  let filteredList = list;
  if (searchedFor) {
    filteredList = list.filter((sourceItem) =>
      containsText(sourceItem.groupTitle, searchedFor)
    );
  }

  return (
    <Layout
      header={{
        title: i18n.t(sourceType),
        suffix: (
          <LiquiditySourceSuffix>
            <Button variant="ghost" size="xsmall" onClick={toggleAllSources}>
              {hasSelectAll ? i18n.t('Deselect all') : i18n.t('Select all')}
            </Button>
          </LiquiditySourceSuffix>
        ),
      }}>
      <SettingsContainer>
        <SearchInput
          value={searchedFor}
          setValue={setSearchedFor}
          fullWidth
          color="light"
          variant="contained"
          placeholder={i18n.t('Search {sourceType}', {
            sourceType: types[sourceType],
          })}
          onChange={searchHandler}
        />
        {fetchStatus === 'loading' && <LoadingLiquiditySourceList />}

        {!filteredList.length && !!searchedFor ? (
          <NotFoundContainer>
            <NotFound
              title={i18n.t('No results found')}
              description={i18n.t('Try using different keywords')}
            />
          </NotFoundContainer>
        ) : (
          fetchStatus === 'success' && (
            <LiquiditySourceList>
              {filteredList.map((sourceItem) => {
                return (
                  <React.Fragment key={sourceItem.id}>
                    <ListItemButton
                      style={{ height: '61px' }}
                      {...sourceItem}
                      selected={false}
                      hasDivider
                    />
                  </React.Fragment>
                );
              })}
            </LiquiditySourceList>
          )
        )}
      </SettingsContainer>
    </Layout>
  );
}
