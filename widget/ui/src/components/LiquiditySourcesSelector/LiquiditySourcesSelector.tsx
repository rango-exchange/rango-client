import React from 'react';
import { containsText } from '../../helpers';
import { styled } from '../../theme';
import { LiquiditySource } from '../../types/meta';
import { Button } from '../Button';
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
  toggleAll: () => void;
  allSelected: boolean;
}
const ActionButton = styled(Button, {
  position: 'absolute',
  right: 0,
});

export function LiquiditySourcesSelector(props: PropTypes) {
  const { list, onChange, onBack, toggleAll, allSelected } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search By Name"
      title="Liquidity Sources"
      TopButton={
        <ActionButton variant="ghost" type="primary" onClick={toggleAll}>
          {allSelected ? 'Clear all' : 'Select all'}
        </ActionButton>
      }
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
