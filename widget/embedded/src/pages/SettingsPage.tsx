import { i18n } from '@lingui/core';
import {
  ChevronRightIcon,
  Chip,
  Divider,
  InfoIcon,
  List,
  ListItemButton,
  styled,
  Switch,
  TextField,
  Typography,
} from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { navigationRoutes } from '../constants/navigationRoutes';
import {
  MAX_SLIPPAGE,
  MIN_SLIPPGAE,
  SLIPPAGES,
} from '../constants/swapSettings';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { getUniqueSwappersGroups } from '../utils/settings';

const BaseContainer = styled('div', {
  padding: '5px 10px',
  marginBottom: '30px',
});

const SlippageChipsContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
});

const Head = styled('div', {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  marginBottom: '10px',
});

interface SettingItemPropsTypes {
  title: string;
}

function SettingItemTitle({ title }: SettingItemPropsTypes) {
  return (
    <Typography variant="title" size="xmedium" color="neutral900">
      {i18n.t(title)}
    </Typography>
  );
}

interface PropTypes {
  supportedSwappers?: string[];
  singleTheme?: boolean;
}

export function SettingsPage({ supportedSwappers, singleTheme }: PropTypes) {
  const slippage = useSettingsStore.use.slippage();
  const setSlippage = useSettingsStore.use.setSlippage();
  const customSlippage = useSettingsStore.use.customSlippage();
  const setCustomSlippage = useSettingsStore.use.setCustomSlippage();

  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();

  const infiniteApprove = useSettingsStore.use.infiniteApprove();
  const toggleInfiniteApprove = useSettingsStore.use.toggleInfiniteApprove();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();

  const supportedUniqueSwappersGroups =
    getUniqueSwappersGroups(supportedSwappers);

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

  const bridgeItem = {
    id: 'bridge-item',
    title: <SettingItemTitle title="Enabled bridges" />,
    end: (
      <>
        {loadingMetaStatus === 'success' && (
          <Typography variant="body" size="medium" color="neutral900">
            {`${totalSelectedBridgeSources} / ${totalBridgeSources}`}
          </Typography>
        )}
        {loadingMetaStatus === 'failed' && (
          <Typography variant="body" size="medium" color="$error500">
            Loading failed
          </Typography>
        )}
        <Divider direction="horizontal" size={8} />
        <ChevronRightIcon color="gray" />
      </>
    ),
    onClick: () => navigate(navigationRoutes.bridges),
  };

  const exchangeItem = {
    id: 'exchange-item',
    title: <SettingItemTitle title="Enabled exchanges" />,
    end: (
      <>
        {loadingMetaStatus === 'success' && (
          <Typography variant="body" size="medium" color="neutral900">
            {`${totalSelectedExchangeSources} / ${totalExchangeSources}`}
          </Typography>
        )}
        {loadingMetaStatus === 'failed' && (
          <Typography variant="body" size="medium" color="$error500">
            Loading failed
          </Typography>
        )}
        <Divider direction="horizontal" size={8} />
        <ChevronRightIcon color="gray" />
      </>
    ),
    onClick: () => navigate(navigationRoutes.exchanges),
  };

  const languageItem = {
    id: 'language-item',
    title: <SettingItemTitle title="Language" />,
    end: <ChevronRightIcon color="gray" />,
    onClick: () => navigate(navigationRoutes.languages),
  };

  const themeItem = {
    id: 'theme-item',
    title: <SettingItemTitle title="Theme" />,
    end: <ChevronRightIcon color="gray" />,
    onClick: () => navigate(navigationRoutes.themes),
  };

  const infiniteApprovalItem = {
    id: 'infinite-approval-item',
    title: <SettingItemTitle title="Infinite Approval" />,
    end: <Switch checked={infiniteApprove} />,
    onClick: toggleInfiniteApprove,
  };

  const settingItems = [bridgeItem, exchangeItem, languageItem];
  if (!singleTheme) {
    settingItems.push(themeItem);
  }
  settingItems.push(infiniteApprovalItem);

  return (
    <Layout
      header={{
        onBack: navigateBackFrom.bind(null, navigationRoutes.settings),
        title: i18n.t('Setting'),
      }}>
      <BaseContainer>
        <Head>
          <SettingItemTitle title="Slippage tolerance per swap" />
          <Divider direction="horizontal" size={4} />
          <InfoIcon color="gray" />
        </Head>
        <SlippageChipsContainer>
          {SLIPPAGES.map((slippageItem, index) => {
            const key = `slippage-${index}`;
            return (
              <>
                <Chip
                  key={key}
                  onClick={() => {
                    if (customSlippage) {
                      setCustomSlippage(null);
                    }
                    setSlippage(slippageItem);
                  }}
                  selected={!customSlippage && slippageItem === slippage}
                  label={`${slippageItem.toString()}%`}
                />
                <Divider direction="horizontal" size={8} />
              </>
            );
          })}
          <TextField
            type="number"
            variant="contained"
            value={customSlippage || ''}
            color="dark"
            onChange={(event) => {
              const parsedValue = parseFloat(event.target.value);
              if (
                !parsedValue ||
                (parsedValue >= MIN_SLIPPGAE && parsedValue <= MAX_SLIPPAGE)
              ) {
                setCustomSlippage(parsedValue);
              }
            }}
            suffix={
              customSlippage && (
                <Typography variant="body" size="small">
                  %
                </Typography>
              )
            }
            size="small"
            placeholder="Custom"
            style={{}}
          />
        </SlippageChipsContainer>
      </BaseContainer>

      <List
        type={<ListItemButton id="_" onClick={() => console.log()} />}
        items={settingItems}
      />
    </Layout>
  );
}
