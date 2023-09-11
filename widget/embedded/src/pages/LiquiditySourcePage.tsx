import type {
  LiquiditySourceType,
  UniqueSwappersGroupType,
} from '../utils/settings';

import { i18n } from '@lingui/core';
import {
  Button,
  Checkbox,
  Image,
  List,
  ListItemButton,
  styled,
  Typography,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { Layout } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useSettingsStore } from '../store/settings';
import { containsText } from '../utils/numbers';
import { getUniqueSwappersGroups } from '../utils/settings';

interface PropTypes {
  supportedSwappers?: string[];
  sourceType: 'Exchanges' | 'Bridges';
}

interface TitleContainerProps {
  title: string;
}

function TitleContainer(props: TitleContainerProps) {
  const { title } = props;
  return (
    <Typography variant="title" size="xmedium" color="neutral900">
      {title}
    </Typography>
  );
}

const Container = styled('div', {
  height: '100%',
});

const ListContainer = styled('div', {
  paddingTop: '$20',
  width: '100%',
  height: '100%',
  overflow: 'scroll',
});

const SuffixContainer = styled('div', {
  width: 80,
  display: 'flex',
  justifyContent: 'flex-end',
});

export function LiquiditySourcePage({
  supportedSwappers,
  sourceType,
}: PropTypes) {
  const [searchedFor, setSearchedFor] = useState<string>('');
  const toggleLiquiditySource = useSettingsStore.use.toggleLiquiditySource();
  const { navigateBackFrom } = useNavigateBack();

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

  const list = liquiditySources.map((sourceItem) => {
    const { selected, groupTitle, logo } = sourceItem;
    return {
      start: <Image src={logo} size={22} type="circular" />,
      onClick: () => toggleLiquiditySource(groupTitle),
      end: <Checkbox checked={selected} />,
      title: <TitleContainer title={i18n.t(groupTitle)} />,
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
          <SuffixContainer>
            <Button variant="ghost" onClick={toggleAllSources}>
              <Typography variant="label" size="medium" color="neutral900">
                {i18n.t(hasSelectAll ? 'Deselect all' : 'Select all')}
              </Typography>
            </Button>
          </SuffixContainer>
        ),
      }}>
      <Container>
        <SearchInput
          value={searchedFor}
          setValue={setSearchedFor}
          fullWidth
          color="light"
          variant="contained"
          placeholder={i18n.t('Swap {sourceType}', { sourceType })}
          onChange={searchHandler}
        />

        <ListContainer>
          <List
            type={
              <ListItemButton title="_" id="_" onClick={() => console.log()} />
            }
            items={filteredList}
          />
        </ListContainer>
      </Container>
    </Layout>
  );
}
