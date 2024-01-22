import type { PropTypes } from './ActivateTabAlert.types';

import { i18n } from '@lingui/core';
import { Alert, Button } from '@rango-dev/ui';
import React from 'react';

export function ActivateTabAlert(props: PropTypes) {
  return (
    <Alert
      action={
        <Button
          onClick={props.onActivateTab}
          variant="contained"
          size="xxsmall"
          type="warning">
          {i18n.t('Activate')}
        </Button>
      }
      type="warning"
      variant="alarm"
      title={i18n.t(
        'Another tab is open and handles transactions. You can activate this tab.'
      )}
    />
  );
}
