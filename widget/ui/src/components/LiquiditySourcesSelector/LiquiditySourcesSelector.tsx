import React from 'react';
import { LiquiditySource } from '../../types/meta';
import LiquiditySourceList from '../LiquiditySourceList';
import PageWithTextField from '../PageWithTextField';

export interface PropTypes {
  liquiditySources: LiquiditySource[];
}

function LiquiditySourcesSelector(props: PropTypes) {
  const { liquiditySources } = props;

  return (
    <PageWithTextField
      textFieldPlaceholder="Search By Name"
      title="Liquidity Sources"
      Content={({ searchedText }) => (
        <LiquiditySourceList
          searchedText={searchedText}
          liquiditySources={liquiditySources}
        />
      )}
    />
  );
}

export default LiquiditySourcesSelector;
