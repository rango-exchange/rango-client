import type { CustomColorsTypes } from './StyleLayout.types';
import type { Mode } from '../../store/config';
import type { WidgetColorsKeys } from '@arlert-dev/widget-embedded';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  Collapsible,
  CustomColorsIcon,
  Divider,
  Typography,
} from '@arlert-dev/ui';
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

  const [openCustomColor, setOpenCustomColor] =
    useState<WidgetColorsKeys | null>(null);
  const onChangeColors = useConfigStore.use.onChangeColors();
  const isAutoTab = tab === 'auto';
  const singleTheme = !isAutoTab;
  const { theme } = useConfigStore.use.config();

  const isOpenCustomColors =
    tab === openCustomColors.tab && openCustomColors.value;

  const handleOpenCollapse = (key: WidgetColorsKeys) => {
    if (openCustomColor === key) {
      setOpenCustomColor(null);
    } else {
      setOpenCustomColor(key);
    }
  };
  useEffect(() => {
    setOpenCustomColor(null);
  }, [tab]);

  const onResetColor = (name: WidgetColorsKeys, mode: 'light' | 'dark') => {
    const color = !!selectedPreset ? selectedPreset?.[mode]?.[name] : undefined;
    onChangeColors({
      name,
      mode,
      color,
      singleTheme,
    });
  };

  useEffect(() => {
    if (
      !shallowEqual(theme?.colors?.dark || {}, selectedPreset?.dark || {}) &&
      !shallowEqual(theme?.colors?.light || {}, selectedPreset?.light || {})
    ) {
      onResetPreset();
    }
  }, [theme?.colors]);

  const isCustomColorDisabled =
    (tab === 'auto' && theme?.singleTheme) || // The system tab and a single theme is selected
    (tab === 'light' && !!selectedPreset?.dark) || // The light tab and a system or dark theme is selected
    (tab === 'dark' && !!selectedPreset?.light); // The dark tab and a system or light theme is selected

  useEffect(() => {
    if (isCustomColorDisabled) {
      setOpenCustomColor(null);
    }
  }, [isCustomColorDisabled]);
  return (
    <Collapsible
      open={isOpenCustomColors && !isCustomColorDisabled}
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
          disabled={isCustomColorDisabled}
          isDisabled={isCustomColorDisabled}
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
                    mainColor={getMainColor(widgetColor.key, tab, {
                      singleTheme: theme?.singleTheme,
                      colors: theme?.colors,
                    })}
                    secondColor={
                      isAutoTab
                        ? getMainColor(widgetColor.key, tab, {
                            singleTheme: theme?.singleTheme,
                            colors: theme?.colors,
                            mode: 'dark',
                          }) || ''
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
                  color={getMainColor(widgetColor.key, tab, {
                    singleTheme: theme?.singleTheme,
                    colors: theme?.colors,
                    mode: 'light',
                  })}
                  onChangeColor={(color) =>
                    onChangeColors({
                      name: widgetColor.key,
                      mode: 'light',
                      color,
                      singleTheme,
                    })
                  }
                  onReset={() => onResetColor(widgetColor.key, 'light')}
                  resetDisable={
                    getMainColor(widgetColor.key, tab, {
                      singleTheme: theme?.singleTheme,
                      colors: theme?.colors,
                      mode: 'light',
                    }) === selectedPreset?.light?.[widgetColor.key]
                  }
                />
                <Divider size={16} />

                <ColorPicker
                  label="Dark"
                  placeholder={widgetColor.label}
                  color={getMainColor(widgetColor.key, tab, {
                    singleTheme: theme?.singleTheme,
                    colors: theme?.colors,
                    mode: 'dark',
                  })}
                  onChangeColor={(color) =>
                    onChangeColors({
                      name: widgetColor.key,
                      mode: 'dark',
                      color,
                      singleTheme,
                    })
                  }
                  resetDisable={
                    getMainColor(widgetColor.key, tab, {
                      singleTheme: theme?.singleTheme,
                      colors: theme?.colors,
                      mode: 'dark',
                    }) === selectedPreset?.dark?.[widgetColor.key]
                  }
                  onReset={() => onResetColor(widgetColor.key, 'dark')}
                />
              </>
            ) : (
              <ColorPicker
                label="Main"
                placeholder={widgetColor.label}
                color={
                  getMainColor(widgetColor.key, tab, {
                    singleTheme: theme?.singleTheme,
                    colors: theme?.colors,
                    mode: 'dark',
                  }) || ''
                }
                onChangeColor={(color) =>
                  onChangeColors({
                    name: widgetColor.key,
                    mode: tab,
                    color,
                    singleTheme,
                  })
                }
                onReset={() => onResetColor(widgetColor.key, tab)}
                resetDisable={
                  getMainColor(widgetColor.key, tab, {
                    singleTheme: theme?.singleTheme,
                    colors: theme?.colors,
                    mode: 'dark',
                  }) ===
                  (selectedPreset
                    ? selectedPreset?.[tab]?.[widgetColor.key]
                    : undefined)
                }
              />
            )}
          </CustomColorCollapsible>
          <Divider size={10} />
        </div>
      ))}
    </Collapsible>
  );
}
