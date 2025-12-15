import type { PropTypes } from './CampaignQuoteTag.types.js';

import React from 'react';

import { Tooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import { getLabelStyles, TagContainer } from './CampaignQuoteTag.styles.js';

export const CampaignQuoteTag = (props: PropTypes) => {
  const {
    routeTag: { label },
    iconUrl,
    backgroundUrl,
    linkUrl,
    title,
  } = props;

  return (
    <Tooltip content={title}>
      <TagContainer
        href={linkUrl}
        target="_blank"
        css={{ backgroundImage: `url(${backgroundUrl})` }}>
        <img src={iconUrl} />
        <Typography variant="body" size="small" className={getLabelStyles()}>
          {label}
        </Typography>
      </TagContainer>
    </Tooltip>
  );
};
