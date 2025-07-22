import type { FailedAlertsProps } from './SwapDetailsAlerts.types';

import { Alert, ChevronDownIcon, IconButton } from '@arlert-dev/ui';
import React, { useState } from 'react';

import { MessageText } from '../SwapDetails/SwapDetails.styles';

import { ActionIcon, AlertFooter } from './SwapDetailsAlerts.styles';

export function FailedAlert(props: FailedAlertsProps) {
  const { message } = props;
  const [showContentError, setShowContentError] = useState(false);

  return (
    <Alert
      id="widget-failed-swap-details-alert"
      type="error"
      title={message.shortMessage}
      containerStyles={{
        '& .footer': {
          paddingTop: '$0',
        },
      }}
      action={
        message.detailedMessage.content && (
          <IconButton
            id="widget-swap-details-failed-btn"
            onClick={() => setShowContentError((prev) => !prev)}
            variant="ghost"
            size="xsmall">
            <ActionIcon rotated={showContentError}>
              <ChevronDownIcon size={12} color="gray" />
            </ActionIcon>
          </IconButton>
        )
      }
      footer={
        <AlertFooter open={showContentError}>
          <MessageText variant="body" size="xsmall" color="neutral700">
            {message.detailedMessage.content}
          </MessageText>
        </AlertFooter>
      }
    />
  );
}
