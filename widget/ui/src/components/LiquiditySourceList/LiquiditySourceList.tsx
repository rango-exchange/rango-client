import type { LiquiditySource, LoadingStatus } from '../../types/meta';
import type { CSSProperties } from '@stitches/react';

import { i18n } from '@lingui/core';
import React, { useEffect, useState } from 'react';

import { styled } from '../../theme';
import { LoadingFailedAlert } from '../Alert/LoadingFailedAlert';
import { NotFoundAlert } from '../Alert/NotFoundAlert';
import { Button } from '../Button/Button';
import { Image } from '../common';
import { Divider } from '../Divider';
import { Spinner } from '../Spinner';
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

const MainContainer = styled('div', {
  variants: {
    loaded: {
      true: {
        overflowY: 'auto',
        padding: '0 $4',
      },
    },
  },
});

const LiquiditySourceType = styled('div', {
  position: 'sticky',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  top: '0',
  backgroundColor: '$background',
  zIndex: '9999',
  paddingTop: '$8',
  paddingBottom: '$8',
});

const LiquidityImageContainer = styled('div', {
  paddingRight: '$16',
});

const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
});

export interface PropTypes {
  list: LiquiditySource[];
  onChange: (liquiditySource: LiquiditySource) => void;
  listContainerStyle?: CSSProperties;
  loadingStatus: LoadingStatus;
  searchedFor: string;
}

export function LiquiditySourceList(props: PropTypes) {
  const { list, onChange, listContainerStyle, loadingStatus, searchedFor } =
    props;

  const [selected, setSelected] = useState(
    list.filter((item) => item.selected)
  );

  const changeLiquiditySources = (clickedItem: LiquiditySource) => {
    clickedItem.selected = !clickedItem.selected;
    setSelected((prevState) => {
      if (clickedItem.selected) {
        return [...prevState, clickedItem];
      }
      return prevState.filter((item) => item.title != clickedItem.title);
    });
    onChange(clickedItem);
  };

  const isSelected = (liquiditySource: LiquiditySource) =>
    !!selected.find((item) => liquiditySource.title === item.title);

  useEffect(() => {
    setSelected(list.filter((item) => item.selected));
  }, [list]);

  const sections = groupLiquiditySources(list);
  const bridges = sections.bridge;
  const exchanges = sections.exchange;

  const totalBridges = bridges.length;
  const totalExchanges = exchanges.length;
  // TODO: This is not performant
  const totalSelectedBridges = bridges.filter(isSelected).length;
  const totalSelectedExchanges = exchanges.filter(isSelected).length;

  return (
    <MainContainer
      style={listContainerStyle}
      loaded={loadingStatus === 'success'}>
      <div>
        <LiquiditySourceType>
          <Typography variant="title" size="xmedium">
            {i18n.t('Bridges')}
          </Typography>
          <Typography variant="body" size="medium" color="neutral600">
            {totalSelectedBridges === totalBridges
              ? totalBridges
              : `${totalSelectedBridges} / ${totalBridges}`}
          </Typography>
        </LiquiditySourceType>
        <Divider size={12} />
        {loadingStatus === 'loading' && (
          <LoaderContainer>
            <Spinner size={24} />
          </LoaderContainer>
        )}
        {loadingStatus === 'failed' && <LoadingFailedAlert />}
        {loadingStatus === 'success' && (
          <>
            {totalBridges ? (
              bridges.map((liquiditySource, index) => {
                const key = `item-${index}`;

                return (
                  <LiquiditySourceItem
                    liquiditySource={liquiditySource}
                    key={key}
                    selected={isSelected(liquiditySource)}
                    onChange={changeLiquiditySources}
                  />
                );
              })
            ) : (
              <NotFoundAlert catergory="Bridge" searchedFor={searchedFor} />
            )}
          </>
        )}
      </div>
      <div>
        <LiquiditySourceType>
          <Typography variant="title" size="xmedium">
            {i18n.t('Exchanges')}
          </Typography>
          <Typography variant="body" size="medium" color="neutral600">
            {totalSelectedExchanges === totalExchanges
              ? totalExchanges
              : `${totalSelectedExchanges} / ${totalExchanges}`}
          </Typography>
        </LiquiditySourceType>
        <Divider size={12} />
        {loadingStatus === 'loading' && (
          <LoaderContainer>
            <Spinner size={24} />
          </LoaderContainer>
        )}
        {loadingStatus === 'failed' && <LoadingFailedAlert />}
        {loadingStatus == 'success' && (
          <>
            {totalExchanges ? (
              exchanges.map((liquiditySource, index) => {
                const key = `item-${index}`;
                return (
                  <LiquiditySourceItem
                    liquiditySource={liquiditySource}
                    key={key}
                    selected={isSelected(liquiditySource)}
                    onChange={changeLiquiditySources}
                  />
                );
              })
            ) : (
              <NotFoundAlert catergory="Exchange" searchedFor={searchedFor} />
            )}
          </>
        )}
      </div>
    </MainContainer>
  );
}
/**
 * @deprecated will be removed in v2
 */
const LiquiditySourceItem = ({
  liquiditySource,
  selected,
  onChange,
}: {
  liquiditySource: LiquiditySource;
  selected: boolean;
  onChange: (clickedItem: LiquiditySource) => void;
}) => (
  <Button
    size="large"
    variant="outlined"
    prefix={
      <LiquidityImageContainer>
        <Image src={liquiditySource.logo} size={20} />
      </LiquidityImageContainer>
    }
    suffix={<Switch checked={selected} />}
    style={{ marginBottom: '12px' }}
    onClick={onChange.bind(null, liquiditySource)}>
    <Typography variant="body" size="medium">
      {liquiditySource.title}
    </Typography>
  </Button>
);
