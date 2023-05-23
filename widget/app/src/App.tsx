import React, { useRef } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { Widget, WidgetConfig } from '@rango-dev/widget-embedded';

export function App() {
  const [searchParams] = useSearchParams();
  const configRef = useRef<WidgetConfig>();

  const configParam = searchParams.get('config');

  let config: WidgetConfig | undefined = undefined;

  if (!!configParam) {
    try {
      config = JSON.parse(configParam, (_, value) => {
        if (typeof value === 'string' && value[0] === '$') {
          return value.replace('$', '#');
        } else return value;
      });
    } catch (error) {
      console.error('Widget config param is invalid!');
    }
  }

  if (!!config) configRef.current = config;

  return (
    <div style={{ padding: '20px' }}>
      <Routes>
        <Route path="/*" element={<Widget config={configRef.current} />} />
      </Routes>
    </div>
  );
}
