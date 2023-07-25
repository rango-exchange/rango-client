import { Meta } from '@storybook/react';
import { ConfirmSwap, PropTypes } from './ConfirmSwap';
import { exampleFor5Wallets, wallets, bestRoute } from './mock';
import React from 'react';
import { Button, Typography, Divider, Image, GasIcon, styled } from '../../';
import { BestRouteResponse } from 'rango-sdk';
import { ChevronRightIcon } from '../../components';
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

const TokenPreview = ({
  chain,
  token,
  ...props
}: {
  label: string;
  amount: string;
  usdValue?: number;
  chain: {
    displayName: string;
    logo: string;
  };
  token: {
    symbol: string;
    image: string;
  };
}) => (
  <Box>
    <Container type={'outlined'}>
      <div className="head">
        <Typography variant="body" size="medium" color="neutral800">
          {props.label}
        </Typography>
        <div>
          <Typography
            variant="body"
            size="xsmall"
            color="neutral600"
            className="usd-value">{`$${props.usdValue}`}</Typography>
        </div>
      </div>
      <div className="form">
        <Button
          className="selectors"
          variant="outlined"
          prefix={<Image src={chain.logo} size={24} />}
          align="start"
          size="large">
          {chain.displayName}
        </Button>
        <Divider size={12} direction="horizontal" />
        <Button
          className="selectors"
          variant="outlined"
          prefix={<Image src={token.image} size={24} />}
          size="large"
          align="start">
          {token.symbol}
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
const OverviewContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$8',
  borderRadius: '$xs',
  backgroundColor: '$neutral100',
  color: '$neutral800',
  fontSize: '$12',

  '.routes': {
    display: 'flex',
    alignItems: 'center',
  },
  '.fee': {
    display: 'flex',
    alignItems: 'center',
  },
});

const RoutesOverview = (props: {
  routes: BestRouteResponse;
  totalFee?: string;
}) => {
  const swaps = props.routes.result?.swaps;
  return (
    <OverviewContainer>
      <div className="routes">
        {swaps?.map((swap, idx) => {
          const isLast = idx + 1 == swaps.length;
          return (
            <React.Fragment key={idx}>
              <div className="route">{swap.from.symbol}</div>
              <ChevronRightIcon size={12} />
              {isLast ? <div className="route">{swap.to.symbol}</div> : null}
            </React.Fragment>
          );
        })}
      </div>
      <div className="fee">
        <GasIcon size={12} />
        <Divider size={4} direction="horizontal" />${props.totalFee}
      </div>
    </OverviewContainer>
  );
};

const previewInputs = () => (
  <>
    <TokenPreview
      chain={{
        displayName: bestRoute?.result?.swaps[0].from.blockchain || '',
        logo: bestRoute?.result?.swaps[0].from.blockchainLogo || '',
      }}
      token={{
        symbol: bestRoute?.result?.swaps[0].from.symbol || '',
        image: bestRoute?.result?.swaps[0].from.logo || '',
      }}
      usdValue={2}
      amount={'2.99'}
      label="From"
    />
    <Divider size={12} />
    <TokenPreview
      chain={{
        displayName: bestRoute?.result?.swaps[0].to.blockchain || '',
        logo: bestRoute?.result?.swaps[0].to.blockchainLogo || '',
      }}
      token={{
        symbol: bestRoute?.result?.swaps[0].to.symbol || '',
        image: bestRoute?.result?.swaps[0].to.logo || '',
      }}
      usdValue={2}
      amount={'2.99'}
      label="To"
    />
  </>
);

export default {
  title: 'Containers/ConfirmSwap',
  component: ConfirmSwap,
  args: {
    requiredWallets: ['BSC', 'OSMOSIS'],
    confirmButtonTitle: 'confirm',
  },
} as Meta<typeof ConfirmSwap>;

export const Main = (props: PropTypes) => (
  <ConfirmSwap
    {...props}
    selectableWallets={wallets}
    previewInputs={<>{previewInputs()}</>}
    previewRoutes={<RoutesOverview routes={bestRoute} totalFee={'0.32'} />}
  />
);

export const With5Wallets = (props: PropTypes) => (
  <ConfirmSwap
    {...props}
    selectableWallets={exampleFor5Wallets}
    previewInputs={<>{previewInputs()}</>}
    previewRoutes={<RoutesOverview routes={bestRoute} totalFee={'0.32'} />}
  />
);
