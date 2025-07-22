import type { PropTypes } from './ConfirmWalletsModal.types';
import type { ConnectedWallet } from '../../store/slices/wallets';
import type { Wallet } from '../../types';

import { i18n } from '@lingui/core';
import {
  Alert,
  BalanceErrors,
  Button,
  ChevronLeftIcon,
  Divider,
  MessageBox,
  Typography,
} from '@arlert-dev/ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WIDGET_UI_ID } from '../../constants';
import { getQuoteErrorMessage } from '../../constants/errors';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { getBlockchainShortNameFor } from '../../utils/meta';
import { isConfirmSwapDisabled } from '../../utils/swap';
import { getQuoteChains } from '../../utils/wallets';
import { WatermarkedModal } from '../common/WatermarkedModal';
import { CustomDestination } from '../CustomDestination/CustomDestination';

import {
  ConfirmButton,
  ListContainer,
  NavigateBack,
  ShowMoreHeader,
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
  const navigate = useNavigate();
  const blockchains = useAppStore().blockchains();
  const {
    selectedQuote,
    setSelectedWallets: selectQuoteWallets,
    quoteWalletsConfirmed: quoteWalletsConfirmed,
    setQuoteWalletConfirmed: setQuoteWalletConfirmed,
    customDestination,
    setCustomDestination,
  } = useQuoteStore();
  const { config, connectedWallets, setWalletsAsSelected } = useAppStore();

  const [showMoreWalletFor, setShowMoreWalletFor] = useState('');
  const [balanceWarnings, setBalanceWarnings] = useState<string[]>([]);
  const [error, setError] = useState('');

  const [isCustomDestinationOpen, setCustomDestinationOpen] = useState(
    !!customDestination
  );

  const quoteChains = useMemo(
    () =>
      getQuoteChains({
        filter: 'all',
        quote: selectedQuote,
      }),
    [selectedQuote]
  );

  const requiredChains = getQuoteChains({
    filter: 'required',
    quote: selectedQuote,
  });

  const lastStepToBlockchain = blockchains.find(
    (blockchain) =>
      blockchain.name ===
      selectedQuote?.swaps[selectedQuote?.swaps.length - 1].to.blockchain
  );
  const isWalletRequiredFor = (blockchain: string) =>
    requiredChains.includes(blockchain);

  const getInitialSelectableWallets = useCallback(
    () =>
      connectedWallets.filter((connectedWallet) => {
        return (
          connectedWallet.selected &&
          quoteChains.includes(connectedWallet.chain)
        );
      }),
    [connectedWallets, quoteChains]
  );

  const [selectableWallets, setSelectableWallets] = useState<ConnectedWallet[]>(
    getInitialSelectableWallets()
  );
  const [nextSelectedWallets, setNextSelectedWallets] = useState<
    {
      blockchain: string;
      walletType: string;
    }[]
  >([]);

  const addNextSelectedWallets = (blockchain: string, walletType: string) =>
    setNextSelectedWallets((prevState) =>
      prevState.concat({
        blockchain,
        walletType,
      })
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

  const updateSelectableWallets = (
    wallets: ConnectedWallet[],
    chainName: string,
    shouldSelect: boolean
  ) => {
    let isAnyWalletSelected = false;
    return wallets.map((wallet) => {
      if (wallet.chain === chainName) {
        let selected = wallet.selected;
        if (!isAnyWalletSelected && shouldSelect) {
          isAnyWalletSelected = true;
          selected = true;
        } else if (!shouldSelect) {
          selected = false;
        }
        return {
          ...wallet,
          selected,
        };
      }
      return wallet;
    });
  };

  const handleCustomDestinationCollapsibleOpenChange = (open: boolean) => {
    setCustomDestinationOpen(open);
    if (!open) {
      setCustomDestination('');
      setSelectableWallets((selectableWallets) => {
        return updateSelectableWallets(
          selectableWallets,
          lastStepToBlockchain?.name || '',
          true
        );
      });
    } else {
      if (!isWalletRequiredFor(lastStepToBlockchain?.name ?? '')) {
        setSelectableWallets((selectableWallets) => {
          return updateSelectableWallets(
            selectableWallets,
            lastStepToBlockchain?.name || '',
            false
          );
        });
      }
    }
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
    if (
      wallet.chain === lastStepToBlockchain?.name &&
      isCustomDestinationOpen &&
      !isWalletRequiredFor(lastStepToBlockchain.name)
    ) {
      setCustomDestinationOpen(false);
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
    setWalletsAsSelected(lastSelectedWallets);
    selectQuoteWallets(lastSelectedWallets);
    setQuoteWalletConfirmed(true);
    onClose();
  };

  const onConfirmWallets = async () => {
    setBalanceWarnings([]);
    setError('');

    const result = await onCheckBalance?.({
      selectedWallets: selectableWallets.filter((wallet) => wallet.selected),
      customDestination,
    });
    const warnings = result.warnings;
    if (warnings?.balance?.messages) {
      setBalanceWarnings(warnings.balance.messages);
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
    setSelectableWallets((selectableWallets) => {
      let nextState: typeof selectableWallets = [];

      //if wallet disconnected we should unselect the wallet from the list
      selectableWallets.forEach((selectableWallet) => {
        const walletDisconnected = !connectedWallets.some(
          (connectedWallet) =>
            connectedWallet.chain === selectableWallet.chain &&
            connectedWallet.walletType === selectableWallet.walletType &&
            connectedWallet.address === selectableWallet.address
        );
        if (!walletDisconnected) {
          nextState.push(selectableWallet);
        }
      });

      /**
       * We confirm if a newly connected wallet for a blockchain is marked as selected in the store,
       * but there are no selected wallets for that blockchain in our list.
       * If this condition is met, we include the wallet in our list as selected.
       */
      nextState = nextState.concat(
        connectedWallets.filter((connectedWallet) => {
          const anyWalletSelected = !!nextState.find(
            (selectableWallet) =>
              selectableWallet.chain === connectedWallet.chain
          );

          return (
            !anyWalletSelected &&
            connectedWallet.selected &&
            quoteChains.includes(connectedWallet.chain)
          );
        })
      );
      return nextState;
    });
  }, [connectedWallets, quoteChains]);

  useEffect(() => {
    const nextState: typeof nextSelectedWallets = [];

    if (nextSelectedWallets.length > 0) {
      nextSelectedWallets.forEach((selectedWallet) => {
        const wallet = connectedWallets.find(
          (wallet) =>
            wallet.chain === selectedWallet.blockchain &&
            wallet.walletType === selectedWallet.walletType
        );
        if (wallet) {
          onChange(wallet);
        } else {
          nextState.push(selectedWallet);
        }
      });
      setNextSelectedWallets(nextState);
    }
  }, [connectedWallets, nextSelectedWallets]);

  const modalContainer = document.getElementById(
    WIDGET_UI_ID.SWAP_BOX_ID
  ) as HTMLDivElement;

  return (
    <WatermarkedModal
      id="widget-confirm-wallets-modal"
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
        styles: { container: { height: '100%' } },
        footer: (
          <ConfirmButton>
            <Button
              id="widget-confirm-wallet-modal-confirm-btn"
              loading={loading}
              disabled={isConfirmSwapDisabled(
                loading,
                isCustomDestinationOpen,
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
        styles: { container: { height: '100%', padding: '$0' } },
        header: (
          <ShowMoreHeader>
            <NavigateBack
              id="widget-confirm-wallet-modal-navigate-back-icon-btn"
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
        id='"widget-confirm-wallets-insufficient-account-balance-modal'
        open={isInsufficientBalanceModalOpen}
        onClose={setBalanceWarnings.bind(null, [])}
        container={modalContainer}>
        <MessageBox
          title={i18n.t('Insufficient account balance')}
          type="error"
          description={<BalanceErrors messages={balanceWarnings ?? []} />}>
          <Button
            id="widget-confirm-wallet-modal-proceed-anyway-btn"
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
              quoteChains={quoteChains}
              isSelected={isSelected}
              selectWallet={onChange}
              onShowMore={() => setShowMoreWalletFor(showMoreWalletFor)}
              onConnect={(walletType) => {
                addNextSelectedWallets(showMoreWalletFor, walletType);
              }}
            />
          </div>
        </WalletsContainer>
      )}
      {!showMoreWalletFor && (
        <>
          {error && (
            <>
              <Alert
                id="widget-confirm-wallet-modal-error-alert"
                variant="alarm"
                type="error"
                title={i18n.t(error)}
              />
              <Divider size={12} />
            </>
          )}
          <Wallets>
            {quoteChains.map((requiredWallet, index) => {
              const blockchain = blockchains.find(
                (blockchain) => blockchain.name === requiredWallet
              );

              const key = `wallet-${index}`;
              const isLastWallet = index === quoteChains.length - 1;
              const showCustomDestination =
                isLastWallet &&
                lastStepToBlockchain &&
                config?.customDestination !== false;
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
                      quoteChains={quoteChains}
                      isSelected={isSelected}
                      selectWallet={onChange}
                      limit={NUMBER_OF_WALLETS_TO_DISPLAY}
                      onShowMore={() =>
                        setShowMoreWalletFor(blockchain?.name ?? '')
                      }
                      onConnect={(walletType) => {
                        addNextSelectedWallets(requiredWallet, walletType);
                      }}
                    />
                  </ListContainer>
                  {!isLastWallet && <Divider size={32} />}
                  {showCustomDestination && (
                    <CustomDestination
                      blockchain={lastStepToBlockchain}
                      open={isCustomDestinationOpen}
                      handleOpenChange={
                        handleCustomDestinationCollapsibleOpenChange
                      }
                    />
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
