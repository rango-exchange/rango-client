import { i18n } from '@lingui/core';
import {
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
import { useAppStore } from '../../store/AppStore';
import { getContainer } from '../../utils/common';

import {
  BaseContainer,
  Head,
  SlippageChip,
  SlippageChipsContainer,
} from './Slippage.styles';
import { SlippageTooltipContent } from './SlippageTooltipContent';

export function Slippage() {
  const { slippage, setSlippage, customSlippage, setCustomSlippage } =
    useAppStore();

  return (
    <BaseContainer>
      <Head>
        <Typography variant="title" size="xmedium">
          {i18n.t('Slippage tolerance per swap')}
        </Typography>
        <Divider direction="horizontal" size={4} />
        <Tooltip
          container={getContainer()}
          side="top"
          sideOffset={4}
          content={<SlippageTooltipContent />}>
          <InfoIcon color="gray" />
        </Tooltip>
      </Head>
      <SlippageChipsContainer>
        {SLIPPAGES.map((slippageItem, index) => {
          const key = `slippage-${index}`;
          return (
            <>
              <SlippageChip
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
            const value = event.target.value;
            const parsedValue = parseFloat(value);
            if (parsedValue >= MIN_SLIPPGAE && parsedValue <= MAX_SLIPPAGE) {
              setCustomSlippage(parsedValue);
            } else {
              setCustomSlippage(null);
            }
          }}
          suffix={
            customSlippage && (
              <Typography variant="body" size="small">
                %
              </Typography>
            )
          }
          placeholder={i18n.t('Custom')}
        />
      </SlippageChipsContainer>
    </BaseContainer>
  );
}
