import type { PropTypes } from './CustomDestination.types';
import type { MouseEvent } from 'react';

import { i18n } from '@lingui/core';
import {
  Alert,
  ChevronDownIcon,
  CloseIcon,
  Divider,
  IconButton,
  PasteIcon,
  Typography,
  WalletIcon,
} from '@arlert-dev/ui';
import React, { useEffect, useRef } from 'react';

import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import {
  getBlockchainDisplayNameFor,
  isValidTokenAddress,
} from '../../utils/meta';
import { CustomCollapsible } from '../CustomCollapsible/CustomCollapsible';
import { ExpandedIcon } from '../CustomCollapsible/CustomCollapsible.styles';

import {
  Container,
  CustomDestinationButton,
  StyledTextField,
} from './CustomDestination.styles';

export function CustomDestination(props: PropTypes) {
  const { blockchain, handleOpenChange, open } = props;

  const { customDestination, setCustomDestination } = useQuoteStore();
  const { config } = useAppStore();
  const blockchains = useAppStore().blockchains();
  const blockchainName = getBlockchainDisplayNameFor(
    blockchain.name,
    blockchains
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const configDestination =
    config?.defaultCustomDestinations?.[blockchain.name];

  const isFirefox = navigator?.userAgent.includes('Firefox');
  const isAddressChecked = open && !!customDestination && blockchain;
  const isAddressInvalid =
    isAddressChecked && !isValidTokenAddress(blockchain, customDestination);
  const handleClear = () => {
    setCustomDestination('');
  };

  const handlePaste = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (navigator.clipboard !== undefined) {
      const pastedText = await navigator.clipboard.readText();
      setCustomDestination(pastedText);
      inputRef?.current?.focus();
    }
  };

  const renderSuffix = () => {
    if (customDestination) {
      return (
        <IconButton
          id="widget-custom-destination-close-icon-btn"
          onClick={handleClear}
          variant="ghost">
          <CloseIcon size={12} color="gray" />
        </IconButton>
      );
    } else if (!isFirefox) {
      return (
        <IconButton
          id="widget-custom-destination-paste-icon-btn"
          onClick={handlePaste}
          variant="ghost">
          <PasteIcon size={16} />
        </IconButton>
      );
    }

    return null;
  };

  useEffect(() => {
    const shouldUseConfigDestination =
      !!configDestination && customDestination === null;

    if (shouldUseConfigDestination) {
      setCustomDestination(configDestination);
      handleOpenChange(true);
    }
  }, [configDestination]);

  return (
    <Container>
      <CustomCollapsible
        onOpenChange={handleOpenChange}
        hasSelected
        open={open}
        triggerAnchor="top"
        trigger={
          <CustomDestinationButton id="widget-custom-destination-collapsible-btn">
            <div className="button__content">
              <WalletIcon size={18} color="info" />
              <Divider size={4} direction="horizontal" />
              <Typography
                variant="label"
                size="medium"
                color={open ? '$neutral600' : undefined}>
                {i18n.t('Send to a different address')}
              </Typography>
            </div>
            <ExpandedIcon orientation={open ? 'up' : 'down'}>
              <ChevronDownIcon size={10} color="secondary" />
            </ExpandedIcon>
          </CustomDestinationButton>
        }
        onClickTrigger={() => handleOpenChange(!open)}>
        <StyledTextField
          id="widget-custom-destination-blockchain-address-input"
          ref={inputRef}
          style={{
            padding: 0,
            paddingRight: customDestination ? '8px' : '5px',
          }}
          autoFocus={!customDestination}
          placeholder={i18n.t('Enter {blockchainName} address', {
            blockchainName,
          })}
          value={customDestination || ''}
          suffix={renderSuffix()}
          onChange={(e) => {
            const customDestination = e.target.value;
            setCustomDestination(customDestination);
          }}
        />
      </CustomCollapsible>

      {isAddressInvalid && (
        <>
          <Divider size={4} />
          <Alert
            variant="alarm"
            type="error"
            title={i18n.t({
              values: { destination: customDestination },
              id: "Address {destination} doesn't match the blockchain address pattern.",
            })}
          />
        </>
      )}
    </Container>
  );
}
