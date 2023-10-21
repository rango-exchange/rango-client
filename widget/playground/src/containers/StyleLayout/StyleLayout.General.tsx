import type { ChangeEvent } from 'react';

import { BorderRadiusIcon, Divider, FontIcon, Typography } from '@rango-dev/ui';
import React, { useCallback, useState } from 'react';

import { ItemPicker } from '../../components/ItemPicker';
import { OverlayPanel } from '../../components/OverlayPanel';
import { SingleList } from '../../components/SingleList';
import { Slider } from '../../components/Slider';
import {
  DEFAULT_PRIMARY_RADIUS,
  DEFAULT_SECONDARY_RADIUS,
  FONTS,
} from '../../constants';
import { useConfigStore } from '../../store/config';

import { Field, FieldTitle, GeneralContainer } from './StyleLayout.styles';

export function General() {
  const [showModal, setShowModal] = useState(false);
  const onBack = () => setShowModal(false);

  const onChangeTheme = useConfigStore.use.onChangeTheme();
  const borderRadius = useConfigStore.use.config().theme?.borderRadius;
  const secondaryBorderRadius =
    useConfigStore.use.config().theme?.secondaryBorderRadius;
  const fontFamily =
    useConfigStore.use.config().theme?.fontFamily || FONTS[0].value;

  const handleFontChange = (value: string) => {
    if (value) {
      onChangeTheme({
        name: 'fontFamily',
        value: value === FONTS[0].value ? undefined : value,
      });
    }
    onBack();
  };

  const handleBorderRadius = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      onChangeTheme({
        name: 'borderRadius',
        value: value === DEFAULT_PRIMARY_RADIUS ? undefined : value,
      });
    },
    [borderRadius]
  );

  const handleSecondaryBorderRadius = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      onChangeTheme({
        name: 'secondaryBorderRadius',
        value: value === DEFAULT_SECONDARY_RADIUS ? undefined : value,
      });
    },
    [secondaryBorderRadius]
  );

  const handleFontClick = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <>
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
            max="25"
            onChange={handleSecondaryBorderRadius}
          />
        </Field>
        <Divider size={24} />

        <ItemPicker
          onClick={handleFontClick}
          value={{ label: fontFamily }}
          title="Fonts"
          iconTitle={<FontIcon size={18} />}
        />
      </GeneralContainer>
      {showModal && (
        <OverlayPanel onBack={onBack}>
          <SingleList
            onChange={handleFontChange}
            title="Fonts"
            icon={<FontIcon size={18} />}
            defaultValue={fontFamily}
            list={FONTS}
            searchPlaceholder="Search Font"
          />
        </OverlayPanel>
      )}
    </>
  );
}
