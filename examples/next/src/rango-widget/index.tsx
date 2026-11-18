'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Loaded on the client only, along with the wallet providers it creates.
const Widget = dynamic(() => import('./Widget'), {
  ssr: false,
});

function RangoWidget() {
  return <Widget />;
}

export default RangoWidget;
