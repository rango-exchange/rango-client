import type { CodeBlockProps } from './CodeBlock.types';

import { CopyIcon, Tooltip, useCopyToClipboard } from '@rango-dev/ui';
import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  javascript,
  jsx,
} from 'react-syntax-highlighter/dist/esm/languages/prism';

import { CodeBlockContainer, CopyCodeBlockButton } from './CodeBlock.styles';

const RESET_INTERVAL = 2_000;

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('jsx', jsx);

export function CodeBlock(props: CodeBlockProps) {
  const { language, theme, children } = props;

  const [, handleCopy] = useCopyToClipboard(RESET_INTERVAL);

  return (
    <CodeBlockContainer>
      <Tooltip content="Copy to clipboard" side="top">
        <CopyCodeBlockButton
          type="primary"
          onClick={() => {
            handleCopy(children);
          }}>
          <CopyIcon size={20} />
        </CopyCodeBlockButton>
      </Tooltip>
      <SyntaxHighlighter
        showLineNumbers
        language={language}
        customStyle={{ height: '100%', borderRadius: '15px' }}
        style={theme}>
        {children}
      </SyntaxHighlighter>
    </CodeBlockContainer>
  );
}
