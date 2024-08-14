import type { PropTypes } from './MessageBox.types.js';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Divider } from '../Divider/index.js';
import { Typography } from '../Typography/index.js';

import { Container, Description, IconHighlight } from './MessageBox.styles.js';
import StatusIcon from './StatusIcon.js';

export function MessageBox(props: PropsWithChildren<PropTypes>) {
  const { type, title, description, children, icon } = props;

  return (
    <Container>
      <IconHighlight type={type}>
        {icon || <StatusIcon type={type} />}
      </IconHighlight>
      <Divider size={4} />
      <Typography
        color={type === 'loading' ? 'info500' : `${type}500`}
        variant="title"
        size="medium">
        {title}
      </Typography>
      <Divider size={16} />
      <Description>
        {typeof description === 'string' ? (
          <Typography color="neutral700" variant="body" size="medium">
            {description}
          </Typography>
        ) : (
          description
        )}
      </Description>
      {children}
    </Container>
  );
}
