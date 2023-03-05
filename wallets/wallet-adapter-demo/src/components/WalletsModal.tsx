import { useAdapter } from '@rango-dev/wallets-adapter';
import React from 'react';

function WalletsModal() {
  const { onOpenModal } = useAdapter();
  return <button onClick={onOpenModal}> open modal</button>;
}

export default WalletsModal;
