import type { ChangeEvent } from 'react';

import { BorderRadiusIcon, Divider, FontIcon, Typography } from '@rango-dev/ui';
import React, { useCallback } from 'react';

import { ItemPicker } from '../../components/ItemPicker';
import { Slider } from '../../components/Slider';
import {
  DEFAULT_PRIMARY_RADIUS,
  DEFAULT_SECONDARY_RADIUS,
  FONTS,
} from '../../constants';
import { useConfigStore } from '../../store/config';

import { Field, FieldTitle, GeneralContainer } from './StyleLayout.styles';

export function General({
  setIsFontPage,
}: {
  setIsFontPage: (isFontPage: boolean) => void;
}) {
  const onChangeTheme = useConfigStore.use.onChangeTheme();
  const borderRadius = useConfigStore.use.config().theme?.borderRadius;
  const secondaryBorderRadius =
    useConfigStore.use.config().theme?.secondaryBorderRadius;
  const fontFamily =
    useConfigStore.use.config().theme?.fontFamily || FONTS[0].name;

  const handleBorderRadius = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChangeTheme({
        name: 'borderRadius',
        value: parseInt(e.target.value),
      });
    },
    [borderRadius]
  );

  const handleSecondaryBorderRadius = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChangeTheme({
        name: 'secondaryBorderRadius',
        value: parseInt(e.target.value),
      });
    },
    [secondaryBorderRadius]
  );

  const handleFontClick = useCallback(() => {
    setIsFontPage(true);
  }, []);

  return (
    <GeneralContainer>
      <Field>
        <FieldTitle>
          <BorderRadiusIcon size={18} />
          <Divider direction="horizontal" size={4} />
          <Typography size="medium" variant="body">
            Border Radius
          </Typography>
        </FieldTitle>
        <Divider size={16} />
        <Slider
          showValue
          title="Widget"
          value={borderRadius ?? DEFAULT_PRIMARY_RADIUS}
          max="50"
          onChange={handleBorderRadius}
        />
        <Divider size={8} />
        <Slider
          showValue
          title="Button"
          value={secondaryBorderRadius ?? DEFAULT_SECONDARY_RADIUS}
          max="50"
          onChange={handleSecondaryBorderRadius}
        />
      </Field>
      <Divider size={24} />
      <Field>
        <FieldTitle>
          <FontIcon size={18} />
          <Divider direction="horizontal" size={4} />
          <Typography size="medium" variant="body">
            Fonts
          </Typography>
        </FieldTitle>
        <Divider size={8} />
        <ItemPicker onClick={handleFontClick} value={fontFamily} />
      </Field>
    </GeneralContainer>
  );
}
