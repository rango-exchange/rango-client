import React, { useState } from 'react';
import { styled } from '../../theme';
import { LiquiditySource } from '../../types/meta';
import Button from '../Button/Button';
import Switch from '../Switch';
import Typography from '../Typography';

const groupLiquiditySources = (
  liquiditySources: LiquiditySource[]
): { [key in LiquiditySource['type']]: LiquiditySource[] } => ({
  bridge: liquiditySources.filter(
    (liquiditySource) => liquiditySource.type === 'bridge'
  ),
  exchange: liquiditySources.filter(
    (liquiditySource) => liquiditySource.type === 'exchange'
  ),
});

const LiquiditySourceType = styled(Typography, {
  position: 'sticky',
  top: '0',
  marginTop: '$16',
  marginBottom: '$8',
  backgroundColor: '$background',
  zIndex: '9999',
  paddingTop: '$16',
  paddingBottom: '$16',
});

const LiquidityImage = styled('img', {
  width: '$20',
  maxHeight: '$20',
  marginRight: '$16',
});

export interface PropTypes {
  list: LiquiditySource[];
  onChange: (liquiditySource: LiquiditySource) => void;
}

function LiquiditySourceList(props: PropTypes) {
  const { list, onChange } = props;

  const [selected, setSelected] = useState(
    list.filter((item) => item.selected)
  );

  const changeLiquiditySources = (clickedItem: LiquiditySource) => {
    clickedItem.selected = !clickedItem.selected;
    setSelected((prevState) => {
      console.log(clickedItem.selected, clickedItem.title);
      if (clickedItem.selected) return [...prevState, clickedItem];
      return prevState.filter((item) => item.title != clickedItem.title);
    });
    onChange(clickedItem);
  };

  const LiquiditySourceItem = ({
    liquiditySource,
    selected,
  }: {
    liquiditySource: LiquiditySource;
    selected: boolean;
  }) => {
    console.log(selected);
    return (
      <Button
        size="large"
        align="start"
        variant="outlined"
        prefix={<LiquidityImage src={liquiditySource.logo} />}
        suffix={<Switch checked={selected} />}
        style={{ marginBottom: '8px' }}
        type={selected ? 'primary' : undefined}
        onClick={changeLiquiditySources.bind(null, liquiditySource)}
      >
        <Typography variant="body1">{liquiditySource.title}</Typography>
      </Button>
    );
  };

  const isSelected = (liquiditySource: LiquiditySource) => {
    const a = !!selected.find((item) => liquiditySource.title === item.title);
    console.log(a);
    return a;
  };

  return (
    <>
      <div>
        <LiquiditySourceType variant="h4">Bridges</LiquiditySourceType>
        {groupLiquiditySources(list).bridge.map((liquiditySource, index) => (
          <LiquiditySourceItem
            liquiditySource={liquiditySource}
            key={index}
            selected={isSelected(liquiditySource)}
          />
        ))}
      </div>
      <div>
        <LiquiditySourceType variant="h4">Exchanges</LiquiditySourceType>
        {groupLiquiditySources(list).exchange.map((liquiditySource, index) => (
          <LiquiditySourceItem
            liquiditySource={liquiditySource}
            key={index}
            selected={isSelected(liquiditySource)}
          />
        ))}
      </div>
    </>
  );
}

export default LiquiditySourceList;
