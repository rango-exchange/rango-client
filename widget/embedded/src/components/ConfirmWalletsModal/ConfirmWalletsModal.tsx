import type { PropTypes } from './ConfirmWalletsModal.types';
import type { ConnectedWallet } from '../../store/wallets';
import type { ConfirmSwapWarnings, Wallet } from '../../types';

import { i18n } from '@lingui/core';
import {
  Alert,
  BalanceErrors,
  Button,
  ChevronDownIcon,
  ChevronLeftIcon,
  Divider,
  MessageBox,
  Typography,
  WalletIcon,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WIDGET_UI_ID } from '../../constants';
import { getQuoteErrorMessage } from '../../constants/errors';
import { getQuoteUpdateWarningMessage } from '../../constants/warnings';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { useWalletsStore } from '../../store/wallets';
import { getBlockchainShortNameFor } from '../../utils/meta';
import { confirmSwapDisabled } from '../../utils/swap';
import { WatermarkedModal } from '../common/WatermarkedModal';
import { CustomCollapsible } from '../CustomCollapsible/CustomCollapsible';
import { ExpandedIcon } from '../CustomCollapsible/CustomCollapsible.styles';

import { getRequiredWallets, isValidAddress } from './ConfirmWallets.helpers';
import {
  alarmsStyles,
  ConfirmButton,
  CustomDestination,
  CustomDestinationButton,
  ListContainer,
  NavigateBack,
  ShowMoreHeader,
  StyledTextField,
  Title,
  Wallets,
  WalletsContainer,
  walletsListStyles,
} from './ConfirmWallets.styles';
import { WalletList } from './WalletList';

const NUMBER_OF_WALLETS_TO_DISPLAY = 2;

