import React from 'react';
import { styled } from '../../theme';
import { Spacer } from '../Spacer';
import { Image } from '../common';

const TokenContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',

  '& .amount': {
    fontWeight: 'bold',
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
  };
}
export function Token(props: PropTypes) {
  return (
    <TokenContainer>
      <TokenImage>
        <Image src={props.data.token.logo} alt="" size={24} />
        <div className="overlay">
          <Image
            src={props.data.blockchain.logo}
            alt={props.data.blockchain.name}
            size={12}
          />
        </div>
      </TokenImage>
      <Spacer size={8} />
      <span className="amount">{props.data.amount}</span>
      <Spacer size={4} />
      {props.data.token.symbol}
    </TokenContainer>
  );
}
