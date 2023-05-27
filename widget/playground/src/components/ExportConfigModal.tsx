import React, { Fragment, useState } from 'react';
import {
  Button,
  CheckSquareIcon,
  CopyIcon,
  Divider,
  Modal,
  Typography,
  config,
  styled,
  useCopyToClipboard,
} from '@rango-dev/ui';
import { CSS } from '@stitches/react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { javascript, jsx } from 'react-syntax-highlighter/dist/esm/languages/prism';
import { atomDark as dark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { WidgetConfig } from '../types';
import {
  capitalizeTheFirstLetter,
  filterConfig,
  formatConfig,
  getEmbeddedCode,
  getIframeCode,
} from '../helpers';
import { initialConfig } from '../store/config';
import { useTheme } from '../hook/useTheme';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('jsx', jsx);

type ExportType = 'embedded' | 'iframe' | 'config';
type Language = 'jsx' | 'javascript';

const typesOfCodeBlocks: {
  [key in ExportType]: {
    language: Language;
    generateCode: (config: string) => string;
  };
} = {
  embedded: {
    language: 'jsx',
    generateCode: (config) => getEmbeddedCode(config),
  },
  iframe: {
    language: 'javascript',
    generateCode: (config) => getIframeCode(config),
  },
  config: {
    language: 'javascript',
    generateCode: (config) => config,
  },
};

const Link = styled('a', {
  color: '$primary',
  paddingLeft: 4,
});

const ButtonsContainer = styled('div', {
  paddingTop: '$12',
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

const modalContainerStyles: CSS<typeof config> = {
  height: '600px',
  width: '95%',
  '@md': { width: '80%' },
  '@lg': { width: '70%' },
};

interface CodeBlockProps {
  language: Language;
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

  const { activeTheme } = useTheme();

  const { filteredConfigForExport } = filterConfig(config, initialConfig);

  const formatedConfig = formatConfig(filteredConfigForExport);

  const [selected, setSelected] = useState<ExportType>('embedded');

  const syntaxHighlighterTheme = activeTheme === 'dark' ? dark : prism;

  return (
    <Modal
      open={open}
      onClose={onClose}
      content={
        <>
          <Typography variant="body1" mb={8} mt={12}>
            See full instruction on
            <Link href="https://docs.rango.exchange/integration-guide/rango-widget" target="_blank">
              docs.rango.exchange
            </Link>
          </Typography>
          <Typography variant="body1" mb={12} mt={8}>
            See more examples
            <Link href="https://github.com/rango-exchange/widget-examples" target="_blank">
              https://github.com/rango-exchange/widget-examples
            </Link>
          </Typography>
          <hr />
          <ButtonsContainer>
            {Object.keys(typesOfCodeBlocks).map((type, index) => (
              <Fragment key={index}>
                <Button
                  type={selected === type ? 'primary' : undefined}
                  onClick={setSelected.bind(null, type as ExportType)}>
                  {capitalizeTheFirstLetter(type)}
                </Button>
                <Divider size={8} direction="horizontal" />
              </Fragment>
            ))}
          </ButtonsContainer>

          <CodeBlock language={typesOfCodeBlocks[selected].language} theme={syntaxHighlighterTheme}>
            {typesOfCodeBlocks[selected].generateCode(formatedConfig)}
          </CodeBlock>
        </>
      }
      title="Export Code"
      containerStyle={modalContainerStyles}
    />
  );
}
