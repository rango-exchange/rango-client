import type { DirectConnectionUi } from '@rango-dev/provider-walletconnect-2';

import { i18n } from '@lingui/core';
import {
  OATH_APP_STORE,
  oathConnectionLink,
} from '@rango-dev/provider-walletconnect-2';
import { Button, Divider, Typography } from '@rango-dev/ui';
import QRCode from 'qrcode';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { WatermarkedModal } from '../../components/common/WatermarkedModal';
import { getContainer } from '../../utils/common';

export function useOathConnection() {
  const [uri, setUri] = useState<string>();
  const [qr, setQr] = useState<string>();
  const [failed, setFailed] = useState(false);
  const closeRef = useRef<() => void>(() => undefined);
  const cancel = useCallback(() => closeRef.current(), []);
  const display: DirectConnectionUi = useCallback((nextUri: string) => {
    closeRef.current();
    let resolveClosed: () => void = () => undefined;
    const closed = new Promise<void>((resolve) => {
      resolveClosed = resolve;
    });
    const close = () => {
      resolveClosed();
      if (closeRef.current === close) {
        closeRef.current = () => undefined;
        setUri(undefined);
        setQr(undefined);
      }
    };
    closeRef.current = close;
    setFailed(false);
    setUri(nextUri);
    return { closed, close };
  }, []);

  useEffect(() => cancel, [cancel]);
  useEffect(() => {
    let active = true;
    setQr(undefined);
    if (uri) {
      void QRCode.toDataURL(uri, {
        width: 240,
        margin: 4,
        errorCorrectionLevel: 'M',
      })
        .then((image) => {
          if (active) {
            setQr(image);
          }
        })
        .catch(() => {
          if (active) {
            setFailed(true);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [uri]);

  const view = (
    <WatermarkedModal
      id="widget-oath-connection-modal"
      open={!!uri}
      dismissible
      title="Oath Wallet"
      onClose={cancel}
      container={getContainer()}
      styles={{
        root: { zIndex: 999999999 },
        content: { textAlign: 'center' },
      }}>
      <Typography variant="body" size="medium">
        {i18n.t(
          'Scan this QR code with Oath on your iPhone, then review the connection in the app.'
        )}
      </Typography>
      <Divider size={16} />
      {qr && (
        <img
          id="widget-oath-qr-code"
          src={qr}
          style={{ maxWidth: '100%', height: 'auto' }}
          alt={i18n.t('Oath Wallet connection QR code')}
          width={240}
          height={240}
        />
      )}
      {failed && (
        <Typography variant="body" size="medium">
          {i18n.t(
            'Unable to display the QR code. Close this window and try again.'
          )}
        </Typography>
      )}
      <Divider size={16} />
      {uri && (
        <Button
          id="widget-oath-open-app-link"
          variant="contained"
          type="primary"
          size="large"
          fullWidth
          onClick={() => {
            window.location.href = oathConnectionLink(uri);
          }}>
          {i18n.t('Open Oath on this iPhone')}
        </Button>
      )}
      <Divider size={16} />
      <Button
        id="widget-oath-download-link"
        variant="outlined"
        type="primary"
        size="large"
        fullWidth
        onClick={() =>
          window.open(OATH_APP_STORE, '_blank', 'noopener,noreferrer')
        }>
        {i18n.t('Get Oath for iOS')}
      </Button>
    </WatermarkedModal>
  );
  return { display, view };
}
