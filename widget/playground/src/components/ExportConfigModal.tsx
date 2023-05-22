import React, { useState } from 'react';
import {
  Button,
  CheckSquareIcon,
  CopyIcon,
  Modal,
  Spacer,
  Typography,
  css,
  styled,
  useCopyToClipboard,
} from '@rango-dev/ui';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { javascript, jsx } from 'react-syntax-highlighter/dist/esm/languages/prism';
import { atomDark as dark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import stringifyObject from 'stringify-object';
import { WidgetConfig } from '../types';
import { filterConfig, getEmbeddedCode, getIframeCode } from '../helpers';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('jsx', jsx);

const Link = styled('a', {
  color: '$primary',
  paddingLeft: 4,
});

const ButtonsContainer = styled('div', {
  paddingBottom: '$8',
  display: 'flex',
  justifyItems: 'center',
  alignItems: 'center',
});

const CopyCodeBlockButton = styled(Button, {
  position: 'absolute',
  cursor: 'pointer',
  right: '$8',
  top: '$16',
});

const CodeBlockContainer = styled('div', { position: 'relative', height: '60%' });

const modalContainerStyles = css({
  width: '90%',
});

interface CodeBlockProps {
  language: 'javascript' | 'jsx';
  theme: any;
  children: string;
}

function CodeBlock(props: CodeBlockProps) {
  const { language, theme, children } = props;

  const [isCopied, handleCopy] = useCopyToClipboard(2000);

  return (
    <CodeBlockContainer>
      <CopyCodeBlockButton onClick={handleCopy.bind(null, children)}>
        {isCopied ? <CheckSquareIcon size={20} color="success" /> : <CopyIcon size={20} />}
      </CopyCodeBlockButton>
      <SyntaxHighlighter
        showLineNumbers
        language={language}
        customStyle={{ height: '100%' }}
        style={theme}>
        {children}
      </SyntaxHighlighter>
    </CodeBlockContainer>
  );
}

interface ExportConfigModalProps {
  open: boolean;
  onClose: () => void;
  config: WidgetConfig;
}

export function ExportConfigModal(props: ExportConfigModalProps) {
  const { open, onClose, config } = props;

  const [isCopied, handleCopy] = useCopyToClipboard(2000);

  const filtered = filterConfig(config);

  const [selected, setSelected] = useState<'embedded' | 'i-frame'>('embedded');

  const syntaxHighlighterTheme = config.theme.mode === 'dark' ? dark : prism;

  return (
    <Modal
      open={open}
      action={
        <Button type="primary" variant="ghost" onClick={() => handleCopy(JSON.stringify(filtered))}>
          {isCopied ? 'Copied!' : 'Copy Config'}
        </Button>
      }
      onClose={onClose}
      content={
        <>
          <ButtonsContainer>
            <Button
              type={selected === 'embedded' ? 'primary' : undefined}
              onClick={setSelected.bind(null, 'embedded')}>
              embedded
            </Button>
            <Spacer size={8} direction="horizontal" />
            <Button
              onClick={setSelected.bind(null, 'i-frame')}
              type={selected === 'i-frame' ? 'primary' : undefined}>
              i-frame
            </Button>
          </ButtonsContainer>
          <hr />
          <Typography variant="body1" mb={8} mt={12}>
            See full instruction on
            <Link href="https://docs.rango.exchange/integration-guide/rango-widget" target="_blank">
              docs.rango.exchange
            </Link>
          </Typography>
          {selected === 'embedded' && (
            <Typography variant="body1" mb={8} mt={8}>
              See more examples
              <Link href="https://github.com/rango-exchange/widget-examples" target="_blank">
                https://github.com/rango-exchange/widget-examples
              </Link>
            </Typography>
          )}

          {selected === 'i-frame' && (
            <CodeBlock language="javascript" theme={syntaxHighlighterTheme}>
              {getIframeCode(
                stringifyObject(JSON.parse(JSON.stringify(filtered)), {
                  indent: '  ',
                }),
              )}
            </CodeBlock>
          )}
          {selected === 'embedded' && (
            <CodeBlock language="jsx" theme={syntaxHighlighterTheme}>
              {getEmbeddedCode(
                stringifyObject(JSON.parse(JSON.stringify(filtered)), {
                  indent: '  ',
                }),
              )}
            </CodeBlock>
          )}
        </>
      }
      title="Exported Config"
      containerStyle={{ width: '600px', height: '600px' }}
    />
  );
}
