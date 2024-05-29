import type { PropTypes } from './ConfirmWalletsModal.types';
import type { ConnectedWallet } from '../../store/wallets';
import type { ConfirmSwapWarnings, Wallet } from '../../types';
import type { MouseEvent } from 'react';

import { i18n } from '@lingui/core';
import {
  Alert,
  BalanceErrors,
  Button,
  ChevronDownIcon,
  ChevronLeftIcon,
  CloseIcon,
  Divider,
  IconButton,
  MessageBox,
  PasteIcon,
  Typography,
  WalletIcon,
} from '@rango-dev/ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WIDGET_UI_ID } from '../../constants';
import { getQuoteErrorMessage } from '../../constants/errors';
import { getQuoteUpdateWarningMessage } from '../../constants/warnings';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { useWalletsStore } from '../../store/wallets';
import {
  getBlockchainDisplayNameFor,
  getBlockchainShortNameFor,
} from '../../utils/meta';
import { isConfirmSwapDisabled } from '../../utils/swap';
import { getQuoteWallets } from '../../utils/wallets';
import { WatermarkedModal } from '../common/WatermarkedModal';
import { CustomCollapsible } from '../CustomCollapsible/CustomCollapsible';
import { ExpandedIcon } from '../CustomCollapsible/CustomCollapsible.styles';

import { isValidAddress } from './ConfirmWallets.helpers';
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
  const navigate = useNavigate();
  const config = useAppStore().config;

  const customDestinationInputRef = useRef<HTMLInputElement | null>(null);

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

  const isFirefox = navigator?.userAgent.includes('Firefox');

  const quoteWallets = getQuoteWallets({
    filter: 'all',
    quote: selectedQuote,
  });

  const requiredWallets = getQuoteWallets({
    filter: 'required',
    quote: selectedQuote,
  });

  const lastStepToBlockchain = blockchains.find(
    (blockchain) =>
      blockchain.name ===
      selectedQuote?.swaps[selectedQuote?.swaps.length - 1].to.blockchain
  );
  const isWalletRequiredFor = (blockchain: string) =>
    requiredWallets.includes(blockchain);

  const getInitialSelectableWallets = useCallback(
    () =>
      connectedWallets.filter((connectedWallet) => {
        return (
          connectedWallet.selected &&
          quoteWallets.includes(connectedWallet.chain)
        );
      }),
    [connectedWallets.length, quoteWallets.length]
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

  const isAddressMatched =
    !!customDestination &&
    showCustomDestination &&
    lastStepToBlockchain &&
    !isValidAddress(lastStepToBlockchain, customDestination);

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

  const handleClearCustomDestination = () => setCustomDestination('');

  const handlePasteCustomDestination = async (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (navigator.clipboard !== undefined) {
      const pastedText = await navigator.clipboard.readText();
      setCustomDestination(pastedText);
      customDestinationInputRef?.current?.focus();
    }
  };

  const handleCustomDestinationCollapsibleOpenChange = (checked: boolean) => {
    if (!checked) {
      resetCustomDestination();
    } else {
      if (!isWalletRequiredFor(lastStepToBlockchain?.name ?? '')) {
        setSelectableWallets((selectableWallets) =>
          selectableWallets.map((selectableWallet) => {
            if (selectableWallet.chain === lastStepToBlockchain?.name) {
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
      showCustomDestination &&
      !isWalletRequiredFor(lastStepToBlockchain.name)
    ) {
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

    const result = await onCheckBalance?.({
      selectedWallets: selectableWallets.filter((wallet) => wallet.selected),
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

  const renderCustomDestinationSuffix = () => {
    if (customDestination) {
      return (
        <IconButton onClick={handleClearCustomDestination} variant="ghost">
          <CloseIcon size={12} color="gray" />
        </IconButton>
      );
    } else if (!isFirefox) {
      return (
        <IconButton onClick={handlePasteCustomDestination} variant="ghost">
          <PasteIcon size={16} />
        </IconButton>
      );
    }

    return null;
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
            quoteWallets.includes(connectedWallet.chain)
          );
        })
      );
      return nextState;
    });
  }, [connectedWallets.length, quoteWallets.length]);

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
  }, [connectedWallets.length, nextSelectedWallets.length]);

  const modalContainer = document.getElementById(
    WIDGET_UI_ID.SWAP_BOX_ID
  ) as HTMLDivElement;

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
              disabled={isConfirmSwapDisabled(
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
            {quoteWallets.map((requiredWallet, index) => {
              const blockchain = blockchains.find(
                (blockchain) => blockchain.name === requiredWallet
              );

              const key = `wallet-${index}`;
              const isLastWallet = index === quoteWallets.length - 1;

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
                      onConnect={(walletType) => {
                        addNextSelectedWallets(requiredWallet, walletType);
                      }}
                    />
                  </ListContainer>
                  {!isLastWallet && <Divider size={32} />}
                  {isLastWallet && config?.customDestination && (
                    <CustomDestination>
                      <CustomCollapsible
                        onOpenChange={
                          handleCustomDestinationCollapsibleOpenChange
                        }
                        hasSelected
                        open={showCustomDestination}
                        triggerAnchor="top"
                        trigger={
                          <CustomDestinationButton>
                            <div className="button__content">
                              <WalletIcon size={18} color="info" />
                              <Divider size={4} direction="horizontal" />
                              <Typography
                                variant="label"
                                size="medium"
                                color={
                                  showCustomDestination
                                    ? '$neutral600'
                                    : undefined
                                }>
                                {i18n.t('Send to a different address')}
                              </Typography>
                            </div>
                            <ExpandedIcon
                              orientation={
                                showCustomDestination ? 'up' : 'down'
                              }>
                              <ChevronDownIcon size={10} color="secondary" />
                            </ExpandedIcon>
                          </CustomDestinationButton>
                        }
                        onClickTrigger={() =>
                          setShowCustomDestination((prev) => !prev)
                        }>
                        <StyledTextField
                          ref={customDestinationInputRef}
                          style={{
                            padding: 0,
                            paddingRight: customDestination ? '8px' : '5px',
                          }}
                          autoFocus
                          placeholder={i18n.t(
                            'Enter {blockchainName} address',
                            {
                              blockchainName: getBlockchainDisplayNameFor(
                                requiredWallet,
                                blockchains
                              ),
                            }
                          )}
                          value={customDestination || ''}
                          suffix={renderCustomDestinationSuffix()}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCustomDestination(value);
                          }}
                          {...(!customDestination && { autoFocus: true })}
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
