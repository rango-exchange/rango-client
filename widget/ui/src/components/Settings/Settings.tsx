import { styled } from '../../theme';
import React, { useState } from 'react';
import { AngleRightIcon } from '../Icon';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';
import { Typography } from '../Typography';
import { Chip } from '../Chip';
import { LiquiditySource } from '../../types/meta';

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
  liquiditySources: LiquiditySource[];
  selectedLiquiditySources: LiquiditySource[];
  onSlippageChange: (slippage: string) => void;
}

export function Settings(props: PropTypes) {
  const {
    slippages,
    selectedLiquiditySources,
    liquiditySources,
    onSlippageChange,
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
          {slippages.map(slippage => (
            <Chip
              onClick={changeSlippage.bind(null, slippage)}
              selected={slippage === selectedSlippage}
              label={slippage}
              style={{ marginRight: '8px' }}
            />
          ))}
        </SlippageChipsContainer>
      </SlippageContainer>
      <LiquiditySourceContainer>
        <Typography variant="body1">Liquidity Sources</Typography>
        <LiquiditySourceNumber>
          <Typography variant="body2">{`( ${selectedLiquiditySources.length} / ${liquiditySources.length} )`}</Typography>
          <StyledAngleRight />
        </LiquiditySourceNumber>
      </LiquiditySourceContainer>
    </>
  );

  return (
    <SecondaryPage title="Settings" textField={false} Content={PageContent} />
  );
}
