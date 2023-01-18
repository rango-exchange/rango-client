import React from 'react';
import { LiquiditySource } from '../../types/meta';
import LiquiditySourceList from '../LiquiditySourceList';
import SecondaryPage from '../PageWithTextField/SecondaryPage';

export interface PropTypes {
  liquiditySources: LiquiditySource[];
  onSelectedLiquiditySourcesChanged: (liquiditySource: LiquiditySource) => void;
}

function LiquiditySourcesSelector(props: PropTypes) {
  const { liquiditySources, onSelectedLiquiditySourcesChanged } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search By Name"
      title="Liquidity Sources"
      Content={({ searchedText }) => (
        <LiquiditySourceList
          searchedText={searchedText}
          liquiditySources={liquiditySources}
          onLiquiditySourcesChanged={onSelectedLiquiditySourcesChanged}
        />
      )}
    />
  );
}

export default LiquiditySourcesSelector;
