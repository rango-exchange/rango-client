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
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { containsText } from '../utils/numbers';
import {
  getUniqueSwappersGroups,
  sortLiquiditySourcesByGroupTitle,
} from '../utils/settings';

interface PropTypes {
  supportedSwappers?: string[];
  sourceType: 'Exchanges' | 'Bridges';
}

export function LiquiditySourcePage({
  supportedSwappers,
  sourceType,
}: PropTypes) {
  const [searchedFor, setSearchedFor] = useState<string>('');
  const toggleLiquiditySource = useSettingsStore.use.toggleLiquiditySource();
  const { navigateBackFrom } = useNavigateBack();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();

  const supportedUniqueSwappersGroups: Array<UniqueSwappersGroupType> =
    getUniqueSwappersGroups(supportedSwappers);

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

  const list = liquiditySources
    .sort(sortLiquiditySourcesByGroupTitle)
    .map((sourceItem) => {
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
        onBack: navigateBackFrom.bind(null, navigationRoutes.settings),
        title: i18n.t(sourceType),
        suffix: (
          <LiquiditySourceSuffix>
            <Button variant="ghost" size="xsmall" onClick={toggleAllSources}>
              {i18n.t(hasSelectAll ? 'Deselect all' : 'Select all')}
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
          placeholder={i18n.t('Search {sourceType}', { sourceType })}
          onChange={searchHandler}
        />
        {loadingMetaStatus === 'loading' && <LoadingLiquiditySourceList />}

        {!filteredList.length && !!searchedFor ? (
          <NotFoundContainer>
            <NotFound
              title={i18n.t('No results found')}
              description={i18n.t('Try using different keywords')}
            />
          </NotFoundContainer>
        ) : (
          loadingMetaStatus === 'success' && (
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
