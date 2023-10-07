import type { PropTypes } from './FontSelector.types';

import {
  ChevronLeftIcon,
  Divider,
  FontIcon,
  ListItemButton,
  Radio,
  RadioRoot,
  Typography,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { FONTS } from '../../constants';
import { useConfigStore } from '../../store/config';
import { FieldTitle } from '../StyleLayout/StyleLayout.styles';

import {
  Container,
  FontList,
  Header,
  StyledButton,
} from './FontSelector.styles';

export function FontSelector(props: PropTypes) {
  const { onBack } = props;
  const fontFamily = useConfigStore.use.config().theme?.fontFamily;
  const onChangeTheme = useConfigStore.use.onChangeTheme();

  const [fontSelected, setFontSelected] = useState(
    fontFamily || FONTS[0].value
  );
  const fontList = FONTS.map((font) => {
    const { name, value } = font;
    return {
      onClick: () => setFontSelected(value),
      end: <Radio value={value} />,
      title: (
        <Typography variant="title" size="small">
          {name}
        </Typography>
      ),
      id: value,
      hasDivider: true,
    };
  });

  const handleConfirm = () => {
    onChangeTheme({ name: 'fontFamily', value: fontSelected });
    onBack();
  };
  return (
    <Container>
      <Header onClick={onBack}>
        <ChevronLeftIcon size={12} />
        <Divider size={4} direction="horizontal" />
        <Typography size="medium" variant="label" color="neutral900">
          back
        </Typography>
      </Header>
      <Divider size={12} />
      <FontList>
        <FieldTitle>
          <FontIcon size={18} />
          <Divider direction="horizontal" size={4} />
          <Typography size="medium" variant="body">
            Fonts
          </Typography>
        </FieldTitle>
        <Divider size={20} />
        <RadioRoot value={fontSelected}>
          <ul>
            {fontList.map((font) => (
              <ListItemButton
                key={font.id}
                {...font}
                style={{ height: '46px' }}
              />
            ))}
          </ul>
        </RadioRoot>
      </FontList>
      <StyledButton
        type="primary"
        size="medium"
        variant="contained"
        onClick={handleConfirm}>
        Confirm
      </StyledButton>
    </Container>
  );
}
