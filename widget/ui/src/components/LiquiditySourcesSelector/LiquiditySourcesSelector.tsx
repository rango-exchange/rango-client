import { CSSProperties } from '@stitches/react';
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
  onBack?: () => void;
  hasHeader?: boolean;
  listContainerStyle?: CSSProperties;
}

export function LiquiditySourcesSelector(props: PropTypes) {
  const { list, onChange, onBack, hasHeader, listContainerStyle } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search By Name"
      title="Liquidity Sources"
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
