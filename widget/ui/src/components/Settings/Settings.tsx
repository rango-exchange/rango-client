import { styled } from '../../theme';
import React, { useState } from 'react';
import { AngleRightIcon } from '../Icon';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';
import { Typography } from '../Typography';
import { Chip } from '../Chip';
import { LiquiditySource } from '../../types/meta';
import { TextField } from '../TextField';
import { Radio } from '../Radio';

const BaseContainer = styled('div', {
  borderRadius: '$5',
  backgroundColor: '$neutrals200',
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
  marginTop: '$32',
  cursor: 'pointer',
});

const StyledAngleRight = styled(AngleRightIcon, { marginLeft: '$8' });

const LiquiditySourceNumber = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ThemesContainer = styled(BaseContainer, {
  marginTop: '$32',
});

type Theme = 'dark' | 'light' | 'auto';

export interface PropTypes {
  slippages: number[];
  selectedSlippage: number;
  customSlippage: number;
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
        <Title variant="body1">Slippage tolerance per swap</Title>
        <SlippageChipsContainer>
          {slippages.map((slippage, index) => (
            <Chip
              key={index}
              onClick={() => {
                if (customSlippage) onCustomSlippageChange(null);
                changeSlippage(slippage);
              }}
              selected={!customSlippage && slippage === selectedSlippage}
              label={`${slippage.toString()} %`}
              style={{
                marginRight: '8px',
              }}
            />
          ))}
          <TextField
            type="number"
            value={customSlippage}
            onChange={(event) => {
              const parsedValue = parseFloat(event.target.value);
              if (
                !parsedValue ||
                (parsedValue >= minSlippage && parsedValue <= maxSlippage)
              )
                onCustomSlippageChange(parsedValue);
            }}
            suffix={
              customSlippage && <Typography variant="body2">%</Typography>
            }
            size="small"
            placeholder="Custom"
            style={{
              width: '128px',
              flexGrow: 'initial',
              borderColor: customSlippage ? '$success' : 'initial',
            }}
          />
        </SlippageChipsContainer>
      </BaseContainer>
      <ThemesContainer>
        <Title variant="body2">Theme</Title>
        <Radio
          defaultValue={selectedTheme}
          options={[
            { value: 'dark', label: 'Dark' },
            { value: 'light', label: 'Light' },
            { value: 'auto', label: 'Auto' },
          ]}
          onChange={(value) => onThemeChange(value as Theme)}
          direction="horizontal"
          style={{ marginTop: '$24' }}
        />
      </ThemesContainer>
      <LiquiditySourceContainer onClick={onLiquiditySourcesClick}>
        <Typography variant="body1">Liquidity Sources</Typography>
        <LiquiditySourceNumber>
          <Typography variant="body2">{`( ${selectedLiquiditySources.length} / ${liquiditySources.length} )`}</Typography>
          <StyledAngleRight />
        </LiquiditySourceNumber>
      </LiquiditySourceContainer>
    </>
  );

  return (
    <SecondaryPage title="Settings" textField={false} onBack={onBack}>
      {PageContent}
    </SecondaryPage>
  );
}
