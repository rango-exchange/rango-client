import type { PropTypes } from './FilterSelector.type';

import { i18n } from '@lingui/core';
import {
  Button,
  Divider,
  ListItemButton,
  Radio,
  RadioRoot,
  Typography,
} from '@arlert-dev/ui';
import React from 'react';

import {
  centeredFlexContainer,
  FilterContainer,
  FilterList,
} from './FilterSelector.style';

export function FilterSelectorContent(props: PropTypes) {
  const { filterBy: value, onClickItem } = props;
  return (
    <FilterContainer>
      <div className={centeredFlexContainer()}>
        <Typography size="small" variant="body">
          {i18n.t('Status')}
        </Typography>
        <Button
          id="widget-filter-selector-reset-btn"
          variant="ghost"
          size="xxsmall"
          onClick={() => onClickItem('')}>
          {i18n.t('Reset')}
        </Button>
      </div>
      <Divider size={10} />
      <RadioRoot value={value}>
        <FilterList>
          {props.list.map((item, index) => {
            return (
              <ListItemButton
                key={item.id}
                className="widget-filter-selector-list-item-btn"
                style={{ height: '40px', width: '100%' }}
                selected={false}
                hasDivider={props.list.length - 1 != index}
                id={item.id}
                title={
                  <>
                    <Divider direction="horizontal" size={4} />
                    <Typography size="medium" variant="body">
                      {item.title}
                    </Typography>
                  </>
                }
                start={<Radio value={item.id} />}
                onClick={onClickItem}
              />
            );
          })}
        </FilterList>
      </RadioRoot>
    </FilterContainer>
  );
}
