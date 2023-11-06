import type { PropTypes } from './Collapse.types';
import type { PropsWithChildren } from 'react';

import { ChevronDownIcon, ChevronUpIcon, Typography } from '@rango-dev/ui';
import React from 'react';

import {
  CollapseContainer,
  CollapseContent,
  CollapseHeader,
} from './Collapse.styles';

export function Collapse(props: PropsWithChildren<PropTypes>) {
  const { title, children, open, toggle } = props;
  return (
    <CollapseContainer
      open={open}
      onOpenChange={toggle}
      trigger={
        <CollapseHeader className="collapse_header">
          <Typography size="medium" variant="title">
            {title}
          </Typography>
          {open ? (
            <ChevronUpIcon size={10} color="gray" />
          ) : (
            <ChevronDownIcon size={10} color="gray" />
          )}
        </CollapseHeader>
      }>
      <CollapseContent>{children}</CollapseContent>
    </CollapseContainer>
  );
}
