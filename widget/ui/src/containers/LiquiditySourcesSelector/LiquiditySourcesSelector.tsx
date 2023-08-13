import type { LiquiditySource } from '../../components/LiquiditySourceList/LiquiditySourceList.types';
import type { LoadingStatus } from '../../types/meta';
import type { CSSProperties } from '@stitches/react';

import React from 'react';

import { Button, SecondaryPage } from '../../components';
import { LiquiditySourceList } from '../../components/LiquiditySourceList';
import { containsText } from '../../helper';

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
  hasHeader?: boolean;
  listContainerStyle?: CSSProperties;
  loadingStatus: LoadingStatus;
}

export function LiquiditySourcesSelector(props: PropTypes) {
  const {
    list,
    onChange,
    onBack,
    hasHeader,
    listContainerStyle,
    toggleAll,
    loadingStatus,
  } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search by name"
      title="Liquidity Sources"
      TopButton={
        <Button variant="ghost" type="primary" onClick={toggleAll}>
          {list.find((item) => item.selected) ? 'Deselect all' : 'Select all'}
        </Button>
      }
      hasHeader={hasHeader}
      onBack={onBack}>
      {(searchedFor) => (
        <LiquiditySourceList
          catergory="Bridge"
          listContainerStyle={listContainerStyle}
          list={filterLiquiditySources(list, searchedFor)}
          onChange={onChange}
          loadingStatus={loadingStatus}
          searchedFor={searchedFor}
        />
      )}
    </SecondaryPage>
  );
}
