import { styled } from '../../theme';
import React, { useState } from 'react';
import { AngleRight } from '../Icon';
import SecondaryPage from '../PageWithTextField/SecondaryPage';
import Typography from '../Typography';
import Chip from '../Chip';

const Container = styled('div', {});

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

const StyledAngleRight = styled(AngleRight, { marginLeft: '8px' });

const LiquiditySourceNumber = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

export interface PropTypes {
  slippages: string[];
  selectedSlippage: string;
  totalLiquiditySources: number;
  selectedLiquiditySources: number;
  onSlippageChanged: (slippage: string) => void;
}

function Settings(props: PropTypes) {
  const {
    slippages,
    selectedLiquiditySources,
    totalLiquiditySources,
    onSlippageChanged,
  } = props;

  const [selectedSlippage, setSelectedSlippage] = useState(
    props.selectedSlippage
  );

  const changeSlippage = (slippage: string) => {
    setSelectedSlippage(slippage);
    onSlippageChanged(slippage);
  };

  const PageContent = (
    <Container>
      <SlippageContainer>
        <Typography variant="body1">Slippage tolerance per Swap</Typography>
        <SlippageChipsContainer>
          {slippages.map((slippage) => (
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
          <Typography variant="body2">{`( ${selectedLiquiditySources} / ${totalLiquiditySources} )`}</Typography>
          <StyledAngleRight />
        </LiquiditySourceNumber>
      </LiquiditySourceContainer>
    </Container>
  );

  return (
    <SecondaryPage title="Settings" textField={false} Content={PageContent} />
  );
}

export default Settings;
