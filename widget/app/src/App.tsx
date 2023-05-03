import { Widget, WidgetConfig } from '@rango-dev/widget-embedded';
import React, { useRef } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';

export function App() {
  const [searchParams] = useSearchParams();
  const configRef = useRef<WidgetConfig>();

  const configParam = searchParams.get('config');

  let config: WidgetConfig | undefined = undefined;

  if (!!configParam) {
    try {
      config = JSON.parse(configParam);
    } catch (error) {
      console.error('Widget config param is invalid!');
    }
  }

  if (!!config) configRef.current = config;

  return (
    <Routes>
      <Route path="/*" element={<Widget config={configRef.current} />} />
    </Routes>
  );
}
