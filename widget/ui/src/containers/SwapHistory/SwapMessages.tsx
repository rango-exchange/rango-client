import React, { useState } from 'react';
import { Alert, Button, Typography } from '../../components';
import { styled } from '../../theme';

const getAlertType = (messageType: PropTypes['type']) => {
  if (!messageType || messageType === 'info') return 'secondary';
  else return messageType;
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
            onClick={setExpandedMessage.bind(null, (prevState) => !prevState)}
          >
            Show more details
          </Button>
        ),
      })}
      {...(!!props.switchNetwork && {
        footer: (
          <Button
            variant={'outlined'}
            type="primary"
            onClick={props.switchNetwork}
          >
            Change network to {currentStepBlockchain}
          </Button>
        ),
      })}
    >
      {!!detailedMessage.content ? (
        <DetailedMessage>
          <Typography variant="body3">
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
            <Typography variant="body3">
              Don't worry, your fund is&nbsp;
            </Typography>
            <SuccessText variant="body3">
              <b>Safe</b>
            </SuccessText>
          </p>

          <p>
            <Typography variant="body3">
              It is converted to &nbsp;
              <u>{lastConvertedTokenInFailedSwap.outputAmount}</u>
              &nbsp;
            </Typography>
            <SuccessText variant="body3">
              <b>{lastConvertedTokenInFailedSwap.symbol}&nbsp;</b>
            </SuccessText>
            <Typography variant="body3">on your&nbsp;</Typography>
            <SuccessText variant="body3">
              <b>{lastConvertedTokenInFailedSwap.blockchain}&nbsp;</b>
            </SuccessText>
            <Typography variant="body3">wallet</Typography>
          </p>
        </>
      )}
    </Alert>
  );
};
