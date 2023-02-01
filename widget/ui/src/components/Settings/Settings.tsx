import { styled } from '../../theme';
import React, { useState } from 'react';
import { AngleRightIcon } from '../Icon';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';
import { Typography } from '../Typography';
import { Chip } from '../Chip';
import { LiquiditySource } from '../../types/meta';
import { TextField } from '../TextField';

const SlippageContainer = styled('div', {
  borderRadius: '$5',
  backgroundColor: '$neutrals200',
  padding: '$16',
});

const SlippageChipsContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  marginTop: '$16',
});

const LiquiditySourceContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: '$5',
  backgroundColor: '$neutrals200',
  padding: '$16',
  marginTop: '$32',
});

const StyledAngleRight = styled(AngleRightIcon, { marginLeft: '8px' });

const LiquiditySourceNumber = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

export interface PropTypes {
  slippages: string[];
  selectedSlippage: string;
  customSlippage: string;
  maxSlippage: string;
  minSlippage: string;
  liquiditySources: LiquiditySource[];
  onLiquiditySourcesClick: () => void;
  selectedLiquiditySources: LiquiditySource[];
  onSlippageChange: (slippage: string) => void;
  onCustomSlippageChange: (customSlippage: string) => void;
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
  } = props;

  const [selectedSlippage, setSelectedSlippage] = useState(
    props.selectedSlippage
  );

  const changeSlippage = (slippage: string) => {
    setSelectedSlippage(slippage);
    onSlippageChange(slippage);
  };

  const PageContent = (
    <>
      <SlippageContainer>
        <Typography variant="body1">Slippage tolerance per Swap</Typography>
        <SlippageChipsContainer>
          {slippages.map((slippage, index) => (
            <Chip
              key={index}
              onClick={changeSlippage.bind(null, slippage)}
              selected={!customSlippage && slippage === selectedSlippage}
              label={slippage}
              style={{
                marginRight: '8px',
              }}
            />
          ))}
          <TextField
            type="number"
            value={customSlippage}
            onChange={event => {
              if (
                !event.target.value ||
                (event.target.value >= minSlippage &&
                  maxSlippage >= event.target.value)
              )
                onCustomSlippageChange(event.target.value);
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
      </SlippageContainer>
      <LiquiditySourceContainer>
        <Typography variant="body1">Liquidity Sources</Typography>
        <LiquiditySourceNumber onClick={onLiquiditySourcesClick}>
          <Typography variant="body2">{`( ${selectedLiquiditySources.length} / ${liquiditySources.length} )`}</Typography>
          <StyledAngleRight />
        </LiquiditySourceNumber>
      </LiquiditySourceContainer>
    </>
  );

  return (
    <SecondaryPage
      title="Settings"
      textField={false}
      Content={PageContent}
      onBack={onBack}
    />
  );
}
