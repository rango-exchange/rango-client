import { useAdapter } from '@rangodev/wallet-adapter';
import React from 'react';

function WalletsModal() {
  const { onOpenModal } = useAdapter();
  return (
    <div>
      <button onClick={onOpenModal}> open modal</button>
    </div>
  );
}

export default WalletsModal;
