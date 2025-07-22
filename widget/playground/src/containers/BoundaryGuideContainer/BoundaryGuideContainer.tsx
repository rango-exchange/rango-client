import type { PropTypes } from './BoundaryGuideContainer.types';
import type { PropsWithChildren } from 'react';

import {
  Divider,
  HeightIcon,
  NotSelectableTypography,
  WidthIcon,
} from '@arlert-dev/ui';
import React from 'react';

import { WIDGET_VARIANT_MAX_WIDTH } from '../../constants/styles';
import { VARIANTS } from '../../constants/variants';
import { useConfigStore } from '../../store/config';

import {
  BoundaryGuide,
  BoundarySize,
  Container,
} from './BoundaryGuideContainer.styles';

const BoundaryGuideContainer = (props: PropsWithChildren<PropTypes>) => {
  const { show, children } = props;
  const variant = useConfigStore.use.config().variant || VARIANTS[0].value;

  const maxWidth = WIDGET_VARIANT_MAX_WIDTH[variant];

  return (
    <Container variant={variant} boundaryVisible={show}>
      <BoundaryGuide visible={show}>
        {show && (
          <BoundarySize side="topRight">
            <WidthIcon size={16} color="gray" />
            <Divider size={4} direction="horizontal" />
            <NotSelectableTypography
              variant="label"
              size="medium"
              color="neutral600">
              Max Width: {maxWidth} px
            </NotSelectableTypography>
          </BoundarySize>
        )}
        {show && (
          <BoundarySize side="bottomLeft">
            <HeightIcon size={16} color="gray" />
            <Divider size={4} direction="horizontal" />
            <NotSelectableTypography
              variant="label"
              size="medium"
              color="neutral600">
              Max Height: 700 px
            </NotSelectableTypography>
          </BoundarySize>
        )}
      </BoundaryGuide>
      {children}
    </Container>
  );
};

export default BoundaryGuideContainer;
