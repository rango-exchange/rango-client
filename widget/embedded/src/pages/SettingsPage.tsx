import { i18n } from '@lingui/core';
import {
  Button,
  ChevronRightIcon,
  Chip,
  Divider,
  InfoIcon,
  Radio,
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
  MAX_SLIPPAGE as maxSlippage,
  MIN_SLIPPGAE as minSlippage,
  SLIPPAGES as slippages,
} from '../constants/swapSettings';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { removeDuplicateFrom } from '../utils/common';

const BaseContainer = styled('div', {
  borderRadius: '$xs',
  backgroundColor: '$neutral100',
  padding: '$16',
});

const SlippageChipsContainer = styled('div', {
  display: 'grid',
  rowGap: '$16',
  gridTemplateColumns: 'repeat(auto-fill, 64px)',
});

const LiquiditySourceContainer = styled(BaseContainer, {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '$16',
  cursor: 'pointer',
});
const InfiniteContainer = styled(BaseContainer, {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '$16',
});

const LiquiditySourceNumber = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ThemesContainer = styled(BaseContainer, {
  marginTop: '$16',
});

const Head = styled('div', {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  paddingBottom: '$16',
});

type Theme = 'dark' | 'light' | 'auto';

interface PropTypes {
  supportedSwappers?: string[];
  singleTheme?: boolean;
}

export function SettingsPage({ supportedSwappers, singleTheme }: PropTypes) {
  const slippage = useSettingsStore.use.slippage();
  const setSlippage = useSettingsStore.use.setSlippage();
  const disabledLiquiditySources =
    useSettingsStore.use.disabledLiquiditySources();
  const customSlippage = useSettingsStore.use.customSlippage();
  const setCustomSlippage = useSettingsStore.use.setCustomSlippage();
  const theme = useSettingsStore.use.theme();
  const setTheme = useSettingsStore.use.setTheme();
  const swappers = useMetaStore.use.meta().swappers;
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();

  const infiniteApprove = useSettingsStore.use.infiniteApprove();
  const toggleInfiniteApprove = useSettingsStore.use.toggleInfiniteApprove();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();

  const uniqueSwappersGroups: Array<{
    title: string;
    logo: string;
    type: 'BRIDGE' | 'AGGREGATOR' | 'DEX';
    selected: boolean;
  }> = [];
  removeDuplicateFrom(swappers.map((s) => s.swapperGroup))
    .map((swapperGroup) => {
      return swappers.find((s) => s.swapperGroup === swapperGroup);
    })
    .find((s) => {
      if (s) {
        for (const type of s.types) {
          uniqueSwappersGroups.push({
            title: s.swapperGroup,
            logo: s.logo,
            type,
            selected: !disabledLiquiditySources.includes(s.swapperGroup),
          });
        }
      }
    });
  supportedSwappers &&
    uniqueSwappersGroups.filter(
      (item) => supportedSwappers.filter((s) => s === item.title).length > 0
    );

  const supportedUniqueSwappersGroups = supportedSwappers
    ? uniqueSwappersGroups.filter(
        (item) => supportedSwappers.filter((s) => s === item.title).length > 0
      )
    : uniqueSwappersGroups;

  const selectedLiquiditySources = supportedUniqueSwappersGroups.filter(
    (s) => s.selected
  );

  return (
    <Layout
      header={{
        onBack: navigateBackFrom.bind(null, navigationRoutes.settings),
        title: i18n.t('Setting'),
      }}>
      <BaseContainer>
        <Head>
          <Typography variant="title" size="medium" color="neutral900">
            {i18n.t('Slippage tolerance per swap')}
          </Typography>
          <Divider direction="horizontal" size={4} />
          <InfoIcon color="gray" />
        </Head>
        <SlippageChipsContainer>
          {slippages.map((slippageItem, index) => {
            const key = `slippage-${index}`;
            return (
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
            );
          })}
          <TextField
            type="number"
            value={customSlippage || ''}
            onChange={(event) => {
              const parsedValue = parseFloat(event.target.value);
              if (
                !parsedValue ||
                (parsedValue >= minSlippage && parsedValue <= maxSlippage)
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
            placeholder="Custom %"
            style={{
              width: '128px',
              flexGrow: 'initial',
            }}
          />
        </SlippageChipsContainer>
      </BaseContainer>
      {!singleTheme && (
        <ThemesContainer>
          <Typography variant="body" size="small">
            {i18n.t('Theme')}
          </Typography>
          <Radio
            value={theme}
            options={[
              { value: 'dark', label: `${i18n.t('Dark')}` },
              { value: 'light', label: `${i18n.t('Light')}` },
              { value: 'auto', label: `${i18n.t('Auto')}` },
            ]}
            onChange={(value) => setTheme(value as Theme)}
            direction="horizontal"
            style={{ marginTop: '$24' }}
          />
        </ThemesContainer>
      )}
      <LiquiditySourceContainer>
        <Button
          onClick={() => navigate(navigationRoutes.liquiditySources)}
          align="start"
          variant="ghost"
          loading={loadingMetaStatus === 'loading'}
          suffix={
            <LiquiditySourceNumber>
              {loadingMetaStatus === 'success' && (
                <Typography variant="body" size="small" color="neutral800">
                  {supportedUniqueSwappersGroups.length !==
                  selectedLiquiditySources.length
                    ? `${selectedLiquiditySources.length} / ${supportedUniqueSwappersGroups.length}`
                    : supportedUniqueSwappersGroups.length}
                </Typography>
              )}
              {loadingMetaStatus === 'failed' && (
                <Typography variant="body" size="small" color="$error500">
                  Loading failed
                </Typography>
              )}
              <Divider direction="horizontal" size={8} />
              <ChevronRightIcon color="gray" />
            </LiquiditySourceNumber>
          }>
          <Typography variant="body" size="small">
            {i18n.t('Liquidity Sources')}
          </Typography>
        </Button>
      </LiquiditySourceContainer>

      <InfiniteContainer>
        <Typography variant="title" size="medium">
          {i18n.t('Infinite Approval')}
        </Typography>
        <Switch checked={infiniteApprove} onChange={toggleInfiniteApprove} />
      </InfiniteContainer>
    </Layout>
  );
}
