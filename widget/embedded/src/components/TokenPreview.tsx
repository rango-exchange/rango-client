import React, { ReactNode } from 'react';
import {
  Button,
  InfoCircleIcon,
  styled,
  Typography,
  Divider,
  Image,
} from '@rango-dev/ui';
import { LoadingStatus } from '../store/meta';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { numberToString } from '../utils/numbers';

const Box = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
});

const Container = styled('div', {
  boxSizing: 'border-box',
  borderRadius: '$5',
  padding: '$8 $16 $16 $16',

  variants: {
    type: {
      filled: {
        backgroundColor: '$neutral100',
      },
      outlined: {
        border: '1px solid $neutral100',
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
  backgroundColor: '$neutral100',
  borderRadius: '99999px',
});

const OutputContainer = styled('div', {
  windth: '100%',
  height: '$48',
  borderRadius: '$5',
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
  usdValue?: BigNumber;
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
          <Typography variant="body2" color="neutral800">
            {props.label}
          </Typography>
          <div>
            {percentageChange}
            {props.usdValue && (
              <Typography
                variant="caption"
                color="neutral600"
                className="usd-value"
              >{`$${numberToString(props.usdValue)}`}</Typography>
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
            align="start"
            size="large"
          >
            {loadingStatus === 'success' && chain
              ? chain.displayName
              : t('Chain')}
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
            size="large"
            align="start"
          >
            {loadingStatus === 'success' && token ? token.symbol : t('Token')}
          </Button>
          <Divider size={12} direction="horizontal" />
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
