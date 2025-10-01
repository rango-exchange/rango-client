import type { Wallet } from '../../types';
import type { MouseEvent } from 'react';

import { i18n } from '@lingui/core';
import {
  Alert,
  Button,
  CloseIcon,
  Divider,
  IconButton,
  Image,
  TextField,
  Typography,
} from '@rango-dev/ui';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WalletList } from '../../components/ConfirmWalletsModal/WalletList';
import { Layout } from '../../components/Layout';
import { MoreWalletsToSelect } from '../../components/MoreWalletsToSelect/MoreWalletsToSelect';
import { ListContainer } from '../../components/MoreWalletsToSelect/MoreWalletsToSelect.styles';
import { navigationRoutes } from '../../constants/navigationRoutes';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { isBrowserSupportClipboardPaste } from '../../utils/common';
import { isValidTokenAddress } from '../../utils/meta';

import {
  Container,
  getTextFieldStyles,
  Separator,
} from './DestinationWalletPage.styles';

const NUMBER_OF_WALLETS_TO_DISPLAY = 2;

export function DestinationWalletPage() {
  const { toBlockchain, customDestination, setCustomDestination } =
    useQuoteStore();
  const destinationWallet = useAppStore().selectedWallet('destination');
  const {
    setSelectedWallet,
    clearSelectedWallet,
    checkAndClearCustomDestinationIfNeeded,
  } = useAppStore();
  const navigate = useNavigate();
  const [showConfirmationError, setShowConfirmationError] = useState(false);
  const [
    showCustomDestinationValidationError,
    setShowCustomDestinationValidationError,
  ] = useState(false);
  const [showCustomDestinationMessage, setShowCustomDestinationMessage] =
    useState(false);
  const [showMoreWallets, setShowMoreWallets] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const destination =
    customDestination && toBlockchain
      ? { address: customDestination, blockchain: toBlockchain.name }
      : destinationWallet;

  useEffect(() => {
    if (!toBlockchain) {
      navigate(`../${navigationRoutes.wallets}${location.search}`, {
        replace: true,
      });
    }

    if (destination && !('walletType' in destination)) {
      setShowCustomDestinationMessage(true);
    }

    return checkAndClearCustomDestinationIfNeeded;
  }, []);

  if (!toBlockchain) {
    return null;
  }

  const handleClear = () => {
    resetState();
    setCustomDestination(null);
  };

  const renderSuffix = () => {
    if (destination && !('walletType' in destination)) {
      return (
        <IconButton
          size="small"
          id="widget-destination-wallets-page-custom-destination-close-icon-btn"
          onClick={handleClear}
          variant="ghost">
          <CloseIcon size={8} color="white" />
        </IconButton>
      );
    } else if (isBrowserSupportClipboardPaste()) {
      return (
        <Button
          id="widget-destination-wallets-page-custom-destination-paste-icon-btn"
          variant="ghost"
          size="xsmall"
          onClick={handlePaste}>
          <Typography variant="body" size="small" color="neutral700">
            {i18n.t('Paste')}
          </Typography>
        </Button>
      );
    }

    return null;
  };

  const isSelected = (walletType: string, blockchain: string) => {
    return (
      !!destination &&
      'walletType' in destination &&
      walletType === destination.walletType &&
      blockchain === destination.chain
    );
  };

  const selectWallet = (wallet: Wallet) => {
    resetState();
    setShowMoreWallets(false);
    clearSelectedWallet('destination');
    setSelectedWallet({
      kind: 'destination',
      wallet: {
        address: wallet.address,
        blockchain: wallet.chain,
        type: wallet.walletType,
      },
    });
  };

  const handlePaste = async (event: MouseEvent<HTMLButtonElement>) => {
    resetState();
    event.preventDefault();
    if (navigator.clipboard !== undefined) {
      const pastedText = await navigator.clipboard.readText();
      clearSelectedWallet('destination');
      setCustomDestination(pastedText);
      inputRef?.current?.focus();
    }
  };

  const handleConfirmWallets = () => {
    if (!destination) {
      return setShowConfirmationError(true);
    }
    const invalidAddress =
      destination &&
      destination.address !== '' &&
      !('walletType' in destination) &&
      !isValidTokenAddress(toBlockchain, destination.address);

    if (invalidAddress) {
      return setShowCustomDestinationValidationError(true);
    }

    navigate('../');
  };

  const resetState = () => {
    setShowConfirmationError(false);
    setShowCustomDestinationValidationError(false);
    setShowCustomDestinationMessage(false);
  };

  return (
    <>
      {showMoreWallets && (
        <MoreWalletsToSelect
          blockchain={toBlockchain.name}
          selectWallet={selectWallet}
          isSelected={isSelected}
          onClickBack={() => setShowMoreWallets(false)}
        />
      )}
      {!showMoreWallets && (
        <Layout
          header={{ title: i18n.t('Recipient Address') }}
          footer={
            <Button
              id="widget-destination-wallet-page-done-btn"
              onClick={handleConfirmWallets}
              variant="contained"
              type="primary"
              fullWidth
              size="large">
              {i18n.t('Done')}
            </Button>
          }>
          <Container>
            {showConfirmationError && (
              <>
                <Alert
                  type="error"
                  variant="alarm"
                  title={i18n.t(
                    'You need to connect wallet or add a custom address to proceed.'
                  )}
                />
                <Divider size={16} />
              </>
            )}
            <div>
              <Typography variant="title" size="xmedium">
                {i18n.t('Choose {destinationBlockchain} wallet', {
                  destinationBlockchain: toBlockchain?.name,
                })}
              </Typography>
              <Divider size={4} />
              <Typography variant="body" size="medium" color="neutral700">
                {i18n.t(
                  'You can choose a wallet for {destinationBlockchainDisplayName} or add a custom address  you want to receive your assets.',
                  {
                    destinationBlockchainDisplayName: toBlockchain?.displayName,
                  }
                )}
              </Typography>
              <Divider size={16} />
              <ListContainer>
                <WalletList
                  chain={toBlockchain?.name}
                  quoteChains={[toBlockchain.name]}
                  isSelected={isSelected}
                  selectWallet={selectWallet}
                  limit={NUMBER_OF_WALLETS_TO_DISPLAY}
                  onShowMore={() => setShowMoreWallets(true)}
                />
              </ListContainer>
              <Divider size="32" />
              <Separator>
                <Typography variant="body" size="small" color="neutral700">
                  {i18n.t('or set a custom address')}
                </Typography>
              </Separator>
              <Divider size="32" />
              <TextField
                id="widget-destination-wallets-page-custom-destination-blockchain-address-input"
                style={getTextFieldStyles(
                  !showCustomDestinationMessage,
                  showCustomDestinationValidationError
                )}
                ref={inputRef}
                variant="outlined"
                status={
                  showCustomDestinationValidationError ? 'error' : 'default'
                }
                placeholder={i18n.t('{blockchain} Recipient Address', {
                  blockchain: toBlockchain.displayName,
                })}
                prefix={
                  <>
                    <Image size={24} src={toBlockchain.logo} />
                    <Divider size={8} direction="horizontal" />
                  </>
                }
                suffix={renderSuffix()}
                value={
                  destination && !('walletType' in destination)
                    ? destination.address
                    : ''
                }
                onChange={(event) => {
                  resetState();
                  setCustomDestination(event.target.value);
                }}
              />
              {showCustomDestinationValidationError && (
                <>
                  <Divider size={4} />
                  <Typography variant="body" size="small" color="error500">
                    {i18n.t("Address doesn't match the destination chain.")}
                  </Typography>
                </>
              )}
              {showCustomDestinationMessage && (
                <>
                  <Divider size={4} />
                  <Typography variant="body" size="small" color="neutral700">
                    {i18n.t('Your asset will be transferred to this address.')}
                  </Typography>
                </>
              )}
            </div>
          </Container>
        </Layout>
      )}
    </>
  );
}
