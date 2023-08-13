import type { PropTypes } from './Row.types';

import React from 'react';

import { Image } from '../common';
import { Typography } from '../Typography';

import { Button, Div, Tag, TitleSection } from './Row.styles';

export function Row({
  image,
  title,
  subTitle,
  tag,
  suffix,
  onClick,
}: PropTypes) {
  return (
    <Button onClick={onClick}>
      <Div>
        <Image src={image} size={32} />
        <TitleSection>
          <Div>
            <Typography variant="title" size="medium">
              {title}
            </Typography>
            {tag && (
              <Tag>
                <Typography variant="body" size="xsmall">
                  {tag}
                </Typography>
              </Tag>
            )}
          </Div>
          {subTitle && (
            <Typography variant="body" size="small" color="neutral400">
              {subTitle}
            </Typography>
          )}
        </TitleSection>
      </Div>
      {suffix}
    </Button>
  );
}
