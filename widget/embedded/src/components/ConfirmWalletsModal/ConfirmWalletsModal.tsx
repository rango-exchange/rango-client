import type { PropTypes } from './ConfirmWalletsModal.types';
import type { Wallet } from '../../types';

import {
  Alert,
  BalanceErrors,
  BottomLogo,
  Button,
  ChevronDownIcon,
  ChevronLeftIcon,
  Divider,
  MessageBox,
  Modal,
  Typography,
  WalletIcon,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { useBestRouteStore } from '../../store/bestRoute';
import { useMetaStore } from '../../store/meta';
import { useWalletsStore } from '../../store/wallets';
import { confirmSwapDisabled } from '../../utils/swap';
import { getRequiredChains } from '../../utils/wallets';

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
  WalletsContainer,
} from './ConfirmWallets.styles';
import { WalletList } from './WalletList';

const NUMBER_OF_WALLETS_TO_DISPLAY = 2;

export function ConfirmWalletsModal(props: PropTypes) {
  const { open, onClose, onCancel, onCheckBalance, config, loading } = props;
  const { blockchains } = useMetaStore.use.meta();
  const {
    bestRoute,
    setSelectedWallets: selectRouteWallets,
    setRouteWalletConfirmed,
  } = useBestRouteStore();
  const {
    connectedWallets,
    customDestination,
    setCustomDestination,
    selectWallets,
  } = useWalletsStore();

  const [showMoreWalletFor, setShowMoreWalletFor] = useState('');
  const [balanceWarnings, setBalanceWarnings] = useState<string[]>([]);
  const [destination, setDestination] = useState(customDestination);
  const [showCustomDestination, setShowCustomDestination] = useState(false);
  const requiredWallets = getRequiredWallets(bestRoute);

  const initSelectedWallets = () => {
    const requiredChains = getRequiredChains(bestRoute);
    const selectedWallets: Wallet[] = [];
    requiredChains.forEach((chain) => {
      const firstSelectedWalletWithMatchedChain = connectedWallets.find(
        (wallet) => wallet.chain === chain && wallet.selected
      );

      if (firstSelectedWalletWithMatchedChain) {
        selectedWallets.push({
          walletType: firstSelectedWalletWithMatchedChain.walletType,
          address: firstSelectedWalletWithMatchedChain.address,
          chain: firstSelectedWalletWithMatchedChain.chain,
        });
      } else {
        const firstWalletWithMatchedChain = connectedWallets.find(
          (wallet) => wallet.chain === chain
        );
        if (firstWalletWithMatchedChain) {
          selectedWallets.push({
            walletType: firstWalletWithMatchedChain.walletType,
            address: firstWalletWithMatchedChain.address,
            chain: firstWalletWithMatchedChain.chain,
          });
        }
      }
    });

    return selectedWallets;
  };

  const [selectableWallets, setSelectableWallets] = useState<Wallet[]>(
    initSelectedWallets().map((item) => ({
      walletType: item.walletType,
      chain: item.chain,
      address: item.address,
    }))
  );

  const lastStepToBlockchain = blockchains.find(
    (blockchain) =>
      blockchain.name ===
      bestRoute?.result?.swaps[bestRoute?.result?.swaps.length - 1].to
        .blockchain
  );
  const isWalletRequired = !!bestRoute?.result?.swaps.find(
    (swap) => swap.from.blockchain === lastStepToBlockchain?.name
  );

  const lastStepToBlockchainMeta = blockchains.find(
    (chain) => chain.name === lastStepToBlockchain?.name
  );

  const isSelected = (walletType: string, chain: string) =>
    !!selectableWallets.find(
      (selectableWallet) =>
        selectableWallet.walletType === walletType &&
        selectableWallet.chain === chain
    );
  const onChange = (wallet: Wallet) => {
    const selected = selectableWallets.find(
      (selectableWallet) =>
        selectableWallet.address === wallet.address &&
        selectableWallet.chain === wallet.chain &&
        selectableWallet.walletType === wallet.walletType
    );
    if (!selected) {
      onCancel();
    }

    if (wallet.address) {
      setSelectableWallets((wallets) =>
        wallets
          .filter((selectableWallet) => selectableWallet.chain !== wallet.chain)
          .concat({
            walletType: wallet.walletType,
            chain: wallet.chain,
            address: wallet.address,
          })
      );
    }
  };

  const onConfirmBalance = () => {
    selectWallets(selectableWallets);
    selectRouteWallets(selectableWallets);
    setCustomDestination(destination);
    setRouteWalletConfirmed(true);
    onClose();
  };

  const onConfirmWallets = async () => {
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

    const warnings = result.warnings?.balance?.messages;
    setBalanceWarnings(warnings ?? []);

    if (!warnings?.length || 0 > 0) {
      onConfirmBalance();
    } else {
      setBalanceWarnings(warnings ?? []);
    }
  };

  const modalContainer = document.querySelector('#swap-box') as HTMLDivElement;
  return (
    <Modal
      open={open}
      onClose={onClose}
      dismissible={!showMoreWalletFor}
      container={modalContainer}
      {...(showMoreWalletFor && {
        containerStyle: { padding: '$0' },
        prefix: (
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
            style={{ marginBlock: '10px', marginTop: '20px' }}
            variant="outlined"
            size="large"
            type="primary"
            fullWidth
            onClick={onConfirmBalance}>
            Proceed anyway
          </Button>
        </MessageBox>
        <BottomLogo />
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
          {requiredWallets.map((requiredWallet, index) => {
            const blockchain = blockchains.find(
              (blockchain) => blockchain.name === requiredWallet
            );

            const key = `wallet-${index}`;
            return (
              <div key={key}>
                <Title>
                  <Typography
                    variant="title"
                    size="xmedium">{`Your ${blockchain?.displayName} wallets`}</Typography>
                  <Typography
                    variant="label"
                    color="$neutral500"
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
                    onShowMore={setShowMoreWalletFor.bind(
                      null,
                      blockchain?.name ?? ''
                    )}
                  />
                </ListContainer>
                {index !== requiredWallets.length - 1 && <Divider size={32} />}
                {index === requiredWallets.length - 1 &&
                  config?.customDestination && (
                    <>
                      <CustomDestination>
                        <CollapsibleRoot
                          selected={showCustomDestination}
                          open={showCustomDestination}
                          onOpenChange={(checked) => {
                            if (!checked) {
                              setDestination('');
                              setSelectableWallets((selectableWallets) => {
                                let found = false;
                                return selectableWallets.map(
                                  (selectableWallet) => {
                                    if (
                                      !found &&
                                      selectableWallet.chain ===
                                        lastStepToBlockchain?.name
                                    ) {
                                      found = true;
                                      return {
                                        ...selectableWallet,
                                        selected: true,
                                      };
                                    }
                                    return selectableWallet;
                                  }
                                );
                              });
                            } else {
                              if (!isWalletRequired) {
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
                            onClick={setShowCustomDestination.bind(
                              null,
                              (prevState) => !prevState
                            )}>
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
                                placeholder="Your destination address"
                                value={destination}
                                onChange={(e) => {
                                  setDestination(e.target.value);
                                }}
                              />
                            </>
                          </CollapsibleContent>
                        </CollapsibleRoot>
                        {!!destination &&
                          showCustomDestination &&
                          lastStepToBlockchainMeta &&
                          !isValidAddress(
                            lastStepToBlockchainMeta,
                            destination
                          ) && (
                            <div className="alarms">
                              <Alert
                                variant="alarm"
                                type="error"
                                title={`Address ${destination} doesn't match the blockchain address`}
                              />
                            </div>
                          )}
                      </CustomDestination>
                    </>
                  )}
              </div>
            );
          })}
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
        </>
      )}
    </Modal>
  );
}
