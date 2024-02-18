import { i18n } from '@lingui/core';
import {
  Alert,
  Button,
  ChevronRightIcon,
  Divider,
  InfoIcon,
  List,
  ListItemButton,
  Skeleton,
  styled,
  Switch,
  Tooltip,
  Typography,
} from '@rango-dev/ui';
import React from 'react';
import {
  useInRouterContext,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { Layout, PageContainer } from '../components/Layout';
import { Slippage } from '../components/Slippage';
import { SlippageTooltipContainer as TooltipContainer } from '../components/Slippage/Slippage.styles';
import { navigationRoutes } from '../constants/navigationRoutes';
import { SearchParams } from '../constants/searchParams';
import { useAppStore } from '../store/AppStore';
import { getContainer } from '../utils/common';
import { getUniqueSwappersGroups, isFeatureHidden } from '../utils/settings';

const ResetAction = styled('div', {
  paddingLeft: '$8',
});

export function SettingsPage() {
  const navigate = useNavigate();
  const { theme } = useAppStore().config;
  const fetchStatus = useAppStore().fetchStatus;
  const swappers = useAppStore().swappers();
  const disabledLiquiditySources = useAppStore().getDisabledLiquiditySources();
  const {
    config: { features },
    isInCampaignMode,
    updateCampaignMode,
  } = useAppStore();
  const campaignMode = isInCampaignMode();
  const isThemeHidden = isFeatureHidden('theme', features);

  const isLiquidityHidden = isFeatureHidden('liquiditySource', features);

  const isLanguageHidden = isFeatureHidden('language', features);

  const infiniteApprove = useAppStore().infiniteApprove;
  const toggleInfiniteApprove = useAppStore().toggleInfiniteApprove;

  const supportedUniqueSwappersGroups = getUniqueSwappersGroups(
    swappers,
    disabledLiquiditySources
  );

  const bridgeSources = supportedUniqueSwappersGroups.filter(
    (uniqueItem) =>
      uniqueItem.type === 'BRIDGE' || uniqueItem.type === 'AGGREGATOR'
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

  const handleEndItem = (totalSelected: number, total: number) => {
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
        {i18n.t('Enabled bridges')}
      </Typography>
    ),
    end: (
      <>
        {handleEndItem(totalSelectedBridgeSources, totalBridgeSources)}
        <Divider direction="horizontal" size={8} />
        <ChevronRightIcon color="black" />
      </>
    ),
    onClick: () => navigate(navigationRoutes.bridges),
  };

  const exchangeItem = {
    id: 'exchange-item',
    title: (
      <Typography variant="title" size="xmedium">
        {i18n.t('Enabled exchanges')}
      </Typography>
    ),
    end: (
      <>
        {handleEndItem(totalSelectedExchangeSources, totalExchangeSources)}
        <Divider direction="horizontal" size={8} />
        <ChevronRightIcon color="gray" />
      </>
    ),
    onClick: () => navigate(navigationRoutes.exchanges),
  };

  const languageItem = {
    id: 'language-item',
    title: (
      <Typography variant="title" size="xmedium">
        {i18n.t('Language')}
      </Typography>
    ),
    end: <ChevronRightIcon color="gray" />,
    onClick: () => navigate(navigationRoutes.languages),
  };

  const themeItem = {
    id: 'theme-item',
    title: (
      <Typography variant="title" size="xmedium">
        {i18n.t('Theme')}
      </Typography>
    ),
    end: <ChevronRightIcon color="gray" />,
    onClick: () => navigate(navigationRoutes.themes),
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
    end: <Switch checked={infiniteApprove} />,
    onClick: toggleInfiniteApprove,
  };

  const settingItems = isLiquidityHidden ? [] : [bridgeItem, exchangeItem];

  if (!isLanguageHidden) {
    settingItems.push(languageItem);
  }
  if (!theme?.singleTheme && !isThemeHidden) {
    settingItems.push(themeItem);
  }
  settingItems.push(infiniteApprovalItem);

  const [, setSearchParams] = useSearchParams();
  const isRouterInContext = useInRouterContext();

  const onClick = () => {
    if (isRouterInContext && campaignMode) {
      setSearchParams(
        (prev) => {
          prev.delete(SearchParams.LIQUIDITY_SOURCES);
          return prev;
        },
        { replace: true }
      );
      updateCampaignMode('liquiditySources', undefined);
    }
  };

  return (
    <Layout
      header={{
        title: i18n.t('Settings'),
      }}>
      <PageContainer>
        {campaignMode && (
          <Alert
            type="info"
            variant="alarm"
            title={i18n.t(
              "Currently, you're in campaign mode with restrictions on liquidity sources. Would you like to switch out of this mode and make use of all available liquidity sources?"
            )}
            action={
              <ResetAction>
                <Button type="secondary" size="small" onClick={onClick}>
                  Reset
                </Button>
              </ResetAction>
            }
          />
        )}
        <Slippage />
        <List
          type={
            <ListItemButton title="_" id="_" onClick={() => console.log()} />
          }
          items={settingItems}
        />
      </PageContainer>
    </Layout>
  );
}
