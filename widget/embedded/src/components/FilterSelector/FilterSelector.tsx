import type { FilterSelectorPropTypes } from './FilterSelector.type';

import { FilterIcon, Popover } from '@arlert-dev/ui';
import React from 'react';

import { getContainer } from '../../utils/common';

import { Badge, FilterButton, IconContainer } from './FilterSelector.style';
import { FilterSelectorContent } from './FilterSelectorContent';

export function FilterSelector(props: FilterSelectorPropTypes) {
  const { onClickItem, onOpenChange, filterBy, list, open } = props;
  return (
    <div>
      <Popover
        open={open}
        align="end"
        onOpenChange={onOpenChange}
        container={getContainer()}
        content={
          <FilterSelectorContent
            list={list}
            filterBy={filterBy}
            onClickItem={(id) => {
              onClickItem(id);
              onOpenChange(false);
            }}
          />
        }>
        <FilterButton
          id="widget-filter-selector-filter-icon-btn"
          variant="default"
          isSelect={!!filterBy}
          onClick={() => onOpenChange(!props.open)}>
          <IconContainer isSelect={!!filterBy}>
            <FilterIcon size={16} color="black" />
            {!!filterBy && <Badge />}
          </IconContainer>
        </FilterButton>
      </Popover>
    </div>
  );
}
