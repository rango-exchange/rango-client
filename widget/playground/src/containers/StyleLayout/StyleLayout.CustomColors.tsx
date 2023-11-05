import type { CustomColorsTypes } from './StyleLayout.types';
import type { Mode } from '../../store/config';
import type { WidgetColorsKeys } from '@rango-dev/widget-embedded';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  Collapsible,
  CustomColorsIcon,
  Divider,
  Typography,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { ColorPicker } from '../../components/ColorPicker';
import { WIDGET_COLORS } from '../../constants';
import { useConfigStore } from '../../store/config';
import { getMainColor } from '../../utils/colors';
import { shallowEqual } from '../../utils/common';

import {
  ColoredCircle,
  ColorsContent,
  CustomColorCollapsible,
  CustomColors,
  FieldTitle,
  Row,
} from './StyleLayout.styles';

const Colors = (props: { mainColor?: string; secondColor?: string }) => {
  return (
    <ColorsContent>
      <ColoredCircle style={{ backgroundColor: props.mainColor }} />
      {props.secondColor !== undefined && (
        <ColoredCircle
          position="absolute"
          style={{
            backgroundColor: props.secondColor,
            right: -10,
          }}
        />
      )}
    </ColorsContent>
  );
};

export function CustomColorsSection(props: CustomColorsTypes) {
  const { tab, selectedPreset, onResetPreset } = props;

  const [openCustomColors, toggleCustomColors] = useState<{
    tab: Mode;
    value: boolean;
  }>({ tab, value: false });

  const [openCustomColor, setOpenCustomColor] = useState<string | null>(null);
  const onChangeColors = useConfigStore.use.onChangeColors();
  const onChangeTheme = useConfigStore.use.onChangeTheme();
  const isAutoTab = tab === 'auto';

  const { theme } = useConfigStore.use.config();
  const [selectedColorTab, setSelectedColorTab] = useState<Mode>(tab);

  const isOpenCustomColors =
    tab === openCustomColors.tab && openCustomColors.value;

  const handleOpenCollapse = (key: string) => {
    if (openCustomColor === key) {
      setOpenCustomColor(null);
    } else {
      setOpenCustomColor(key);
    }
  };
  useEffect(() => {
    setOpenCustomColor(null);
  }, [tab]);

  const onChangeColor = (
    name: WidgetColorsKeys,
    mode: 'light' | 'dark',
    color?: string
  ) => {
    const resetColors = selectedColorTab !== tab;
    setSelectedColorTab(tab);

    onChangeTheme({ name: 'mode', value: tab });
    onChangeColors({
      name,
      mode,
      color,
      singleTheme: !isAutoTab,
      resetColors,
    });
  };

  const onResetColor = (name: WidgetColorsKeys, mode: 'light' | 'dark') => {
    const color = !!selectedPreset ? selectedPreset[mode][name] : undefined;
    onChangeColor(name, mode, color);
  };

  useEffect(() => {
    if (
      !shallowEqual(theme?.colors?.dark || {}, selectedPreset?.dark || {}) &&
      !shallowEqual(theme?.colors?.light || {}, selectedPreset?.light || {}) &&
      selectedColorTab === tab
    ) {
      onResetPreset();
    }
  }, [theme.colors]);

  return (
    <Collapsible
      open={isOpenCustomColors}
      onOpenChange={() =>
        toggleCustomColors((prev) => ({
          tab,
          value: tab === prev.tab ? !prev.value : true,
        }))
      }
      trigger={
        <CustomColors
          variant="default"
          fullWidth
          suffix={
            isOpenCustomColors ? (
              <ChevronUpIcon size={10} color="gray" />
            ) : (
              <ChevronDownIcon size={10} color="gray" />
            )
          }>
          <FieldTitle>
            <CustomColorsIcon size={18} color="gray" />
            <Divider direction="horizontal" size={4} />
            <Typography size="medium" variant="body" className="title">
              Custom Colors
            </Typography>
          </FieldTitle>
        </CustomColors>
      }>
      <Divider size={16} />
      {WIDGET_COLORS.map((widgetColor) => (
        <div key={widgetColor.key}>
          <CustomColorCollapsible
            open={openCustomColor === widgetColor.key}
            onOpenChange={() => handleOpenCollapse(widgetColor.key)}
            trigger={
              <Row>
                <Row>
                  <Colors
                    mainColor={getMainColor(widgetColor.key, tab, theme)}
                    secondColor={
                      isAutoTab
                        ? getMainColor(widgetColor.key, tab, theme, 'dark') ||
                          ''
                        : undefined
                    }
                  />
                  <Divider direction="horizontal" size={16} />
                  <Typography size="small" variant="body">
                    {widgetColor.label}
                  </Typography>
                </Row>
                {openCustomColor === widgetColor.key ? (
                  <ChevronUpIcon size={10} color="gray" />
                ) : (
                  <ChevronDownIcon size={10} color="gray" />
                )}
              </Row>
            }>
            <Divider size={16} />

            {isAutoTab ? (
              <>
                <ColorPicker
                  label="Light"
                  placeholder={widgetColor.label}
                  color={getMainColor(widgetColor.key, tab, theme, 'light')}
                  onChangeColor={(color) =>
                    onChangeColor(widgetColor.key, 'light', color)
                  }
                  onReset={() => onResetColor(widgetColor.key, 'light')}
                  resetDisable={
                    getMainColor(widgetColor.key, tab, theme, 'light') ===
                    selectedPreset?.light[widgetColor.key]
                  }
                />
                <Divider size={16} />
                <ColorPicker
                  label="Dark"
                  placeholder={widgetColor.label}
                  color={getMainColor(widgetColor.key, tab, theme, 'dark')}
                  onChangeColor={(color) =>
                    onChangeColor(widgetColor.key, 'dark', color)
                  }
                  resetDisable={
                    getMainColor(widgetColor.key, tab, theme, 'dark') ===
                    selectedPreset?.dark[widgetColor.key]
                  }
                  onReset={() => onResetColor(widgetColor.key, 'dark')}
                />
              </>
            ) : (
              <ColorPicker
                label="Main"
                placeholder={widgetColor.label}
                color={getMainColor(widgetColor.key, tab, theme) || ''}
                onChangeColor={(color) =>
                  onChangeColor(widgetColor.key, tab, color)
                }
                onReset={() => onResetColor(widgetColor.key, tab)}
                resetDisable={
                  getMainColor(widgetColor.key, tab, theme) ===
                  (selectedPreset
                    ? selectedPreset[tab][widgetColor.key]
                    : undefined)
                }
              />
            )}
          </CustomColorCollapsible>
          <Divider size={12} />
        </div>
      ))}
    </Collapsible>
  );
}
