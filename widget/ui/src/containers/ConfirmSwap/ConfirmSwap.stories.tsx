import { Meta } from '@storybook/react';
import { ConfirmSwap, PropTypes } from './ConfirmSwap';
import { exampleFor5Wallets, wallets, bestRoute } from './mock';
import React from 'react';
import { Divider, RoutesOverview, TokenPreview } from '../../';

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
      usdValue={'2'}
      loadingStatus="success"
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
      usdValue={'2'}
      loadingStatus="success"
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
