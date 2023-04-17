import { CSSProperties } from '@stitches/react';
import React from 'react';
import { containsText } from '../../helper';
import { LiquiditySource, LoadingStatus } from '../../types/meta';
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
      textFieldPlaceholder="Search By Name"
      title="Liquidity Sources"
      TopButton={
        <Button variant="ghost" type="primary" onClick={toggleAll}>
          {list.find((item) => item.selected) ? 'Deselect all' : 'Select all'}
        </Button>
      }
      hasHeader={hasHeader}
      onBack={onBack}
    >
      {(searchedFor) => (
        <LiquiditySourceList
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
