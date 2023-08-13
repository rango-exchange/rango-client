import type { LiquiditySource, PropTypes } from './LiquiditySourceList.types';

import React, { useEffect, useState } from 'react';

import { LoadingFailedAlert } from '../Alert/LoadingFailedAlert';
import { NotFoundAlert } from '../Alert/NotFoundAlert';
import { Checkbox } from '../Checkbox';
import { Row } from '../Row';
import { Spinner } from '../Spinner';

import { LoaderContainer, MainContainer } from './LiquiditySourceList.styles';

export function LiquiditySourceList(props: PropTypes) {
  const {
    list,
    onChange,
    listContainerStyle,
    loadingStatus,
    searchedFor,
    catergory,
  } = props;

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

  return (
    <MainContainer
      style={listContainerStyle}
      loaded={loadingStatus === 'success'}>
      <div>
        {loadingStatus === 'loading' && (
          <LoaderContainer>
            <Spinner size={24} />
          </LoaderContainer>
        )}
        {loadingStatus === 'failed' && <LoadingFailedAlert />}
        {loadingStatus === 'success' && (
          <>
            {list.length ? (
              list.map((liquiditySource, index) => (
                <Row
                  image={liquiditySource.logo}
                  title={liquiditySource.title}
                  suffix={
                    <Checkbox
                      id={`${liquiditySource.title}_${index}`}
                      checked={isSelected(liquiditySource)}
                    />
                  }
                  key={`${liquiditySource.title}-${liquiditySource.type}`}
                  onClick={changeLiquiditySources.bind(null, liquiditySource)}
                />
              ))
            ) : (
              <NotFoundAlert catergory={catergory} searchedFor={searchedFor} />
            )}
          </>
        )}
      </div>
    </MainContainer>
  );
}
