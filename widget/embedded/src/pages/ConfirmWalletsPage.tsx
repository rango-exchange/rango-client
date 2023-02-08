import React from 'react';
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
import { SwapSavedSettings, WalletTypeAndAddress } from '@rangodev/ui/dist/types/swaps';

export interface SelectableWallet {
  blockchain: string;
  walletType: WalletType;
  address: string;
  image: string;
}

export function calculatePendingSwap(
  inputAmount: string,
  bestRoute: BestRouteResponse,
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
  const { accounts } = useWalletsStore();
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

  const connectedWallets: SelectableWallet[] = [];
  accounts.forEach((account) => {
    account.accounts.forEach((acc) => {
      connectedWallets.push({
        address: acc.address,
        walletType: acc.walletType as WalletType,
        blockchain: account.blockchain,
        image: getWalletInfo(acc.walletType as WalletType).img,
      });
    });
  });
  console.log(connectedWallets);

  console.log(
    connectedWallets.filter((wallet) => requiredWallets(bestRoute).includes(wallet.blockchain)),
  );

  const walletsForCalculatePendingSwap: { [p: string]: WalletTypeAndAddress } = {};

  requiredWallets(bestRoute).forEach(
    (blockchain) =>
      (walletsForCalculatePendingSwap[blockchain] = {
        walletType: connectedWallets.filter((w) => w.blockchain === blockchain)[0].walletType,
        address: connectedWallets.filter((w) => w.blockchain === blockchain)[0].address,
      }),
  );

  return (
    <ConfirmWallets
      requiredWallets={requiredWallets(bestRoute)}
      selectableWallets={connectedWallets.filter((wallet) =>
        requiredWallets(bestRoute).includes(wallet.blockchain),
      )}
      onBack={() => navigate(-1)}
      swap={bestRoute as any}
      onConfirm={() => {
        const selectedWalletsMap: { [p: string]: string } = {};
        accounts.forEach((acc) => (selectedWalletsMap[acc.blockchain] = acc.accounts[0].address));
        const body: BestRouteRequest = {
          amount: inputAmount!.toString(),
          checkPrerequisites: true,
          from: {
            address: fromToken!.address,
            blockchain: fromToken!.blockchain,
            symbol: fromToken!.symbol,
          },
          to: {
            address: toToken!.address,
            blockchain: toToken!.blockchain,
            symbol: toToken!.symbol,
          },
          connectedWallets: accounts.map((acc) => ({
            addresses: acc.accounts.map((a) => a.address),
            blockchain: acc.blockchain,
          })),
          selectedWallets: selectedWalletsMap,
        };
        httpService
          .getBestRoute(body)
          .then((res) => {
            console.log('second best route: ', res);
            const pendingSwap = calculatePendingSwap(
              inputAmount!.toString(),
              bestRoute!,
              walletsForCalculatePendingSwap,
              { disabledSwappersGroups: [], disabledSwappersIds: [], slippage: '1.0' },
              false,
            );
            console.log('pending swap: ', pendingSwap);
          })
          .catch(() => alert('error in calculating pending swap'));
      }}
    />
  );
  return <div>hi</div>;
}
