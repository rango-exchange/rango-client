import { CSSProperties } from '@stitches/react';
import React from 'react';
import { containsText } from '../../helper';
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
  toggleAll?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  hasHeader?: boolean;
  listContainerStyle?: CSSProperties;
}
const ActionButton = styled(Button, {
  position: 'absolute',
  right: 0,
});

export function LiquiditySourcesSelector(props: PropTypes) {
  const {
    list,
    onChange,
    onClose,
    onBack,
    hasHeader,
    listContainerStyle,
    toggleAll,
  } = props;

  return (
    <SecondaryPage
      hasSearch={true}
      searchPlaceholder="Search By Name"
      title="Liquidity Sources"
      onClose={onClose}
      action={
        <ActionButton variant="ghost" type="primary" onClick={toggleAll}>
          {list.find((item) => item.selected) ? 'Clear all' : 'Select all'}
        </ActionButton>
      }
      hasHeader={hasHeader}
      onBack={onBack}
    >
      {(searchedFor) => (
        <LiquiditySourceList
          listContainerStyle={listContainerStyle}
          list={filterLiquiditySources(list, searchedFor)}
          onChange={onChange}
        />
      )}
    </SecondaryPage>
  );
}
