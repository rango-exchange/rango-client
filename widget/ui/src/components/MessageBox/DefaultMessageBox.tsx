import type { PropTypes } from './MessageBox.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Divider } from '../Divider';
import { Typography } from '../Typography';

import { Container, IconHighlight } from './MessageBox.styles';
import StatusIcon from './StatusIcon';

export function MessageBox(props: PropsWithChildren<PropTypes>) {
  const { type, title, description, children } = props;

  return (
    <Container>
      <IconHighlight type={type}>
        <StatusIcon type={type} />
      </IconHighlight>
      <Divider size={4} />
      <Typography
        color={type === 'loading' ? 'info' : type}
        variant="title"
        size="medium">
        {title}
      </Typography>
      <Divider size={16} />
      <div>
        {typeof description === 'string' ? (
          <Typography color="neutral600" variant="body" size="medium">
            {description}
          </Typography>
        ) : (
          description
        )}
      </div>
      {children}
    </Container>
  );
}
