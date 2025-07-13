import type { RequestIdProps } from './SwapDetails.types';

import { i18n } from '@lingui/core';
import {
  CopyIcon,
  DoneIcon,
  IconButton,
  RangoExplorerIcon,
  Tooltip,
  Typography,
  useCopyToClipboard,
} from '@rango-dev/ui';
import React from 'react';

import { SCANNER_BASE_URL } from '../../constants';
import { getContainer } from '../../utils/common';

import { RESET_INTERVAL } from './SwapDetails.helpers';
import {
  RequestIdContainer,
  requestIdStyles,
  rowStyles,
  StyledLink,
} from './SwapDetails.styles';

export function RequestIdRow(props: RequestIdProps) {
  const { requestId } = props;
  const [isCopied, handleCopy] = useCopyToClipboard(RESET_INTERVAL);

  return (
    <RequestIdContainer className={rowStyles()}>
      <Typography variant="label" size="large" color="neutral700">
        {i18n.t('Request ID')}
      </Typography>
      <div className={requestIdStyles()}>
        <Typography variant="label" size="small" color="neutral700">
          {requestId}
        </Typography>
        <Tooltip
          container={getContainer()}
          content={
            isCopied ? i18n.t('Copied To Clipboard') : i18n.t('Copy Request ID')
          }
          open={isCopied || undefined}
          side="bottom"
          alignOffset={-16}
          align="end">
          <IconButton
            id="widget-swap-details-done-copy-icon-btn"
            variant="ghost"
            onClick={handleCopy.bind(null, requestId || '')}>
            {isCopied ? (
              <DoneIcon size={16} color="secondary" />
            ) : (
              <CopyIcon size={16} color="gray" />
            )}
          </IconButton>
        </Tooltip>

        <StyledLink
          target="_blank"
          href={`${SCANNER_BASE_URL}/swap/${requestId}`}>
          <Tooltip
            container={getContainer()}
            content={i18n.t('View on Rango Explorer')}
            side="bottom">
            <RangoExplorerIcon size={20} />
          </Tooltip>
        </StyledLink>
      </div>
    </RequestIdContainer>
  );
}
