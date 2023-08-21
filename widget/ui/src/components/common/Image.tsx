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
  useAsPlaceholder?: boolean;
  backgroundColor?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export function Image(props: PropTypes) {
  const {
    size,
    useAsPlaceholder,
    backgroundColor = '$secondary100',
    ...otherProps
  } = props;

  return (
    <ImageContainer
      className="image-container"
      css={{
        width: size + 'px',
        height: size + 'px',
        ...(useAsPlaceholder && { backgroundColor }),
      }}>
      {!useAsPlaceholder && <img className="image" {...otherProps} />}
    </ImageContainer>
  );
}

Image.toString = () => '.image-container';
