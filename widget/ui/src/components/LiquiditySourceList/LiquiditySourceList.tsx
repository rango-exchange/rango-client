import { CSSProperties } from '@stitches/react';
import React, { useState } from 'react';
import { styled } from '../../theme';
import { LiquiditySource } from '../../types/meta';
import { Button } from '../Button/Button';
import { Spacer } from '../Spacer';
import { Switch } from '../Switch';
import { Typography } from '../Typography';

const groupLiquiditySources = (
  liquiditySources: LiquiditySource[]
): { [key in 'bridge' | 'exchange']: LiquiditySource[] } => ({
  bridge: liquiditySources.filter(
    (liquiditySource) =>
      liquiditySource.type === 'BRIDGE' || liquiditySource.type === 'AGGREGATOR'
  ),
  exchange: liquiditySources.filter(
    (liquiditySource) => liquiditySource.type === 'DEX'
  ),
});

const LiquiditySourceType = styled(Typography, {
  position: 'sticky',
  top: '0',
  marginTop: '$8',
  marginBottom: '$8',
  backgroundColor: '$background',
  zIndex: '9999',
  paddingTop: '$8',
  paddingBottom: '$8',
});

const LiquidityImage = styled('img', {
  width: '$20',
  maxHeight: '$20',
  marginRight: '$16',
});

export interface PropTypes {
  list: LiquiditySource[];
  onChange: (liquiditySource: LiquiditySource) => void;
  listContainerStyle?: CSSProperties;
}

export function LiquiditySourceList(props: PropTypes) {
  const { list, onChange, listContainerStyle } = props;

  const [selected, setSelected] = useState(
    list.filter((item) => item.selected)
  );

  const changeLiquiditySources = (clickedItem: LiquiditySource) => {
    clickedItem.selected = !clickedItem.selected;
    setSelected((prevState) => {
      if (clickedItem.selected) return [...prevState, clickedItem];
      return prevState.filter((item) => item.title != clickedItem.title);
    });
    setTimeout(() => {
      onChange(clickedItem);
    }, 200);
  };

  const isSelected = (liquiditySource: LiquiditySource) =>
    !!selected.find((item) => liquiditySource.title === item.title);

  return (
    <div style={{ height: '450px', ...listContainerStyle }}>
      <div>
        <LiquiditySourceType variant="h5">Bridges</LiquiditySourceType>
        <Spacer size={16} direction="vertical" />
        {groupLiquiditySources(list).bridge.map((liquiditySource, index) => (
          <LiquiditySourceItem
            liquiditySource={liquiditySource}
            key={index}
            selected={isSelected(liquiditySource)}
            onChange={changeLiquiditySources}
          />
        ))}
      </div>
      <div>
        <LiquiditySourceType variant="h5">Exchanges</LiquiditySourceType>
        <Spacer size={16} direction="vertical" />

        {groupLiquiditySources(list).exchange.map((liquiditySource, index) => (
          <LiquiditySourceItem
            liquiditySource={liquiditySource}
            key={index}
            selected={isSelected(liquiditySource)}
            onChange={changeLiquiditySources}
          />
        ))}
      </div>
    </div>
  );
}

const LiquiditySourceItem = ({
  liquiditySource,
  selected,
  onChange,
}: {
  liquiditySource: LiquiditySource;
  selected: boolean;
  onChange: (clickedItem: LiquiditySource) => void;
}) => {
  return (
    <Button
      size="large"
      align="start"
      variant="outlined"
      prefix={<LiquidityImage src={liquiditySource.logo} />}
      suffix={<Switch checked={selected} />}
      style={{ marginBottom: '12px' }}
      type={selected ? 'primary' : undefined}
      onClick={onChange.bind(null, liquiditySource)}
    >
      <Typography variant="body1">{liquiditySource.title}</Typography>
    </Button>
  );
};
