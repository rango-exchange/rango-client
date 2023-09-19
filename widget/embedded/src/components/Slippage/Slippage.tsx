import { i18n } from '@lingui/core';
import {
  Chip,
  Divider,
  InfoIcon,
  TextField,
  Tooltip,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import {
  MAX_SLIPPAGE,
  MIN_SLIPPGAE,
  SLIPPAGES,
} from '../../constants/swapSettings';
import { useSettingsStore } from '../../store/settings';

import { BaseContainer, Head, SlippageChipsContainer } from './Slippage.styles';
import { SlippageTooltipContent } from './SlippageTooltipContent';

export function Slippage() {
  const slippage = useSettingsStore.use.slippage();
  const setSlippage = useSettingsStore.use.setSlippage();
  const customSlippage = useSettingsStore.use.customSlippage();
  const setCustomSlippage = useSettingsStore.use.setCustomSlippage();

  return (
    <BaseContainer>
      <Head>
        <Typography variant="title" size="xmedium">
          {i18n.t('Slippage tolerance per swap')}
        </Typography>
        <Divider direction="horizontal" size={4} />
        <Tooltip side="top" content={<SlippageTooltipContent />}>
          <InfoIcon color="gray" />
        </Tooltip>
      </Head>
      <SlippageChipsContainer>
        {SLIPPAGES.map((slippageItem, index) => {
          const key = `slippage-${index}`;
          return (
            <>
              <Chip
                style={{ width: '64px', flexShrink: 0 }}
                key={key}
                onClick={() => {
                  if (customSlippage) {
                    setCustomSlippage(null);
                  }
                  setSlippage(slippageItem);
                }}
                selected={!customSlippage && slippageItem === slippage}
                label={`${slippageItem.toString()}%`}
              />
              <Divider direction="horizontal" size={8} />
            </>
          );
        })}
        <TextField
          type="number"
          min="0.01"
          max="30"
          step="0.01"
          fullWidth
          variant="contained"
          value={customSlippage || ''}
          color="dark"
          onChange={(event) => {
            const parsedValue = parseFloat(event.target.value);
            if (
              !parsedValue ||
              (parsedValue >= MIN_SLIPPGAE && parsedValue <= MAX_SLIPPAGE)
            ) {
              setCustomSlippage(parsedValue);
            }
          }}
          suffix={
            customSlippage && (
              <Typography variant="body" size="small">
                %
              </Typography>
            )
          }
          placeholder="Custom"
        />
      </SlippageChipsContainer>
    </BaseContainer>
  );
}
