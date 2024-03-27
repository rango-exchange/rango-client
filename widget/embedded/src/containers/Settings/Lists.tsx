import type { ThemeMode } from '../../store/slices/settings';
import type { ListPropTypes, SvgIconProps } from '@rango-dev/ui';

import { i18n } from '@lingui/core';
import {
  AutoThemeIcon,
  BridgesIcon,
  ChevronRightIcon,
  DarkModeIcon,
  Divider,
  ExchangeIcon,
  InfinityIcon,
  InfoIcon,
  LanguageIcon,
  LightModeIcon,
  List,
  ListItem,
  ListItemButton,
  Skeleton,
  styled,
  Switch,
  Tabs,
  Tooltip,
  Typography,
} from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { SlippageTooltipContainer as TooltipContainer } from '../../components/Slippage/Slippage.styles';
import { navigationRoutes } from '../../constants/navigationRoutes';
import { ThemeModeEnum } from '../../constants/settings';
import { useLanguage } from '../../hooks/useLanguage';
import { useAppStore } from '../../store/AppStore';
import { getContainer } from '../../utils/common';
import { getUniqueSwappersGroups, isFeatureHidden } from '../../utils/settings';

const ThemeSection = styled('div', {
  width: '202px',
  height: '$40',
});

const themesList = [
  {
    id: ThemeModeEnum.LIGHT,
    icon: <LightModeIcon color="black" size={24} />,
    tooltip: (
      <Typography size="xsmall" variant="body">
        {i18n.t('Light')}
      </Typography>
    ),
  },
  {
    id: ThemeModeEnum.DARK,
    icon: <DarkModeIcon color="black" size={24} />,
    tooltip: (
      <Typography size="xsmall" variant="body">
        {i18n.t('Dark')}
      </Typography>
    ),
  },
  {
    id: ThemeModeEnum.AUTO,
    icon: <AutoThemeIcon color="black" size={24} />,
    tooltip: (
      <Typography size="xsmall" variant="body">
        {i18n.t('Auto')}
      </Typography>
    ),
  },
];

const getThemeIcon = (theme: ThemeMode) => {
  const iconProps: SvgIconProps = { color: 'gray', size: 16 };

  switch (theme) {
    case 'auto':
      return <AutoThemeIcon {...iconProps} />;
    case 'dark':
      return <DarkModeIcon {...iconProps} />;
    default:
      return <LightModeIcon {...iconProps} />;
  }
};

