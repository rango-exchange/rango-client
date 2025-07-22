import type { PropTypes } from './ActivateTabAlert.types';

import { i18n } from '@lingui/core';
import { Alert, Button } from '@arlert-dev/ui';
import React from 'react';

export function ActivateTabAlert(props: PropTypes) {
  return (
    <Alert
      action={
        <Button
          id="widget-active-tab-btn"
          onClick={props.onActivateTab}
          variant="contained"
          size="xxsmall"
          type="warning">
          {i18n.t('Activate this tab')}
        </Button>
      }
      type="warning"
      variant="alarm"
      title={i18n.t('Another tab is open and handles transactions.')}
    />
  );
}
