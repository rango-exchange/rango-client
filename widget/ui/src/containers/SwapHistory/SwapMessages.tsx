/* eslint-disable @typescript-eslint/no-magic-numbers */
import React, { useState } from 'react';

import { Alert, Button, Typography } from '../../components';
import { styled } from '../../theme';

const getAlertType = (messageType: PropTypes['type']) => {
  if (!messageType || messageType === 'info') {
    return 'info';
  }
  return messageType;
};

const DetailedMessage = styled('div', {
  width: '90%',
  overflowWrap: 'break-word',
  color: '$error500 !important',
});

export type PropTypes = {
  currentStepBlockchain: string;
  switchNetwork?: () => Promise<any>;
  shortMessage: string;
  detailedMessage: { content: string; long: boolean };
  type?: 'success' | 'error' | 'warning' | 'info';
  lastConvertedTokenInFailedSwap?: {
    symbol: string;
    blockchain: string;
    outputAmount: string;
  };
};

const SuccessText = styled(Typography, {
  color: '$success500 !important',
});

export const SwapMessages: React.FC<PropTypes> = (props) => {
  const {
    shortMessage,
    detailedMessage,
    currentStepBlockchain,
    type,
    lastConvertedTokenInFailedSwap,
  } = props;

  const [expandedMessage, setExpandedMessage] = useState(false);

  const allowedNumberOfChars = detailedMessage.long ? 0 : 150;

  const shouldShowMoreDetailsButton =
    !expandedMessage && detailedMessage.content.length > allowedNumberOfChars;

  return (
    <Alert
      type={getAlertType(type)}
      title={shortMessage}
      {...(shouldShowMoreDetailsButton && {
        footer: (
          <Button
            variant="outlined"
            type="primary"
            onClick={setExpandedMessage.bind(null, (prevState) => !prevState)}>
            Show more details
          </Button>
        ),
      })}
      {...(!!props.switchNetwork && {
        footer: (
          <Button
            variant={'outlined'}
            type="primary"
            onClick={() => {
              props?.switchNetwork &&
                props.switchNetwork().catch((e) => {
                  console.log(e);
                });
            }}>
            Change network to {currentStepBlockchain}
          </Button>
        ),
      })}>
      {!!detailedMessage.content ? (
        <DetailedMessage>
          <Typography variant="body" size="small">
            {shouldShowMoreDetailsButton && !expandedMessage
              ? detailedMessage.content.substring(0, allowedNumberOfChars) +
                (allowedNumberOfChars > 0 ? '...' : '')
              : detailedMessage.content}
          </Typography>
        </DetailedMessage>
      ) : null}
      {!!lastConvertedTokenInFailedSwap && (
        <>
          <p>
            <Typography variant="body" size="small">
              Do not worry, your fund is&nbsp;
            </Typography>
            <SuccessText variant="body" size="small">
              <b>Safe</b>
            </SuccessText>
          </p>

          <p>
            <Typography variant="body" size="small">
              It is converted to &nbsp;
              <u>{lastConvertedTokenInFailedSwap.outputAmount}</u>
              &nbsp;
            </Typography>
            <SuccessText variant="body" size="small">
              <b>{lastConvertedTokenInFailedSwap.symbol}&nbsp;</b>
            </SuccessText>
            <Typography variant="body" size="small">
              on your&nbsp;
            </Typography>
            <SuccessText variant="body" size="small">
              <b>{lastConvertedTokenInFailedSwap.blockchain}&nbsp;</b>
            </SuccessText>
            <Typography variant="body" size="small">
              wallet
            </Typography>
          </p>
        </>
      )}
    </Alert>
  );
};
