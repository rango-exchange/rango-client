import { CSSProperties } from '@stitches/react';
import React from 'react';
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
    liquiditySource.title.includes(searchedFor)
  );
export interface PropTypes {
  list: LiquiditySource[];
  onChange: (liquiditySource: LiquiditySource) => void;
  toggleAll?: () => void;
  onBack?: () => void;
  hasHeader?: boolean;
  listContainerStyle?: CSSProperties;
}
const ActionButton = styled(Button, {
  position: 'absolute',
  right: 0,
});

export function LiquiditySourcesSelector(props: PropTypes) {
  const { list, onChange, onBack, hasHeader, listContainerStyle, toggleAll } =
    props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search By Name"
      title="Liquidity Sources"
      TopButton={
        <ActionButton variant="ghost" type="primary" onClick={toggleAll}>
          {list.find((item) => item.selected) ? 'Clear all' : 'Select all'}
        </ActionButton>
      }
      hasHeader={hasHeader}
      onBack={onBack}
      Content={({ searchedFor }) => (
        <LiquiditySourceList
          listContainerStyle={listContainerStyle}
          list={filterLiquiditySources(list, searchedFor)}
          onChange={onChange}
        />
      )}
    />
  );
}
