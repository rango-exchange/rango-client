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
  '.circular': {
    borderRadius: '$lg',
  },
});

type PropTypes = {
  size: number;
  useAsPlaceholder?: boolean;
  backgroundColor?: string;
  borderRadius?: string;
  type?: 'circular' | 'rectangular';
} & React.ImgHTMLAttributes<HTMLImageElement>;

export function Image(props: PropTypes) {
  const {
    size,
    useAsPlaceholder,
    backgroundColor = '$secondary100',
    type,
    ...otherProps
  } = props;

  const borderRadius = type === 'circular' ? '$lg' : '$xs';

  return (
    <ImageContainer
      className="image-container"
      css={{
        width: size + 'px',
        height: size + 'px',
        ...(useAsPlaceholder && { backgroundColor, borderRadius }),
      }}>
      {!useAsPlaceholder && (
        <img
          className={`image ${type === 'circular' ? 'circular' : ''}`}
          {...otherProps}
        />
      )}
    </ImageContainer>
  );
}
