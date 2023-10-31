import type { LoadingStatus } from '../../types/meta';
import type { ReactNode } from 'react';

import { i18n } from '@lingui/core';
import React from 'react';

import { Button, Divider, Image, Typography } from '../..';
import { styled } from '../../theme';
import { InfoCircleIcon } from '../Icon';

const Box = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
});

const Container = styled('div', {
  boxSizing: 'border-box',
  borderRadius: '$xs',
  padding: '$8 $16 $16 $16',

  variants: {
    type: {
      filled: {
        backgroundColor: '$background',
      },
      outlined: {
        border: '1px solid $background',
      },
    },
  },

  defaultVariants: {
    type: 'filled',
  },

  '.head': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '32px',
    '.usd-value': {
      paddingLeft: '$8',
    },
  },
  '.form': {
    display: 'flex',
    width: '100%',
    padding: '$2 0',
    '.selectors': {
      width: '35%',

      '._text': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    '.amount': {
      width: '30%',
    },
  },
});

const ImagePlaceholder = styled('span', {
  width: '24px',
  height: '24px',
  backgroundColor: '$background',
  borderRadius: '99999px',
});

const OutputContainer = styled('div', {
  windth: '100%',
  height: '$48',
  borderRadius: '$xs',
  backgroundColor: '$surface',
  border: '1px solid transparent',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '$8',
  paddingRight: '$8',
});

interface PropTypes {
  label: string;
  amount: string;
  usdValue: string | null;
  loadingStatus: LoadingStatus;
  chain: {
    displayName: string;
    logo: string;
  };
  token: {
    symbol: string;
    image: string;
  };
  percentageChange?: ReactNode;
}

export function TokenPreview(props: PropTypes) {
  const { chain, token, loadingStatus, percentageChange } = props;

  const ItemSuffix = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {loadingStatus === 'failed' && <InfoCircleIcon color="error" size={24} />}
    </div>
  );

  return (
    <Box>
      <Container type={'outlined'}>
        <div className="head">
          <Typography variant="body" size="small" color="neutral600">
            {props.label}
          </Typography>
          <div>
            {percentageChange}
            {props.usdValue && (
              <Typography
                variant="body"
                size="xsmall"
                color="neutral800"
                className="usd-value">{`$${props.usdValue}`}</Typography>
            )}
          </div>
        </div>
        <div className="form">
          <Button
            className="selectors"
            variant="outlined"
            loading={loadingStatus === 'loading'}
            prefix={
              loadingStatus === 'success' && chain ? (
                <Image src={chain.logo} size={24} />
              ) : (
                <ImagePlaceholder />
              )
            }
            suffix={ItemSuffix}
            size="large">
            {loadingStatus === 'success' && chain
              ? chain.displayName
              : i18n.t('Chain')}
          </Button>
          <Divider size={12} direction="horizontal" />
          <Button
            className="selectors"
            variant="outlined"
            loading={loadingStatus === 'loading'}
            prefix={
              loadingStatus === 'success' && token ? (
                <Image src={token.image} size={24} />
              ) : (
                <ImagePlaceholder />
              )
            }
            suffix={ItemSuffix}
            size="large">
            {loadingStatus === 'success' && token
              ? token.symbol
              : i18n.t('Token')}
          </Button>
          <Divider size={12} direction="horizontal" />
          <div className="amount">
            <OutputContainer>
              <Typography variant="title" size="medium">
                {props.amount}
              </Typography>
            </OutputContainer>
          </div>
        </div>
      </Container>
    </Box>
  );
}
