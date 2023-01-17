import React, { useEffect, useState } from 'react';
import { styled } from '../../theme';
import { LiquiditySource } from '../../types/meta';
import ListItem from '../ListItem';
import Switch from '../Switch';
import Typography from '../Typography';

const LiquiditySourceType = styled(Typography, {
  position: 'sticky',
  top: '0',
  margin: '$4 $0 $2 $0',
  backgroundColor: '$backgroundColor',
  padding: '$4 0',
});

const ListContainer = styled('div', {});

const LiquiditySourceInfo = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& img': {
    width: '$6',
    maxHeight: '$6',
    marginRight: '$4',
  },
});

export interface PropTypes {
  searchedText: string;
  liquiditySources: LiquiditySource[];
}

const LiquiditySourceItem = (liquiditySourceInfo: LiquiditySource) => (
  <ListItem style={{ margin: '.5rem 0' }}>
    <LiquiditySourceInfo>
      <img src={liquiditySourceInfo.logo} />
      <Typography variant="body1">{liquiditySourceInfo.title}</Typography>
    </LiquiditySourceInfo>
    <Switch />
  </ListItem>
);
function LiquiditySourceList(props: PropTypes) {
  const { searchedText, liquiditySources } = props;
  const [filteredLiquiditySources, setFilteredLiquiditySources] =
    useState(liquiditySources);

  useEffect(() => {
    setFilteredLiquiditySources(
      liquiditySources.filter((liquiditySource) =>
        liquiditySource.title.toLowerCase().includes(searchedText.toLowerCase())
      )
    );
  }, [searchedText]);

  return (
    <>
      <ListContainer>
        <LiquiditySourceType variant="h4">Bridges</LiquiditySourceType>
        {filteredLiquiditySources
          .filter((liquiditySource) => liquiditySource.type === 'bridge')
          .map((liquiditySource) => (
            <LiquiditySourceItem {...liquiditySource} />
          ))}
      </ListContainer>
      <ListContainer>
        <LiquiditySourceType variant="h4">Exchanges</LiquiditySourceType>
        {filteredLiquiditySources
          .filter((liquiditySource) => liquiditySource.type === 'exchange')
          .map((liquiditySource) => (
            <LiquiditySourceItem {...liquiditySource} />
          ))}
      </ListContainer>
    </>
  );
}

export default LiquiditySourceList;
