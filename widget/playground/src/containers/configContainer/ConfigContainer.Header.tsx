import { Alert, Divider } from '@rango-dev/ui';
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

const DISPLAY_SUCCESSFUL_RESET_TOAST_DURATION = 2_000;

export function Header() {
  const resetConfig = useConfigStore.use.resetConfig();
  const [openExportModal, setOpenExportModal] = useState(false);
  const config = useConfigStore.use.config();
  const [isReset, setIsReset] = useState(false);

  const toggleModal = () => setOpenExportModal((prev) => !prev);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReset(false);
    }, DISPLAY_SUCCESSFUL_RESET_TOAST_DURATION);

    return () => {
      clearTimeout(timeout);
    };
  }, [isReset]);

  return (
    <>
      <HeaderContainer>
        <ResetButton
          type="secondary"
          size="medium"
          variant="ghost"
          onClick={() => {
            setIsReset(true);
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
      <SuccessfulResetAlertContainer visible={isReset}>
        <Alert
          variant="toast"
          type="success"
          title="The system's configuration data reset successfully"
        />
      </SuccessfulResetAlertContainer>
    </>
  );
}
