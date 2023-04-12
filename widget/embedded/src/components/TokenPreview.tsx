import React from 'react';
import { Button, InfoCircleIcon, styled, Typography } from '@rango-dev/ui';
import { LoadingStatus } from '../store/meta';
import { useTranslation } from 'react-i18next';
import { Spacer } from '@rango-dev/ui';
import BigNumber from 'bignumber.js';
import { numberToString } from '../utils/numbers';

const Box = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const Container = styled('div', {
  boxSizing: 'border-box',
  borderRadius: '$5',
  padding: '$8 $16 $16 $16',

  variants: {
    type: {
      filled: {
        backgroundColor: '$neutrals300',
      },
      outlined: {
        border: '1px solid $neutrals300',
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

const StyledImage = styled('img', {
  width: '$24',
  maxHeight: '$24',
});

const ImagePlaceholder = styled('span', {
  width: '24px',
  height: '24px',
  backgroundColor: '$neutrals300',
  borderRadius: '99999px',
});

const OutputContainer = styled('div', {
  windth: '100%',
  height: '$48',
  borderRadius: '$5',
  backgroundColor: '$background',
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
  usdValue: BigNumber;
  loadingStatus: LoadingStatus;
  chain: {
    displayName: string;
    logo: string;
  };
  token: {
    symbol: string;
    image: string;
  };
}

export function TokenPreview(props: PropTypes) {
  const { chain, token, loadingStatus } = props;
  const { t } = useTranslation();

  const ItemSuffix = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {loadingStatus === 'failed' && <InfoCircleIcon color="error" size={24} />}
    </div>
  );

  return (
    <Box>
      <Container type={'outlined'}>
        <div className="head">
          <Typography variant="body2" color="neutrals800">
            {props.label}
          </Typography>
          <Typography variant="caption" color="neutrals600">{`$${numberToString(
            props.usdValue
          )}`}</Typography>
        </div>
        <div className="form">
          <Button
            className="selectors"
            variant="outlined"
            loading={loadingStatus === 'loading'}
            prefix={
              loadingStatus === 'success' && chain ? (
                <StyledImage src={chain.logo} />
              ) : (
                <ImagePlaceholder />
              )
            }
            suffix={ItemSuffix}
            align="start"
            size="large"
          >
            {loadingStatus === 'success' && chain
              ? chain.displayName
              : t('Chain')}
          </Button>
          <Spacer size={12} />
          <Button
            className="selectors"
            variant="outlined"
            loading={loadingStatus === 'loading'}
            prefix={
              loadingStatus === 'success' && token ? (
                <StyledImage src={token.image} />
              ) : (
                <ImagePlaceholder />
              )
            }
            suffix={ItemSuffix}
            size="large"
            align="start"
          >
            {loadingStatus === 'success' && token ? token.symbol : t('Token')}
          </Button>
          <Spacer size={12} />
          <div className="amount">
            <OutputContainer>
              <Typography variant="h4">{props.amount}</Typography>
            </OutputContainer>
          </div>
        </div>
      </Container>
    </Box>
  );
}
