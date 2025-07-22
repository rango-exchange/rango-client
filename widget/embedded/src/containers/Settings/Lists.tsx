import type { ThemeMode } from '../../store/slices/settings';
import type { ListPropTypes, SvgIconProps } from '@arlert-dev/ui';

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
  TargetIcon,
  Tooltip,
  Typography,
} from '@arlert-dev/ui';
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

  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
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
  const customTokens = useAppStore().customTokens();
  const isThemeHidden = isFeatureHidden('theme', features);
  const isLiquidityHidden = isFeatureHidden('liquiditySource', features);
  const isLanguageHidden = isFeatureHidden('language', features);
  const isCustomTokensHidden = isFeatureHidden('customTokens', features);

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
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
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
    id: 'widget-setting-bridge-item-btn',
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
    id: 'widget-setting-exchange-item-btn',
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

  const customTokensItem = {
    id: 'widget-setting-custom-tokens-item-btn',
    title: (
      <Typography variant="title" size="xmedium">
        {i18n.t('Custom Tokens')}
      </Typography>
    ),
    end: (
      <>
        <Typography variant="body" size="medium">
          {`${customTokens.length}`}
        </Typography>
        <Divider direction="horizontal" size={8} />
        <ChevronRightIcon color="black" />
      </>
    ),
    start: <TargetIcon color="gray" size={16} />,
    onClick: () => navigate(navigationRoutes.customTokens),
  };
  const languageItem = {
    id: 'widget-setting-language-item-btn',
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
    id: 'widget-setting-infinite-approval-item-btn',
    title: (
      <React.Fragment>
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
                <b>{i18n.t('Warning')}</b>:&nbsp;
                {i18n.t(
                  "Enabling the 'Infinite approval' mode grants unrestricted access to underlying smart contracts, allowing them to utilize the approved token amount without limitations."
                )}
              </Typography>
            </TooltipContainer>
          }>
          <InfoIcon color="gray" />
        </Tooltip>
      </React.Fragment>
    ),
    start: <InfinityIcon color="gray" size={16} />,
    end: <Switch checked={infiniteApprove} />,
    onClick: toggleInfiniteApprove,
  };

  const themeItem = {
    id: 'widget-setting-theme-item-btn',
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
          className="widget-setting-theme-item-tabs-container"
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
  if (!isCustomTokensHidden) {
    settingItems.push(customTokensItem);
  }
  if (!isLanguageHidden) {
    settingItems.push(languageItem);
  }
  settingItems.push(infiniteApprovalItem);

  if (!themeConfig?.singleTheme && !isThemeHidden) {
    settingItems.push(themeItem);
  }

  return (
    <List
      type={
        <ListItemButton
          className="widget-settings-list-item-btn"
          hasDivider
          id="_"
          onClick={() => console.log()}
        />
      }
      items={settingItems}
    />
  );
}
