import { Alert, Divider, Typography } from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { ExportConfigModal } from '../../components/ExportConfigModal';
import { useConfigStore } from '../../store/config';
import { isConfigChanged } from '../../utils/configs';

import {
  HeaderContainer,
  ResetButton,
  StyledButton,
  SuccessfulResetAlertContainer,
} from './ConfigContainer.styles';

const TOAST_DURATION = 2_000;

export function Header() {
  const resetConfig = useConfigStore.use.resetConfig();
  const [openExportModal, setOpenExportModal] = useState(false);
  const config = useConfigStore.use.config();
  const [isToastVisible, setIsToastVisible] = useState(false);

  const toggleModal = () => setOpenExportModal((prev) => !prev);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsToastVisible(false);
    }, TOAST_DURATION);

    return () => {
      clearTimeout(timeout);
    };
  }, [isToastVisible]);

  return (
    <>
      <HeaderContainer>
        <ResetButton
          type="secondary"
          size="medium"
          variant="ghost"
          onClick={() => {
            setIsToastVisible(true);
            resetConfig();
          }}
          disabled={!isConfigChanged(config)}>
          Reset Configuration
        </ResetButton>
        <Divider direction="horizontal" size={16} />
        <StyledButton
          type="secondary"
          size="medium"
          variant="contained"
          onClick={toggleModal}>
          Export Code
        </StyledButton>
        <ExportConfigModal
          open={openExportModal}
          onClose={toggleModal}
          config={config}
        />
      </HeaderContainer>
      <SuccessfulResetAlertContainer visible={isToastVisible}>
        <Alert
          type="success"
          containerStyles={{
            backgroundColor: '$background',
            padding: '$10',
            borderRadius: '10px',
            minWidth: '420px',
          }}
          title={
            <Typography color="$neutral700" variant="body" size="medium">
              Your applied configuration has been reset.
            </Typography>
          }
        />
      </SuccessfulResetAlertContainer>
    </>
  );
}
