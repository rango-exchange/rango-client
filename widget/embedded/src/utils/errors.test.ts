import { describe, expect, test } from 'vitest';

import {
  isModuleLoadError,
  tryRefineError,
  tryRefineErrorMessage,
} from './errors';

describe('error refinement', () => {
  describe('recognizing a failed dynamic import', () => {
    test('should match a thrown error', () => {
      const error = new TypeError(
        'Failed to fetch dynamically imported module: https://cdn.example/signer.js'
      );

      expect(isModuleLoadError(error)).toBe(true);
    });

    test('should match webpack failures named instead of worded', () => {
      const error = new Error('Loading failed');
      error.name = 'ChunkLoadError';

      expect(isModuleLoadError(error)).toBe(true);
    });

    test('should match a message that was already stringified', () => {
      expect(
        isModuleLoadError('TypeError: importing a module script failed')
      ).toBe(true);
    });

    test('match a failed import carried as the cause of another error', () => {
      const failedImport = new TypeError(
        'Failed to fetch dynamically imported module: https://cdn.example/ledger.js'
      );
      const connectionError = new Error("Couldn't connect to your wallet.", {
        cause: failedImport,
      });

      expect(isModuleLoadError(connectionError)).toBe(true);
    });

    test('match a failed import several causes down', () => {
      const failedImport = new TypeError('loading chunk 42 failed');
      const error = new Error('outer', {
        cause: new Error('middle', { cause: failedImport }),
      });

      expect(isModuleLoadError(error)).toBe(true);
    });

    test('stop following causes that refer to each other', () => {
      const first = new Error('first');
      const second = new Error('second', { cause: first });
      first.cause = second;

      expect(isModuleLoadError(first)).toBe(false);
    });
  });

  describe('leaving unrecognized failures alone', () => {
    test('should not match an unrelated error', () => {
      expect(
        isModuleLoadError(new Error('User rejected the transaction'))
      ).toBe(false);
    });

    test('should not match empty input', () => {
      expect(isModuleLoadError(null)).toBe(false);
      expect(isModuleLoadError(undefined)).toBe(false);
      expect(isModuleLoadError('')).toBe(false);
    });

    test('leave an error whose cause is unrelated alone', () => {
      const error = new Error("Couldn't connect to your wallet.", {
        cause: { code: 4001, message: 'User rejected the request.' },
      });

      expect(isModuleLoadError(error)).toBe(false);
    });
  });

  describe('refining into a user facing error', () => {
    test('should keep the original as the cause', () => {
      const error = new TypeError('failed to load module script');
      const refined = tryRefineError(error);

      expect(refined).toBeInstanceOf(Error);
      expect(refined?.cause).toBe(error);
      expect(refined?.message).not.toBe(error.message);
    });

    test('refine a connection failure that carries a failed import as its cause', () => {
      const failedImport = new TypeError('failed to load module script');
      const connectionError = new Error("Couldn't connect to your wallet.", {
        cause: failedImport,
      });
      const refined = tryRefineError(connectionError);

      expect(refined?.cause).toBe(connectionError);
      expect(refined?.message).not.toBe(connectionError.message);
    });

    test('should return null for an unrecognized failure', () => {
      expect(tryRefineError(new Error('boom'))).toBeNull();
    });

    test('should fall back to the given message', () => {
      const fallback = 'An unknown error happened during connecting wallet.';

      expect(tryRefineErrorMessage(new Error('boom'), fallback)).toBe(fallback);
    });

    test('should refine instead of falling back when recognized', () => {
      const fallback = 'An unknown error happened during connecting wallet.';

      expect(
        tryRefineErrorMessage(
          new TypeError('loading chunk 42 failed'),
          fallback
        )
      ).not.toBe(fallback);
    });
  });
});
