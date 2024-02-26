import type {
  ExportConfigModalProps,
  ExportType,
} from './ExportConfigModal.types';

import {
  CloseIcon,
  Divider,
  ExternalLinkIcon,
  KeyIcon,
  Modal,
  ModalHeader,
  Tabs,
  TextField,
  Typography,
} from '@rango-dev/ui';
import React, { useState } from 'react';
import {
  atomDark as dark,
  prism,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import { PLAYGROUND_CONTAINER_ID } from '../../constants';
import { useTheme } from '../../hooks/useTheme';
import { initialConfig, useConfigStore } from '../../store/config';
import { filterConfig, formatConfig } from '../../utils/export';

import { CodeBlock } from './CodeBlock';
import {
  APIKeyInputContainer,
  ExternalLinkIconContainer,
  Head,
  HelpLinksContainer,
  Label,
  Link,
  LinkContainer,
  ModalFlex,
  StyledIconButton,
  TabsContainer,
} from './ExportConfigModal.styles';
import {
  typesOfCodeBlocks,
  typesOfCodeBlocksTabs,
} from './ExportConfigModal.types';

export function ExportConfigModal(props: ExportConfigModalProps) {
  const { open, onClose, config } = props;

  const { activeTheme } = useTheme();
  const [selected, setSelected] = useState<ExportType>('embedded');
  const syntaxHighlighterTheme = activeTheme === 'dark' ? dark : prism;
  const { filteredConfigForExport } = filterConfig(config, initialConfig);
  const formatedConfig = formatConfig(filteredConfigForExport);
  const apiKey = useConfigStore.use.config().apiKey;
  const onChangeApiKey = useConfigStore.use.onChangeApiKey();

  return (
    <Modal
      container={
        document.getElementById(PLAYGROUND_CONTAINER_ID) as HTMLElement
      }
      styles={{
        container: {
          maxWidth: '1109px',
          width: '90%',
          maxHeight: '865px',
          height: '90%',
          padding: '$20',
        },
      }}
      hasWatermark={false}
      header={
        <ModalHeader>
          <Typography variant="headline" size="large">
            Export Code
          </Typography>
          <ModalFlex>
            <StyledIconButton onClick={onClose} variant="ghost">
              <CloseIcon color="gray" size={22} />
            </StyledIconButton>
          </ModalFlex>
        </ModalHeader>
      }
      open={open}
      onClose={onClose}
      title="Export Code"
      anchor="center">
      <Divider size={30} />
      <Head>
        <APIKeyInputContainer>
          <TextField
            size="large"
            variant="contained"
            style={{ background: '$neutral100', borderRadius: '10px' }}
            onChange={(e) => {
              onChangeApiKey(e.target.value);
            }}
            name="apiKey"
            value={apiKey}
            label={
              <Label>
                <KeyIcon /> <Divider direction="horizontal" size={'4'} />
                Replace your key
              </Label>
            }
            labelProps={{
              color: '$neutral600',
              size: 'medium',
              variant: 'label',
            }}
            type="string"
            placeholder="Enter API Key"
          />
        </APIKeyInputContainer>
        <HelpLinksContainer>
          <LinkContainer>
            <Typography variant="title" size="xmedium" color="$neutral700">
              <Link
                href="https://docs.rango.exchange/widget-integration/overview"
                target="_blank">
                <ExternalLinkIconContainer className="icon_container">
                  <ExternalLinkIcon color="gray" size={16} />
                </ExternalLinkIconContainer>
                &nbsp;Full Instructions
              </Link>
            </Typography>
          </LinkContainer>
          <LinkContainer>
            <Typography variant="title" size="xmedium" color="$neutral700">
              <Link
                href="https://github.com/rango-exchange/widget-examples"
                target="_blank">
                <ExternalLinkIconContainer className="icon_container">
                  <ExternalLinkIcon color="gray" size={16} />
                </ExternalLinkIconContainer>
                &nbsp;More Examples
              </Link>
            </Typography>
          </LinkContainer>
        </HelpLinksContainer>
      </Head>
      <Divider size={30} />
      <TabsContainer>
        <Tabs
          items={typesOfCodeBlocksTabs}
          onChange={(item) => setSelected(item.id as ExportType)}
          value={selected}
          type="secondary"
          borderRadius="medium"
        />
      </TabsContainer>
      <Divider size={10} />
      <CodeBlock
        selectedType={selected}
        language={typesOfCodeBlocks[selected].language}
        theme={syntaxHighlighterTheme}>
        {typesOfCodeBlocks[selected].generateCode(formatedConfig)}
      </CodeBlock>
    </Modal>
  );
}
