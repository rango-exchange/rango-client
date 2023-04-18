import React from 'react';
import { styled } from '../../theme';
import { Spacer } from '../Spacer';

const TokenContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '160px',

  '& .amount': {
    fontWeight: 'bold',
  },
});

const TokenImage = styled('div', {
  position: 'relative',
  width: '$24',
  height: '$24',

  img: {
    width: '100%',
    display: 'block',
  },

  '.overlay': {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: '$16',
    height: '$16',
    padding: '$2',
    borderRadius: '50%',
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
        <img src={props.data.token.logo} alt="" />
        <div className="overlay">
          <img
            src={props.data.blockchain.logo}
            alt={props.data.blockchain.name}
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
