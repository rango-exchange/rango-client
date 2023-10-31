import type {
  ExportConfigModalProps,
  ExportType,
} from './ExportConfigModal.types';

import {
  CloseIcon,
  Divider,
  ExternalLinkIcon,
  Modal,
  ModalHeader,
  TextField,
  Typography,
} from '@rango-dev/ui';
import React, { Fragment, useState } from 'react';
import {
  atomDark as dark,
  prism,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import { filterConfig, formatConfig } from '../../helpers';
import { useTheme } from '../../hooks/useTheme';
import { initialConfig, useConfigStore } from '../../store/config';

import { CodeBlock } from './CodeBlock';
import {
  APIKeyInputContainer,
  ButtonsContainer,
  ExternalLinkIconContainer,
  Head,
  HelpLinksContainer,
  Link,
  LinkContainer,
  ModalFlex,
  StyledButton,
  StyledIconButton,
} from './ExportConfigModal.styles';
import { typesOfCodeBlocks } from './ExportConfigModal.types';

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
      containerStyle={{
        maxWidth: '1109px',
        width: '90%',
        maxHeight: '865px',
        height: '90%',
        padding: '$20',
      }}
      hasLogo={false}
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
      <Divider size={32} />
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
            label="Replace your key"
            type="string"
            placeholder="Enter API Key"
          />
        </APIKeyInputContainer>
        <HelpLinksContainer>
          <LinkContainer>
            <Typography variant="title" size="xmedium" color="$neutral900">
              <Link
                href="https://docs.rango.exchange/widget-integration/overview"
                target="_blank">
                <ExternalLinkIconContainer>
                  <ExternalLinkIcon color="gray" size={16} />
                </ExternalLinkIconContainer>
                &nbsp;Full Instructions
              </Link>
            </Typography>
          </LinkContainer>
          <LinkContainer>
            <Typography variant="title" size="xmedium" color="$neutral900">
              <Link
                href="https://github.com/rango-exchange/widget-examples"
                target="_blank">
                <ExternalLinkIconContainer>
                  <ExternalLinkIcon color="gray" size={16} />
                </ExternalLinkIconContainer>
                &nbsp;More Examples
              </Link>
            </Typography>
          </LinkContainer>
        </HelpLinksContainer>
      </Head>
      <Divider size={32} />
      <ButtonsContainer>
        {Object.keys(typesOfCodeBlocks).map((type, index) => {
          const key = `block-${index}`;
          return (
            <Fragment key={key}>
              <StyledButton
                size="medium"
                variant="contained"
                type={selected === type ? 'secondary' : undefined}
                onClick={() => setSelected(type as ExportType)}>
                {type}
              </StyledButton>
            </Fragment>
          );
        })}
      </ButtonsContainer>
      <Divider size={12} />
      <CodeBlock
        language={typesOfCodeBlocks[selected].language}
        theme={syntaxHighlighterTheme}>
        {typesOfCodeBlocks[selected].generateCode(formatedConfig)}
      </CodeBlock>
    </Modal>
  );
}
