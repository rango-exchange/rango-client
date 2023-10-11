import {
  Divider,
  FontIcon,
  ListItemButton,
  Radio,
  RadioRoot,
  Typography,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { FONTS } from '../../constants';
import { FieldTitle } from '../../containers/StyleLayout/StyleLayout.styles';
import { useConfigStore } from '../../store/config';

import { FontList, StyledButton } from './FontSelector.styles';

export function FontSelector() {
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
  };
  return (
    <>
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
    </>
  );
}