export function ConfirmWalletsModal(props: PropTypes) {
  //TODO: move component's logics to a custom hook
  const { open, onClose, onCancel, onCheckBalance, loading } = props;
  const config = useAppStore().config;

  const blockchains = useAppStore().blockchains();
  const {
    selectedQuote,
    setSelectedWallets: selectQuoteWallets,
    quoteWalletsConfirmed: quoteWalletsConfirmed,
    setQuoteWalletConfirmed: setQuoteWalletConfirmed,
    customDestination,
    setCustomDestination,
  } = useQuoteStore();
  const { connectedWallets, selectWallets } = useWalletsStore();

  const [showMoreWalletFor, setShowMoreWalletFor] = useState('');
  const [balanceWarnings, setBalanceWarnings] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [quoteWarning, setQuoteWarning] = useState<
    ConfirmSwapWarnings['quoteUpdate'] | null
  >(null);
  const [showCustomDestination, setShowCustomDestination] = useState(
    !!customDestination
  );

  const requiredWallets = getRequiredWallets(selectedQuote?.swaps || null);

  const lastStepToBlockchain = blockchains.find(
    (blockchain) =>
      blockchain.name ===
      selectedQuote?.swaps[selectedQuote?.swaps.length - 1].to.blockchain
  );
  const isWalletRequiredFor = (blockchain: string) =>
    !!selectedQuote?.swaps.find((swap) => swap.from.blockchain === blockchain);

  const getInitialSelectableWallets = () =>
    connectedWallets.filter((connectedWallet) => {
      return (
        connectedWallet.selected &&
        requiredWallets.includes(connectedWallet.chain)
      );
    });

  const [selectableWallets, setSelectableWallets] = useState<ConnectedWallet[]>(
    getInitialSelectableWallets()
  );
  const lastStepToBlockchainMeta = blockchains.find(
    (chain) => chain.name === lastStepToBlockchain?.name
  );

  const isInsufficientBalanceModalOpen = balanceWarnings.length > 0;

  const isSelected = (walletType: string, chain: string) =>
    !!selectableWallets.find(
      (selectableWallet) =>
        selectableWallet.walletType === walletType &&
        selectableWallet.chain === chain &&
        selectableWallet.selected &&
        (isWalletRequiredFor(chain) ||
          (!isWalletRequiredFor(chain) && !customDestination))
    );

  const isAddressMatched =
    !!customDestination &&
    showCustomDestination &&
    lastStepToBlockchainMeta &&
    !isValidAddress(lastStepToBlockchainMeta, customDestination);

  const resetCustomDestination = () => {
    setShowCustomDestination(false);
    setCustomDestination(null);
    setSelectableWallets((selectableWallets) => {
      let anyWalletSelected = false;
      return selectableWallets.map((selectableWallet) => {
        if (
          !anyWalletSelected &&
          selectableWallet.chain === lastStepToBlockchain?.name
        ) {
          anyWalletSelected = true;
          return {
            ...selectableWallet,
            selected: true,
          };
        }
        return selectableWallet;
      });
    });
  };

  const onChange = (wallet: Wallet) => {
    if (showMoreWalletFor) {
      setShowMoreWalletFor('');
    }
    const selected = isSelected(wallet.walletType, wallet.chain);
    if (selected) {
      return;
    }
    const connectedWallet = connectedWallets.find(
      (connectedWallet) =>
        connectedWallet.walletType === wallet.walletType &&
        connectedWallet.chain === wallet.chain
    );

    if (!connectedWallet) {
      return;
    }

    onCancel();
    if (wallet.chain === lastStepToBlockchain?.name && showCustomDestination) {
      setShowCustomDestination(false);
      setCustomDestination(null);
    }
    setSelectableWallets((selectableWallets) =>
      selectableWallets
        .filter((selectableWallet) => selectableWallet.chain !== wallet.chain)
        .concat({ ...connectedWallet, selected: true })
    );
  };

  const onConfirmBalance = () => {
    const lastSelectedWallets = selectableWallets.filter(
      (wallet) => wallet.selected
    );
    selectWallets(lastSelectedWallets);
    selectQuoteWallets(lastSelectedWallets);
    setQuoteWalletConfirmed(true);
    onClose();
  };

  const onConfirmWallets = async () => {
    setBalanceWarnings([]);
    setError('');
    setQuoteWarning(null);
    const selectedWallets = connectedWallets.filter((connectedWallet) =>
      selectableWallets.find(
        (selectableWallet) =>
          selectableWallet.chain === connectedWallet.chain &&
          selectableWallet.walletType === connectedWallet.walletType
      )
    );
    const result = await onCheckBalance?.({
      selectedWallets,
      customDestination,
    });
    const warnings = result.warnings;
    if (warnings?.balance?.messages) {
      setBalanceWarnings(warnings.balance.messages);
    }
    if (warnings?.quoteUpdate) {
      setQuoteWarning(warnings.quoteUpdate);
    }
    if (result.error) {
      setError(getQuoteErrorMessage(result.error));
    }

    if (!result.error && (!warnings?.balance?.messages.length || 0 > 0)) {
      onConfirmBalance();
    } else {
      setBalanceWarnings(warnings?.balance?.messages ?? []);
    }
  };

  useEffect(() => {
    setSelectableWallets((selectableWallets) =>
      selectableWallets.concat(
        connectedWallets.filter((connectedWallet) => {
          const anyWalletSelected = !!selectableWallets.find(
            (selectableWallet) =>
              selectableWallet.chain === connectedWallet.chain
          );

          return (
            !anyWalletSelected &&
            connectedWallet.selected &&
            requiredWallets.includes(connectedWallet.chain)
          );
        })
      )
    );
  }, [connectedWallets.length]);

  const modalContainer = document.getElementById(
    WIDGET_UI_ID.SWAP_BOX_ID
  ) as HTMLDivElement;

  const navigate = useNavigate();

  return (
    <WatermarkedModal
      open={open}
      onClose={() => {
        if (!quoteWalletsConfirmed) {
          const home = '../';
          navigate(home, { replace: true });
        }
        onClose();
      }}
      dismissible={!showMoreWalletFor}
      container={modalContainer}
      {...(!showMoreWalletFor && {
        footer: (
          <ConfirmButton>
            <Button
              loading={loading}
              disabled={confirmSwapDisabled(
                loading,
                showCustomDestination,
                customDestination,
                selectedQuote,
                selectableWallets,
                lastStepToBlockchain
              )}
              onClick={onConfirmWallets}
              variant="contained"
              type="primary"
              fullWidth
              size="large">
              {i18n.t('Confirm')}
            </Button>
          </ConfirmButton>
        ),
      })}
      {...(showMoreWalletFor && {
        styles: { container: { padding: '$0' } },
        header: (
          <ShowMoreHeader>
            <NavigateBack
              variant="ghost"
              onClick={setShowMoreWalletFor.bind(null, '')}>
              <ChevronLeftIcon size={16} />
            </NavigateBack>
            <Typography variant="headline" size="small">
              {i18n.t({
                id: 'Your {blockchainName} wallets',
                values: {
                  blockchainName: getBlockchainShortNameFor(
                    showMoreWalletFor,
                    blockchains
                  ),
                },
              })}
            </Typography>
          </ShowMoreHeader>
        ),
      })}
      anchor="center">
      <WatermarkedModal
        open={isInsufficientBalanceModalOpen}
        onClose={setBalanceWarnings.bind(null, [])}
        container={modalContainer}>
        <MessageBox
          title={i18n.t('Insufficient account balance')}
          type="error"
          description={<BalanceErrors messages={balanceWarnings ?? []} />}>
          <Button
            variant="outlined"
            size="large"
            type="primary"
            fullWidth
            onClick={onConfirmBalance}>
            {i18n.t('Proceed anyway')}
          </Button>
        </MessageBox>
      </WatermarkedModal>
      {showMoreWalletFor && (
        <WalletsContainer>
          <div className={walletsListStyles()}>
            <WalletList
              chain={showMoreWalletFor}
              isSelected={isSelected}
              selectWallet={onChange}
              onShowMore={setShowMoreWalletFor.bind(null, showMoreWalletFor)}
            />
          </div>
        </WalletsContainer>
      )}
      {!showMoreWalletFor && (
        <>
          {error && (
            <>
              <Alert variant="alarm" type="error" title={i18n.t(error)} />
              <Divider size={12} />
            </>
          )}
          {quoteWarning && (
            <>
              <Alert
                variant="alarm"
                type="warning"
                title={getQuoteUpdateWarningMessage(quoteWarning)}
              />
              <Divider size={12} />
            </>
          )}
          <Wallets>
            {requiredWallets.map((requiredWallet, index) => {
              const blockchain = blockchains.find(
                (blockchain) => blockchain.name === requiredWallet
              );

              const key = `wallet-${index}`;
              const isLastWallet = index === requiredWallets.length - 1;

              return (
                <div key={key}>
                  <Title>
                    <Typography variant="title" size="xmedium">
                      {i18n.t({
                        id: 'Your {blockchainName} wallets',
                        values: { blockchainName: blockchain?.shortName },
                      })}
                    </Typography>
                    <Typography
                      variant="label"
                      color="$neutral700"
                      size="medium">
                      {i18n.t({
                        id: 'You need to connect a {blockchainName} wallet.',
                        values: { blockchainName: blockchain?.shortName },
                      })}
                    </Typography>
                  </Title>
                  <Divider size={24} />
                  <ListContainer>
                    <WalletList
                      chain={requiredWallet}
                      isSelected={isSelected}
                      selectWallet={onChange}
                      limit={NUMBER_OF_WALLETS_TO_DISPLAY}
                      onShowMore={() =>
                        setShowMoreWalletFor(blockchain?.name ?? '')
                      }
                    />
                  </ListContainer>
                  {!isLastWallet && <Divider size={32} />}
                  {isLastWallet && config?.customDestination && (
                    <CustomDestination>
                      <CustomCollapsible
                        onOpenChange={(checked) => {
                          if (!checked) {
                            resetCustomDestination();
                          } else {
                            if (
                              !isWalletRequiredFor(
                                lastStepToBlockchain?.name ?? ''
                              )
                            ) {
                              setSelectableWallets((selectableWallets) =>
                                selectableWallets.map((selectableWallet) => {
                                  if (
                                    selectableWallet.chain ===
                                    lastStepToBlockchain?.name
                                  ) {
                                    return {
                                      ...selectableWallet,
                                      selected: false,
                                    };
                                  }
                                  return selectableWallet;
                                })
                              );
                            }
                          }
                        }}
                        hasSelected
                        open={showCustomDestination}
                        triggerAnchor="top"
                        trigger={
                          <CustomDestinationButton
                            fullWidth
                            variant="default"
                            suffix={
                              <ExpandedIcon
                                orientation={
                                  showCustomDestination ? 'up' : 'down'
                                }>
                                <ChevronDownIcon size={10} color="gray" />
                              </ExpandedIcon>
                            }>
                            <div className="button__content">
                              <WalletIcon size={18} color="info" />
                              <Divider size={4} direction="horizontal" />
                              <Typography variant="label" size="medium">
                                {i18n.t('Send to a different address')}
                              </Typography>
                            </div>
                          </CustomDestinationButton>
                        }
                        onClickTrigger={() =>
                          setShowCustomDestination((prev) => !prev)
                        }>
                        <Divider size={4} />
                        <StyledTextField
                          autoFocus
                          placeholder={i18n.t('Your destination address')}
                          value={customDestination || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!value.length) {
                              setShowCustomDestination(false);
                              setCustomDestination(null);
                            } else {
                              setCustomDestination(value.length ? value : null);
                            }
                          }}
                        />
                      </CustomCollapsible>

                      {isAddressMatched && (
                        <div className={alarmsStyles()}>
                          <Alert
                            variant="alarm"
                            type="error"
                            title={i18n.t({
                              values: { destination: customDestination },
                              id: "Address {destination} doesn't match the blockchain address pattern.",
                            })}
                          />
                        </div>
                      )}
                    </CustomDestination>
                  )}
                </div>
              );
            })}
          </Wallets>
        </>
      )}
    </WatermarkedModal>
  );
}
