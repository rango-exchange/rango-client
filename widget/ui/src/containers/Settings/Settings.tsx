import { styled } from '../../theme';
import React, { useState } from 'react';
import { i18n } from '@lingui/core';

import { LiquiditySource, LoadingStatus } from '../../types/meta';
import {
  AngleRightIcon,
  Button,
  Chip,
  Radio,
  SecondaryPage,
  Switch,
  TextField,
  Typography,
} from '../../components';

const BaseContainer = styled('div', {
  borderRadius: '$5',
  backgroundColor: '$neutral100',
  padding: '$16',
});

const Title = styled(Typography, { marginBottom: '$16' });

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

const StyledAngleRight = styled(AngleRightIcon, { marginLeft: '$8' });

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
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '$16',
});

type Theme = 'dark' | 'light' | 'auto';

export interface PropTypes {
  slippages: number[];
  selectedSlippage: number;
  customSlippage: number | null;
  maxSlippage: number;
  minSlippage: number;
  liquiditySources: LiquiditySource[];
  onLiquiditySourcesClick: () => void;
  selectedLiquiditySources: LiquiditySource[];
  onSlippageChange: (slippage: number) => void;
  onCustomSlippageChange: (customSlippage: number | null) => void;
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onBack: () => void;
  infiniteApprove: boolean;
  toggleInfiniteApprove: (infinite: boolean) => void;
  loadingStatus: LoadingStatus;
  singleTheme?: boolean;
}

export function Settings(props: PropTypes) {
  const {
    slippages,
    selectedLiquiditySources,
    liquiditySources,
    onSlippageChange,
    onLiquiditySourcesClick,
    onBack,
    customSlippage,
    onCustomSlippageChange,
    maxSlippage,
    minSlippage,
    selectedTheme,
    onThemeChange,
    toggleInfiniteApprove,
    infiniteApprove,
    loadingStatus,
    singleTheme,
  } = props;

  const [selectedSlippage, setSelectedSlippage] = useState(
    props.selectedSlippage
  );

  const changeSlippage = (slippage: number) => {
    setSelectedSlippage(slippage);
    onSlippageChange(slippage);
  };

  const PageContent = (
    <>
      <BaseContainer>
        <Head>
          <Typography variant="body" size="small">
            {i18n.t('Slippage tolerance')}
          </Typography>
          {customSlippage ? (
            <Typography variant="body" size="xsmall" color="error">
              {customSlippage}% {i18n.t('Custom')}
            </Typography>
          ) : undefined}
        </Head>
        <SlippageChipsContainer>
          {slippages.map((slippage, index) => (
            <Chip
              key={index}
              onClick={() => {
                if (customSlippage) onCustomSlippageChange(null);
                changeSlippage(slippage);
              }}
              selected={!customSlippage && slippage === selectedSlippage}
              label={`${slippage.toString()}%`}
              style={{
                marginRight: '8px',
              }}
            />
          ))}
          <TextField
            type="number"
            value={customSlippage || ''}
            onChange={(event) => {
              const parsedValue = parseFloat(event.target.value);
              if (
                !parsedValue ||
                (parsedValue >= minSlippage && parsedValue <= maxSlippage)
              )
                onCustomSlippageChange(parsedValue);
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
          <Title variant="body" size="small">
            {i18n.t('Theme')}
          </Title>
          <Radio
            value={selectedTheme}
            options={[
              { value: 'dark', label: `${i18n.t('Dark')}` },
              { value: 'light', label: `${i18n.t('Light')}` },
              { value: 'auto', label: `${i18n.t('Auto')}` },
            ]}
            onChange={(value) => onThemeChange(value as Theme)}
            direction="horizontal"
            style={{ marginTop: '$24' }}
          />
        </ThemesContainer>
      )}
      <InfiniteContainer>
        <Typography variant="body" size="small">
          {i18n.t('Infinite Approval')}
        </Typography>
        <Switch checked={infiniteApprove} onChange={toggleInfiniteApprove} />
      </InfiniteContainer>
      <LiquiditySourceContainer>
        <Button
          onClick={onLiquiditySourcesClick}
          align="start"
          variant="ghost"
          loading={loadingStatus === 'loading'}
          suffix={
            <LiquiditySourceNumber>
              {loadingStatus === 'success' && (
                <Typography variant="body" size="small" color="neutral800">
                  {liquiditySources.length !== selectedLiquiditySources.length
                    ? `${selectedLiquiditySources.length} / ${liquiditySources.length}`
                    : liquiditySources.length}
                </Typography>
              )}
              {loadingStatus === 'failed' && (
                <Typography variant="body" size="small" color="$error500">
                  Loading failed
                </Typography>
              )}
              <StyledAngleRight />
            </LiquiditySourceNumber>
          }>
          <Typography variant="body" size="small">
            {i18n.t('Liquidity Sources')}
          </Typography>
        </Button>
      </LiquiditySourceContainer>
    </>
  );

  return (
    <SecondaryPage title="Settings" textField={false} onBack={onBack}>
      {PageContent}
    </SecondaryPage>
  );
}
