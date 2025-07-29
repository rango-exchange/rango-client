'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Widget = dynamic(
  async () =>
    import('@rango-dev/widget-embedded').then((module) => module.Widget),
  {
    ssr: false,
  }
);

function RangoWidget() {
  return (
    <Widget
      config={{
        apiKey: 'c6381a79-2817-4602-83bf-6a641a409e32',
        walletConnectProjectId: 'e24844c5deb5193c1c14840a7af6a40b',
      }}
    />
  );
}

export default RangoWidget;
