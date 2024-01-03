import { Divider } from '@yeager-dev/ui';
import React, { useState } from 'react';

import { ExportConfigModal } from '../../components/ExportConfigModal';
import { useConfigStore } from '../../store/config';

import {
  HeaderContainer,
  ResetButton,
  StyledButton,
} from './ConfigContainer.styles';

export function Header() {
  const resetConfig = useConfigStore.use.resetConfig();
  const [openExportModal, setOpenExportModal] = useState(false);
  const config = useConfigStore.use.config();

  const toggleModal = () => setOpenExportModal((prev) => !prev);

  return (
    <HeaderContainer>
      <ResetButton
        type="secondary"
        size="medium"
        variant="ghost"
        onClick={resetConfig.bind(null)}>
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
  );
}
