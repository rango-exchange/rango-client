import React, { useEffect } from 'react';
import { ConfirmWallets, SecondaryPage } from '@rangodev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRoute } from '../hooks/useBestRoute';
import { useBestRouteStore } from '../store/bestRoute';
import { useWalletsStore } from '../store/wallets';
import { WalletType } from '@rangodev/wallets-shared';
import { useWallets } from '@rangodev/wallets-core';
import { BestRouteRequest, BestRouteResponse } from 'rango-sdk';
import { httpService } from '../services/httpService';
import { PendingSwap, PendingSwapStep } from '@rangodev/ui/dist/containers/History/types';
import {
  BestRouteType,
  SwapSavedSettings,
  WalletTypeAndAddress,
} from '@rangodev/ui/dist/types/swaps';
import { navigationRoutes } from '../constants/navigationRoutes';
import { getRequiredChains, getSelectableWallets, SelectedWallet } from '../utils/wallets';

export interface SelectableWallet extends SelectedWallet {
  image: string;
  selected: boolean;
}

export function calculatePendingSwap(
  inputAmount: string,
  bestRoute: BestRouteType,
  wallets: { [p: string]: WalletTypeAndAddress },
  settings: SwapSavedSettings,
  validateBalanceOrFee: boolean,
): PendingSwap {
  const simulationResult = bestRoute.result as any;
  if (!simulationResult) throw Error('Simulation result should not be null');

  return {
    creationTime: new Date().getTime().toString(),
    finishTime: null,
    requestId: bestRoute.requestId || '',
    inputAmount: inputAmount,
    wallets,
    status: 'running',
    isPaused: false,
    extraMessage: null,
    extraMessageSeverity: null,
    extraMessageDetail: null,
    extraMessageErrorCode: null,
    networkStatusExtraMessage: null,
    networkStatusExtraMessageDetail: null,
    lastNotificationTime: null,
    settings: settings,
    simulationResult: simulationResult,
    validateBalanceOrFee,
    //@ts-ignore
    steps:
      bestRoute.result?.swaps?.map((s, i) => ({
        id: i + 1,
        fromBlockchain: s.from.blockchain,
        fromSymbol: s.from.symbol,
        fromSymbolAddress: s.from.address,
        fromDecimals: s.from.decimals,
        fromAmountPrecision: s.fromAmountPrecision,
        fromAmountMinValue: s.fromAmountMinValue,
        fromAmountMaxValue: s.fromAmountMaxValue,
        toBlockchain: s.to.blockchain,
        fromLogo: s.from.logo,
        toSymbol: s.to.symbol,
        toSymbolAddress: s.to.address,
        toDecimals: s.to.decimals,
        toLogo: s.to.logo,
        startTransactionTime: new Date().getTime(),
        swapperId: s.swapperId,
        expectedOutputAmountHumanReadable: s.toAmount,
        outputAmount: null,
        status: 'created',
        networkStatus: null,
        executedTransactionId: null,
        externalTransactionId: null,
        explorerUrl: null,
        trackingCode: null,
        cosmosTransaction: null,
        solanaTransaction: null,
        starknetTransaction: null,
        starknetApprovalTransaction: null,
        tronTransaction: null,
        tronApprovalTransaction: null,
        evmTransaction: null,
        evmApprovalTransaction: null,
        transferTransaction: null,
        diagnosisUrl: null,
        internalSteps: null,
        fromBlockchainLogo: '',
        toBlockchainLogo: '',
        swapperLogo: '',
      })) || [],
  };
}

export function ConfirmWalletsPage() {
  const navigate = useNavigate();

  const { bestRoute, inputAmount, fromToken, toToken } = useBestRouteStore();
  const { accounts, selectedWallets, initSelectedWallets, setSelectedWallet } = useWalletsStore();
  const { state, getWalletInfo } = useWallets();
  const requiredWallets = (route: BestRouteResponse | null) => {
    const wallets: string[] = [];

    route?.result?.swaps.forEach((swap) => {
      const currentStepFromBlockchain = swap.from.blockchain;
      const currentStepToBlockchain = swap.to.blockchain;
      let lastAddedWallet = wallets[wallets.length - 1];
      if (currentStepFromBlockchain != lastAddedWallet) wallets.push(currentStepFromBlockchain);
      lastAddedWallet = wallets[wallets.length - 1];
      if (currentStepToBlockchain != lastAddedWallet) wallets.push(currentStepToBlockchain);
    });
    return wallets;
  };

  const walletsForCalculatePendingSwap: { [p: string]: WalletTypeAndAddress } = {};

  // requiredWallets(bestRoute).forEach(
  //   (blockchain) =>
  //     (walletsForCalculatePendingSwap[blockchain] = {
  //       walletType: connectedWallets.filter((w) => w.blockchain === blockchain)[0].walletType,
  //       address: connectedWallets.filter((w) => w.blockchain === blockchain)[0].address,
  //     }),
  // );

  return (
    <ConfirmWallets
      requiredWallets={getRequiredChains(bestRoute)}
      selectableWallets={getSelectableWallets(
        accounts,
        getRequiredChains(bestRoute),
        selectedWallets,
        getWalletInfo,
      )}
      onBack={() => navigate(-1)}
      swap={bestRoute as any}
      onConfirm={() => navigate(navigationRoutes.confirmSwap)}
      onChange={(wallet) => setSelectedWallet(wallet)}
    />
  );
}
