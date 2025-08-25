import type { TokenSectionProps } from './TokenSection.types.js';

import { i18n } from '@lingui/core';
import React from 'react';
import { CustomTokenWarning } from 'src/components/CustomTokenWarning/CustomTokenWarning.js';

import {
  ChainToken,
  Divider,
  Skeleton,
  Tooltip,
  Typography,
} from '../../components/index.js';

import {
  chainNameStyles,
  Container,
  skeletonStyles,
  SymbolTooltipContent,
  SymbolTooltipStyles,
  Title,
  TitleContainer,
  tokenChainStyles,
  TokenSectionContainer,
} from './TokenSection.styles.js';

export function TokenSection(props: TokenSectionProps) {
  const {
    error,
    chainImage,
    tokenImage,
    tokenSymbol,
    chain,
    chianImageId,
    onClick,
    loading,
    warning,
    tooltipContainer,
    id,
    selectionType = 'token',
  } = props;

  const tokenSelected = !error && !loading && !!tokenSymbol;

  const getBodyContent = () => {
    if (error) {
      return error;
    } else if (!loading && !chain) {
      return selectionType === 'token'
        ? i18n.t('Select Chain')
        : i18n.t('Select gas chain');
    }
    return chain;
  };

  return (
    <Container
      id={`${id}-clear-all-btn`}
      variant="default"
      disabled={error || loading}
      onClick={onClick}>
      <TokenSectionContainer>
        <ChainToken
          chianImageId={chianImageId}
          size="large"
          useAsPlaceholder={error}
          chainImage={chainImage}
          tokenImage={tokenImage}
          loading={loading}
        />
        <div className={tokenChainStyles()}>
          {loading ? (
            <div className={skeletonStyles()}>
              <Skeleton variant="text" size="large" />
              <Divider size={8} />
              <Skeleton variant="text" size="medium" />
            </div>
          ) : (
            <>
              <TitleContainer>
                {tokenSelected ? (
                  <Tooltip
                    styles={SymbolTooltipStyles}
                    align="start"
                    side="bottom"
                    alignOffset={-15}
                    sideOffset={15}
                    container={tooltipContainer}
                    content={
                      <SymbolTooltipContent variant="body" size="xsmall">
                        {tokenSymbol}
                      </SymbolTooltipContent>
                    }>
                    <Title variant="title" size="medium">
                      {tokenSymbol}
                    </Title>
                  </Tooltip>
                ) : (
                  <Typography variant="title" size="medium">
                    {selectionType === 'token'
                      ? i18n.t('Select Token')
                      : i18n.t('Select Chain')}
                  </Typography>
                )}
                {warning && (
                  <>
                    <Divider size={4} direction="horizontal" />
                    <CustomTokenWarning container={tooltipContainer} />
                  </>
                )}
              </TitleContainer>
              <Typography
                variant="body"
                size="medium"
                className={chainNameStyles()}>
                {getBodyContent()}
              </Typography>
            </>
          )}
        </div>
      </TokenSectionContainer>
    </Container>
  );
}
