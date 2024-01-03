import type { ChangeEvent } from 'react';

import {
  BorderRadiusIcon,
  Divider,
  FontIcon,
  LanguageIcon,
  Typography,
} from '@rango-dev/ui';
import React, { useCallback, useState } from 'react';

import { ItemPicker } from '../../components/ItemPicker';
import { OverlayPanel } from '../../components/OverlayPanel';
import { SingleList } from '../../components/SingleList';
import { Slider } from '../../components/Slider';
import {
  DEFAULT_PRIMARY_RADIUS,
  DEFAULT_SECONDARY_RADIUS,
  FONTS,
  LANGUAGES,
} from '../../constants';
import { useConfigStore } from '../../store/config';

import { Field, FieldTitle, GeneralContainer } from './StyleLayout.styles';
import { ModalState } from './StyleLayout.types';

export function General() {
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const onBack = () => setModalState(null);
  const onChangeLanguage = useConfigStore.use.onChangeLanguage();
  const onChangeTheme = useConfigStore.use.onChangeTheme();
  const borderRadius = useConfigStore.use.config().theme?.borderRadius;

  const secondaryBorderRadius =
    useConfigStore.use.config().theme?.secondaryBorderRadius;
  const fontFamily =
    useConfigStore.use.config().theme?.fontFamily || FONTS[0].value;
  const language = useConfigStore.use.config().language || LANGUAGES[0].value;
  const handleFontChange = (value: string) => {
    if (value) {
      onChangeTheme({
        name: 'fontFamily',
        value: value === FONTS[0].value ? undefined : value,
      });
    }
    onBack();
  };
  const handleLanguageChange = (value: string) => {
    if (value) {
      onChangeLanguage(value);
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
            showValue
            title="Widget"
            id="range1"
            value={borderRadius ?? DEFAULT_PRIMARY_RADIUS}
            max="50"
            onChange={handleBorderRadius}
          />
          <Divider size={4} />
          <Slider
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
      </GeneralContainer>
      {modalState === ModalState.DEFAULT_FONT && (
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

      {modalState === ModalState.DEFAULT_LANGUAGE && (
        <OverlayPanel onBack={onBack}>
          <SingleList
            onChange={handleLanguageChange}
            title="Languages"
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
