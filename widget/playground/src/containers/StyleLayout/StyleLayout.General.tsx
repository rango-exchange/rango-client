import type { ChangeEvent } from 'react';

import {
  BorderRadiusIcon,
  Divider,
  FontIcon,
  InfoErrorIcon,
  LanguageIcon,
  Select,
  Typography,
  WidgetIcon,
} from '@rango-dev/ui';
import { SUPPORTED_FONTS, useWidget } from '@rango-dev/widget-embedded';
import React, { useCallback, useState } from 'react';

import { ItemPicker } from '../../components/ItemPicker';
import { OverlayPanel } from '../../components/OverlayPanel';
import { SingleList } from '../../components/SingleList';
import { Slider } from '../../components/Slider';
import {
  DEFAULT_PRIMARY_RADIUS,
  DEFAULT_SECONDARY_RADIUS,
  LANGUAGES,
  PLAYGROUND_CONTAINER_ID,
} from '../../constants';
import { DEFAULT_FONT } from '../../constants/fonts';
import { VARIANTS } from '../../constants/variants';
import { useTheme } from '../../hooks/useTheme';
import { useConfigStore } from '../../store/config';

import { Field, FieldTitle, GeneralContainer } from './StyleLayout.styles';
import { ModalState } from './StyleLayout.types';

export function General() {
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const onBack = () => setModalState(null);
  const onChangeLanguage = useConfigStore.use.onChangeLanguage();
  const onChangeTheme = useConfigStore.use.onChangeTheme();
  const onChangeVariant = useConfigStore.use.onChangeVariant();

  const borderRadius = useConfigStore.use.config().theme?.borderRadius;
  const colors = useConfigStore.use.config().theme?.colors;
  const { activeStyle } = useTheme();
  const mode = activeStyle.indexOf('dark') !== -1 ? 'dark' : 'light';
  const secondaryBorderRadius =
    useConfigStore.use.config().theme?.secondaryBorderRadius;
  const fontFamily =
    useConfigStore.use.config().theme?.fontFamily || DEFAULT_FONT;
  const language = useConfigStore.use.config().language || LANGUAGES[0].value;
  const variant = useConfigStore.use.config().variant || VARIANTS[0].value;

  const { resetLanguage } = useWidget();

  const handleFontChange = (value: string) => {
    if (value) {
      onChangeTheme({
        name: 'fontFamily',
        value: value === DEFAULT_FONT ? undefined : value,
      });
    }
    onBack();
  };

  const handleLanguageChange = (value: string) => {
    if (value) {
      onChangeLanguage(value);
      resetLanguage();
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

  const selectedLanguage = LANGUAGES.find((l) => l.value === language);

  return (
    <>
      <GeneralContainer>
        <Field>
          <FieldTitle>
            <WidgetIcon size={18} />
            <Divider direction="horizontal" size={4} />
            <Typography size="medium" variant="body">
              Widget Variant
            </Typography>
          </FieldTitle>
          <Divider size={16} />
          <Select
            variant="outlined"
            container={
              document.getElementById(PLAYGROUND_CONTAINER_ID) as HTMLElement
            }
            options={VARIANTS}
            value={variant}
            handleItemClick={(item) =>
              onChangeVariant(
                item.value === VARIANTS[0].value ? undefined : item.value
              )
            }
          />
        </Field>
        <Divider size={24} />
        <ItemPicker
          onClick={() => setModalState(ModalState.DEFAULT_LANGUAGE)}
          value={{
            label: selectedLanguage?.name,
            logo: selectedLanguage?.Icon,
          }}
          title="Default Language"
          hasLogo
          iconTitle={<LanguageIcon size={18} color="gray" />}
        />
        <Divider size={24} />
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
            color={colors?.[mode]?.secondary}
            showValue
            title="Widget"
            id="range1"
            value={borderRadius ?? DEFAULT_PRIMARY_RADIUS}
            max="50"
            onChange={handleBorderRadius}
          />
          <Divider size={4} />
          <Slider
            color={colors?.[mode]?.secondary}
            id="range2"
            showValue
            title="Button"
            value={secondaryBorderRadius ?? DEFAULT_SECONDARY_RADIUS}
            max="25"
            onChange={handleSecondaryBorderRadius}
          />
        </Field>
        <Divider size={24} />

        <ItemPicker
          onClick={() => setModalState(ModalState.DEFAULT_FONT)}
          value={{ label: fontFamily }}
          title="Fonts"
          iconTitle={<FontIcon size={18} />}
        />
        <Divider size={12} />
        <FieldTitle>
          <InfoErrorIcon color="gray" size={14} />
          <Divider direction="horizontal" size={4} />
          <Typography size="small" variant="body" color="neutral600">
            Fonts should be loaded from Google Fonts separately
          </Typography>
        </FieldTitle>
      </GeneralContainer>
      {modalState === ModalState.DEFAULT_FONT && (
        <OverlayPanel onBack={onBack}>
          <SingleList
            onChange={handleFontChange}
            title="Fonts"
            icon={<FontIcon size={18} />}
            defaultValue={fontFamily}
            list={SUPPORTED_FONTS}
            searchPlaceholder="Search Font"
          />
        </OverlayPanel>
      )}
      {modalState === ModalState.DEFAULT_LANGUAGE && (
        <OverlayPanel onBack={onBack}>
          <SingleList
            onChange={handleLanguageChange}
            title="Default Language"
            icon={<LanguageIcon size={18} color="gray" />}
            defaultValue={language}
            list={LANGUAGES}
            searchPlaceholder="Search Language"
          />
        </OverlayPanel>
      )}
    </>
  );
}
