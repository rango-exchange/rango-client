import React from 'react';
import { styled } from '../../theme';
import { Spacer } from '../Spacer';
import { Image } from '../common';

const TokenContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '160px',

  '& .amount': {
    fontWeight: 'bold',
  },
  '& .estimated': {
    color: '$neutrals600',
  },
});

const TokenImage = styled('div', {
  position: 'relative',

  '.overlay': {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: '$16',
    height: '$16',
    padding: '$2',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '$background',
    border: '1px solid $neutrals400',
  },
});

interface PropTypes {
  data: {
    token: {
      logo: string;
      symbol: string;
    };
    blockchain: {
      logo: string;
      name: string;
    };
    amount: string;
    estimatedAmount?: string;
  };
}
export function Token(props: PropTypes) {
  const {
    data: { token, blockchain, amount, estimatedAmount },
  } = props;
  return (
    <TokenContainer>
      <TokenImage>
        <Image src={token.logo} alt="" size={24} />
        <div className="overlay">
          <Image src={blockchain.logo} alt={blockchain.name} size={12} />
        </div>
      </TokenImage>
      <Spacer size={8} />
      {!!amount && <span className="amount">{props.data.amount}</span>}
      {!amount && estimatedAmount && (
        <span className="amount estimated">{props.data.estimatedAmount}</span>
      )}
      <Spacer size={4} />
      {token.symbol}
    </TokenContainer>
  );
}
