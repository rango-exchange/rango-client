import { SwapHistory } from '@rangodev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { pendingSwap } from '../mockData/pendingSwap';

export function SwapDetailsPage() {
  const navigate = useNavigate();
  return <SwapHistory onBack={navigate.bind(null, -1)} pendingSwap={pendingSwap} />;
}