export function SettingsLists() {
  const navigate = useNavigate();
  const { theme: themeConfig } = useAppStore().config;
  const { setTheme, theme } = useAppStore();
  const { activeLanguage, languages } = useLanguage();
  const currentLanguage = languages.find(
    (language) => language.local === activeLanguage
  )?.label;

  const fetchStatus = useAppStore().fetchStatus;
  const swappers = useAppStore().swappers();
  const disabledLiquiditySources = useAppStore().getDisabledLiquiditySources();
  const {
    config: { features },
  } = useAppStore();
  const isThemeHidden = isFeatureHidden('theme', features);
  const isLiquidityHidden = isFeatureHidden('liquiditySource', features);
  const isLanguageHidden = isFeatureHidden('language', features);

  const infiniteApprove = useAppStore().infiniteApprove;
  const toggleInfiniteApprove = useAppStore().toggleInfiniteApprove;

  const supportedUniqueSwappersGroups = getUniqueSwappersGroups(
    swappers,
    disabledLiquiditySources
  );

  const bridgeSources = supportedUniqueSwappersGroups.filter((uniqueItem) =>
    ['BRIDGE', 'AGGREGATOR', 'OFF_CHAIN'].includes(uniqueItem.type)
  );

  const totalBridgeSources = bridgeSources.length;
  const totalSelectedBridgeSources = bridgeSources.filter(
    (uniqueItem) => uniqueItem.selected
  ).length;

  const exchangeSources = supportedUniqueSwappersGroups.filter(
    (uniqueItem) => uniqueItem.type === 'DEX'
  );

  const totalExchangeSources = exchangeSources.length;
  const totalSelectedExchangeSources = exchangeSources.filter(
    (uniqueItem) => uniqueItem.selected
  ).length;

  const handleSwapperEndItem = (totalSelected: number, total: number) => {
    switch (fetchStatus) {
      case 'loading':
        return <Skeleton variant="text" size="medium" width={50} />;
      case 'failed':
        return (
          <Typography variant="body" size="medium" color="$error500">
            {i18n.t('Loading failed')}
          </Typography>
        );
      default:
        return (
          <Typography variant="body" size="medium">
            {`${totalSelected} / ${total}`}
          </Typography>
        );
    }
  };

  const bridgeItem = {
    id: 'bridge-item',
    title: (
      <Typography variant="title" size="xmedium">
        {i18n.t('Bridges')}
      </Typography>
    ),
    end: (
      <>
        {handleSwapperEndItem(totalSelectedBridgeSources, totalBridgeSources)}
        <Divider direction="horizontal" size={8} />
        <ChevronRightIcon color="black" />
      </>
    ),
    onClick: () => navigate(navigationRoutes.bridges),
    start: <BridgesIcon color="gray" size={16} />,
  };

  const exchangeItem = {
    id: 'exchange-item',
    title: (
      <Typography variant="title" size="xmedium">
        {i18n.t('Exchanges')}
      </Typography>
    ),
    end: (
      <>
        {handleSwapperEndItem(
          totalSelectedExchangeSources,
          totalExchangeSources
        )}
        <Divider direction="horizontal" size={8} />
        <ChevronRightIcon color="black" />
      </>
    ),
    start: <ExchangeIcon color="gray" size={16} />,
    onClick: () => navigate(navigationRoutes.exchanges),
  };

  const languageItem = {
    id: 'language-item',
    title: (
      <Typography variant="title" size="xmedium">
        {i18n.t('Language')}
      </Typography>
    ),
    start: <LanguageIcon color="gray" size={16} />,
    end: (
      <>
        <Typography variant="body" size="medium">
          {currentLanguage}
        </Typography>
        <Divider direction="horizontal" size={8} />
        <ChevronRightIcon color="black" />
      </>
    ),
    onClick: () => navigate(navigationRoutes.languages),
  };

  const infiniteApprovalItem = {
    id: 'infinite-approval-item',
    title: (
      <>
        <Typography variant="title" size="xmedium">
          {i18n.t('Infinite approval')}
        </Typography>
        <Divider direction="horizontal" size={4} />
        <Tooltip
          side="top"
          sideOffset={4}
          container={getContainer()}
          content={
            <TooltipContainer>
              <Typography variant="label" size="medium" color="neutral700">
                {i18n.t(
                  "Enabling the 'Infinite approval' mode grants unrestricted access to smart contracts of DEXes/Bridges, allowing them to utilize the approved token amount without limitations."
                )}
              </Typography>
            </TooltipContainer>
          }>
          <InfoIcon color="gray" />
        </Tooltip>
      </>
    ),
    start: <InfinityIcon color="gray" size={16} />,
    end: <Switch checked={infiniteApprove} />,
    onClick: toggleInfiniteApprove,
  };

  const themeItem = {
    id: 'theme-item',
    type: <ListItem />,
    title: (
      <Typography variant="title" size="xmedium">
        {i18n.t('Theme')}
      </Typography>
    ),
    end: (
      <ThemeSection>
        <Tabs
          container={getContainer()}
          items={themesList}
          value={theme}
          onChange={(item) => setTheme(item.id as ThemeMode)}
          type="primary"
          borderRadius="small"
        />
      </ThemeSection>
    ),
    start: getThemeIcon(theme),
  };

  const settingItems: ListPropTypes['items'] = isLiquidityHidden
    ? []
    : [bridgeItem, exchangeItem];

  if (!isLanguageHidden) {
    settingItems.push(languageItem);
  }
  settingItems.push(infiniteApprovalItem);

  if (!themeConfig?.singleTheme && !isThemeHidden) {
    settingItems.push(themeItem);
  }

  return (
    <List
      type={<ListItemButton hasDivider id="_" onClick={() => console.log()} />}
      items={settingItems}
    />
  );
}
