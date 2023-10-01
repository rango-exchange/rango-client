import type { PropTypes } from './ConfirmWalletsModal.types';
import type { ConnectedWallet } from '../../store/wallets';
import type { ConfirmSwapWarnings, Wallet } from '../../types';

import {
  Alert,
  BalanceErrors,
  Button,
  ChevronDownIcon,
  ChevronLeftIcon,
  Divider,
  MessageBox,
  Modal,
  Typography,
  WalletIcon,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { getConfirmSwapErrorMessage } from '../../constants/errors';
import { getRouteWarningMessage } from '../../constants/warnings';
import { useBestRouteStore } from '../../store/bestRoute';
import { useMetaStore } from '../../store/meta';
import { useWalletsStore } from '../../store/wallets';
import { confirmSwapDisabled } from '../../utils/swap';

import { getRequiredWallets, isValidAddress } from './ConfirmWallets.helpers';
import {
  CollapsibleContent,
  CollapsibleRoot,
  ConfirmButton,
  CustomDestination,
  CustomDestinationButton,
  ExpandedIcon,
  ListContainer,
  NavigateBack,
  ShowMoreHeader,
  StyledTextField,
  Title,
  Trigger,
  Wallets,
  WalletsContainer,
} from './ConfirmWallets.styles';
import { WalletList } from './WalletList';

const NUMBER_OF_WALLETS_TO_DISPLAY = 2;

export function ConfirmWalletsModal(props: PropTypes) {
  //TODO: move component's logics to a custom hook
  const { open, onClose, onCancel, onCheckBalance, config, loading } = props;
  const { blockchains } = useMetaStore.use.meta();
  const {
    bestRoute,
    setSelectedWallets: selectRouteWallets,
    setRouteWalletConfirmed,
    customDestination,
    setCustomDestination,
  } = useBestRouteStore();
  const { connectedWallets, selectWallets } = useWalletsStore();

  const [showMoreWalletFor, setShowMoreWalletFor] = useState('');
  const [balanceWarnings, setBalanceWarnings] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [routeWarning, setRouteWarning] = useState<
    ConfirmSwapWarnings['route'] | null
  >(null);
  const [destination, setDestination] = useState(customDestination);
  const [showCustomDestination, setShowCustomDestination] = useState(
    !!customDestination
  );
  const requiredWallets = getRequiredWallets(bestRoute);
  const customDestinationEnabled =
    typeof config?.customDestination === 'undefined'
      ? true
      : config.customDestination;

  const lastStepToBlockchain = blockchains.find(
    (blockchain) =>
      blockchain.name ===
      bestRoute?.result?.swaps[bestRoute?.result?.swaps.length - 1].to
        .blockchain
  );
  const isWalletRequiredFor = (blockchain: string) =>
    !!bestRoute?.result?.swaps.find(
      (swap) => swap.from.blockchain === blockchain
    );

  const [selectableWallets, setSelectableWallets] = useState<ConnectedWallet[]>(
    connectedWallets.filter((connectedWallet) => {
      return (
        connectedWallet.selected &&
        requiredWallets.includes(connectedWallet.chain)
      );
    })
  );
  const lastStepToBlockchainMeta = blockchains.find(
    (chain) => chain.name === lastStepToBlockchain?.name
  );

  const isSelected = (walletType: string, chain: string) =>
    !!selectableWallets.find(
      (selectableWallet) =>
        selectableWallet.walletType === walletType &&
        selectableWallet.chain === chain &&
        selectableWallet.selected &&
        (isWalletRequiredFor(chain) ||
          (!isWalletRequiredFor(chain) && !destination))
    );

  const isAddressMatched =
    !!destination &&
    showCustomDestination &&
    lastStepToBlockchainMeta &&
    !isValidAddress(lastStepToBlockchainMeta, destination);

  const resetCustomDestination = () => {
    setShowCustomDestination(false);
    setDestination('');
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
      setDestination('');
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
    selectRouteWallets(lastSelectedWallets);
    setCustomDestination(destination);
    setRouteWalletConfirmed(true);
    onClose();
  };

  const onConfirmWallets = async () => {
    setBalanceWarnings([]);
    setError('');
    setRouteWarning(null);
    const selectedWallets = connectedWallets.filter((connectedWallet) =>
      selectableWallets.find(
        (selectableWallet) =>
          selectableWallet.chain === connectedWallet.chain &&
          selectableWallet.walletType === connectedWallet.walletType
      )
    );
    const result = await onCheckBalance?.({
      selectedWallets,
      customDestination: destination,
    });

    const warnings = result.warnings;
    if (warnings?.balance?.messages) {
      setBalanceWarnings(warnings.balance.messages);
    }
    if (warnings?.route) {
      setRouteWarning(warnings.route);
    }
    if (result.error) {
      setError(getConfirmSwapErrorMessage(result.error));
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

  const modalContainer = document.querySelector('#swap-box') as HTMLDivElement;

  return (
    <Modal
      open={open}
      onClose={onClose}
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
                destination,
                bestRoute,
                selectableWallets,
                lastStepToBlockchain
              )}
              onClick={onConfirmWallets}
              variant="contained"
              type="primary"
              fullWidth
              size="large">
              Confirm
            </Button>
          </ConfirmButton>
        ),
      })}
      {...(showMoreWalletFor && {
        containerStyle: { padding: '$0' },
        header: (
          <ShowMoreHeader>
            <NavigateBack
              variant="ghost"
              onClick={setShowMoreWalletFor.bind(null, '')}>
              <ChevronLeftIcon size={16} />
            </NavigateBack>
            <Typography
              variant="headline"
              size="small">{`Your ${showMoreWalletFor} wallets`}</Typography>
          </ShowMoreHeader>
        ),
      })}
      anchor="center">
      <Modal
        open={balanceWarnings.length > 0}
        onClose={setBalanceWarnings.bind(null, [])}
        container={modalContainer}>
        <MessageBox
          title="Insufficient account balance"
          type="error"
          description={<BalanceErrors messages={balanceWarnings ?? []} />}>
          <Button
            variant="outlined"
            size="large"
            type="primary"
            fullWidth
            onClick={onConfirmBalance}>
            Proceed anyway
          </Button>
        </MessageBox>
      </Modal>
      {showMoreWalletFor && (
        <WalletsContainer>
          <div className="wallets-list">
            <WalletList
              chain={showMoreWalletFor}
              isSelected={isSelected}
              selectWallet={onChange}
              multiWallets={config?.multiWallets ?? true}
              supportedWallets={config?.wallets ?? []}
              config={config}
              onShowMore={setShowMoreWalletFor.bind(null, showMoreWalletFor)}
            />
          </div>
        </WalletsContainer>
      )}
      {!showMoreWalletFor && (
        <>
          {error && (
            <>
              <Alert variant="alarm" type="error" title={error} />
              <Divider size={12} />
            </>
          )}
          {routeWarning && (
            <>
              <Alert
                variant="alarm"
                type="warning"
                title={getRouteWarningMessage(routeWarning)}
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
              const isLastWallet = index !== requiredWallets.length - 1;

              return (
                <div key={key}>
                  <Title>
                    <Typography
                      variant="title"
                      size="xmedium">{`Your ${blockchain?.displayName} wallets`}</Typography>
                    <Typography
                      variant="label"
                      color="$neutral900"
                      size="medium">{`You need to connect a ${blockchain?.displayName} wallet.`}</Typography>
                  </Title>
                  <Divider size={24} />
                  <ListContainer>
                    <WalletList
                      chain={requiredWallet}
                      isSelected={isSelected}
                      selectWallet={onChange}
                      multiWallets={config?.multiWallets ?? true}
                      supportedWallets={config?.wallets ?? []}
                      config={config}
                      limit={NUMBER_OF_WALLETS_TO_DISPLAY}
                      onShowMore={() =>
                        setShowMoreWalletFor(blockchain?.name ?? '')
                      }
                    />
                  </ListContainer>
                  {!isLastWallet && <Divider size={32} />}
                  {isLastWallet && customDestinationEnabled && (
                    <CustomDestination>
                      <CollapsibleRoot
                        selected={showCustomDestination}
                        open={showCustomDestination}
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
                        }}>
                        <Trigger
                          onClick={() =>
                            setShowCustomDestination((prevState) => !prevState)
                          }>
                          <CustomDestinationButton
                            fullWidth
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
                                Send to a different address
                              </Typography>
                            </div>
                          </CustomDestinationButton>
                        </Trigger>
                        <CollapsibleContent open={showCustomDestination}>
                          <>
                            <Divider size={4} />
                            <StyledTextField
                              autoFocus
                              placeholder="Your destination address"
                              value={destination}
                              onChange={(e) => {
                                setDestination(e.target.value);
                              }}
                            />
                          </>
                        </CollapsibleContent>
                      </CollapsibleRoot>
                      {isAddressMatched && (
                        <div className="alarms">
                          <Alert
                            variant="alarm"
                            type="error"
                            title={`Address '${destination}' doesn't match the blockchain address pattern.`}
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
    </Modal>
  );
}
