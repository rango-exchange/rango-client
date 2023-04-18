import React from 'react';
import { styled } from '../../theme';

const ImageContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '.image': {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
});

type PropTypes = {
  size: number;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export function Image(props: PropTypes) {
  const { size, ...otherProps } = props;

  return (
    <ImageContainer css={{ width: size + 'px', height: size + 'px' }}>
      <img className="image" {...otherProps} />
    </ImageContainer>
  );
}
