import React, { useState } from 'react';
import { containsText } from '../../helpers';
import { LiquiditySource } from '../../types/meta';
import LiquiditySourceList from '../LiquiditySourceList';
import SecondaryPage from '../PageWithTextField/SecondaryPage';

const filterLiquiditySources = (
  liquiditySources: LiquiditySource[],
  searchedFor: string
) =>
  liquiditySources.filter((liquiditySource) =>
    containsText(liquiditySource.title, searchedFor || '')
  );
export interface PropTypes {
  list: LiquiditySource[];
  onChange: (liquiditySource: LiquiditySource) => void;
}

function LiquiditySourcesSelector(props: PropTypes) {
  const { list, onChange } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search By Name"
      title="Liquidity Sources"
      Content={({ searchedFor }) => (
        <LiquiditySourceList
          list={filterLiquiditySources(list, searchedFor)}
          onChange={onChange}
        />
      )}
    />
  );
}

export default LiquiditySourcesSelector;
