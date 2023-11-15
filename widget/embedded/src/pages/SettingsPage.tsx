import { i18n } from '@lingui/core';
import {
  ChevronRightIcon,
  Divider,
  InfoIcon,
  List,
  ListItemButton,
  Skeleton,
  Switch,
  Tooltip,
  Typography,
} from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { SettingsContainer } from '../components/SettingsContainer';
import { Slippage } from '../components/Slippage';
import { SlippageTooltipContainer as TooltipContainer } from '../components/Slippage/Slippage.styles';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useAppStore } from '../store/AppStore';
import { useSettingsStore } from '../store/settings';
import { getContainer } from '../utils/common';
import { getUniqueSwappersGroups } from '../utils/settings';

export function SettingsPage() {
  const navigate = useNavigate();
  const { theme } = useAppStore().use.config();
  const fetchStatus = useAppStore().use.fetchStatus();
  const swappers = useAppStore().use.swappers()();
  const { navigateBackFrom } = useNavigateBack();

  const infiniteApprove = useSettingsStore.use.infiniteApprove();
  const toggleInfiniteApprove = useSettingsStore.use.toggleInfiniteApprove();

  const supportedUniqueSwappersGroups = getUniqueSwappersGroups(swappers);

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

  /*
   * const languageItem = {
   *   id: 'language-item',
   *   title: (
   *     <Typography variant="title" size="xmedium">
   *       {i18n.t('Language')}
   *     </Typography>
   *   ),
   *   end: <ChevronRightIcon color="gray" />,
   *   onClick: () => navigate(navigationRoutes.languages),
   * };
   */

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
          {i18n.t('Infinite Approval')}
        </Typography>
        <Divider direction="horizontal" size={4} />
        <Tooltip
          side="top"
          container={getContainer()}
          content={
            <TooltipContainer>
              <Typography variant="label" size="medium" color="neutral700">
                {i18n.t(
                  "Enabling the 'Infinite Approval' mode grants unrestricted access to smart contracts of DEXes/Bridges, allowing them to utilize the approved token amount without limitations."
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

  const settingItems = [
    bridgeItem,
    exchangeItem,
    // languageItem
  ];
  if (!theme?.singleTheme) {
    settingItems.push(themeItem);
  }
  settingItems.push(infiniteApprovalItem);

  return (
    <Layout
      header={{
        onBack: () => navigateBackFrom(navigationRoutes.settings),
        title: i18n.t('Setting'),
      }}>
      <SettingsContainer>
        <Slippage />
        <List
          type={
            <ListItemButton title="_" id="_" onClick={() => console.log()} />
          }
          items={settingItems}
        />
      </SettingsContainer>
    </Layout>
  );
}
