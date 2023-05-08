import { Widget, WidgetConfig } from '@rango-dev/widget-embedded';
import React, { useRef } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';

export function App() {
  const [searchParams] = useSearchParams();
  const configRef = useRef<WidgetConfig>();

  const configParam = searchParams.get('config');

  const config: WidgetConfig | undefined = configParam
    ? JSON.parse(configParam)
    : undefined;

  if (!!config) configRef.current = config;

  return (
    <Routes>
      <Route path="/*" element={<Widget config={configRef.current} />} />
    </Routes>
  );
}
