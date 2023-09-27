import type { FailedAlertsProps } from './SwapDetailsAlerts.types';

import {
  Alert,
  ChevronDownIcon,
  ChevronUpIcon,
  IconButton,
} from '@rango-dev/ui';
import React, { useState } from 'react';

export function FailedAlert(props: FailedAlertsProps) {
  const { message } = props;
  const [showContentError, setShowContentError] = useState(false);

  return (
    <Alert
      type="error"
      title={message.shortMessage}
      action={
        message.detailedMessage.content && (
          <IconButton
            onClick={() => setShowContentError((prev) => !prev)}
            variant="ghost"
            size="xsmall">
            {showContentError ? (
              <ChevronUpIcon size={12} color="gray" />
            ) : (
              <ChevronDownIcon size={12} color="gray" />
            )}
          </IconButton>
        )
      }
      footer={showContentError ? message.detailedMessage.content : undefined}
    />
  );
}
