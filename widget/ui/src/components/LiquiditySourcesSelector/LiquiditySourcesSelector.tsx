import React from 'react';
import { containsText } from '../../helpers';
import { LiquiditySource } from '../../types/meta';
import { LiquiditySourceList } from '../LiquiditySourceList';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';

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
  onBack: () => void;
  actionButton?: React.ReactNode;
}

export function LiquiditySourcesSelector(props: PropTypes) {
  const { list, onChange, onBack, actionButton } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search By Name"
      title="Liquidity Sources"
      TopButton={actionButton}
      onBack={onBack}
      Content={({ searchedFor }) => (
        <LiquiditySourceList
          list={filterLiquiditySources(list, searchedFor)}
          onChange={onChange}
        />
      )}
    />
  );
}
