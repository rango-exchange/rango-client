import React, { useEffect, useState } from 'react';
import { containsText } from '../../helpers';
import { styled } from '../../theme';
import { LiquiditySource } from '../../types/meta';
import Button from '../Button/Button';
import Switch from '../Switch';
import Typography from '../Typography';

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
  searchedText: string;
  liquiditySources: LiquiditySource[];
  onLiquiditySourcesChanged: (liquiditySource: LiquiditySource) => void;
}

function LiquiditySourceList(props: PropTypes) {
  const { searchedText, liquiditySources, onLiquiditySourcesChanged } = props;

  // const [liquiditySources, setLiquiditySources] = useState(
  //   props.liquiditySources
  // );

  const [filteredLiquiditySources, setFilteredLiquiditySources] =
    useState(liquiditySources);

  const changeLiquiditySources = (selectedLiquiditySource: LiquiditySource) => {
    const updatedData: LiquiditySource = {
      ...selectedLiquiditySource,
      selected: !selectedLiquiditySource.selected,
    };
    setFilteredLiquiditySources((prevState) =>
      prevState.map((liquiditySource) => {
        if (liquiditySource.title === selectedLiquiditySource.title)
          return updatedData;
        else return liquiditySource;
      })
    );
    onLiquiditySourcesChanged(updatedData);
  };

  const LiquiditySourceItem = (liquiditySourceInfo: LiquiditySource) => (
    <Button
      size="large"
      align="start"
      variant="outlined"
      prefix={<LiquidityImage src={liquiditySourceInfo.logo} />}
      suffix={<Switch checked={liquiditySourceInfo.selected} />}
      style={{ marginBottom: '8px' }}
      type={liquiditySourceInfo.selected ? 'primary' : undefined}
      onClick={changeLiquiditySources.bind(null, liquiditySourceInfo)}
    >
      <Typography variant="body1">{liquiditySourceInfo.title}</Typography>
    </Button>
  );

  useEffect(() => {
    setFilteredLiquiditySources(
      liquiditySources.filter((liquiditySource) =>
        containsText(liquiditySource.title, searchedText || '')
      )
    );
  }, [searchedText]);

  return (
    <>
      <div>
        <LiquiditySourceType variant="h4">Bridges</LiquiditySourceType>
        {filteredLiquiditySources
          .filter((liquiditySource) => liquiditySource.type === 'bridge')
          .map((liquiditySource) => (
            <LiquiditySourceItem {...liquiditySource} />
          ))}
      </div>
      <div>
        <LiquiditySourceType variant="h4">Exchanges</LiquiditySourceType>
        {filteredLiquiditySources
          .filter((liquiditySource) => liquiditySource.type === 'exchange')
          .map((liquiditySource) => (
            <LiquiditySourceItem {...liquiditySource} />
          ))}
      </div>
    </>
  );
}

export default LiquiditySourceList;
