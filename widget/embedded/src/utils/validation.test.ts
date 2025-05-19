import { faker } from '@faker-js/faker';
import { describe, expect, test } from 'vitest';

import {
  isColorKeyOverridden,
  isNumeric,
  isValidCurrencyFormat,
  isZeroValue,
} from './validation';

const FAKER_SEED = 14;
const THREE_MAX_DECIMAL = 3;
const FOUR_MAX_DECIMAL = 4;
const SMALL_INT = { min: 1, max: 9 };
const FLOAT_OPTS = { min: 0, max: 100, precision: 0.01 };
faker.seed(FAKER_SEED);

describe('check validation behaviors', () => {
  describe('check zero-value detection', () => {
    test('should detect strings of zeros', () => {
      expect(isZeroValue('0')).toBe(true);
      expect(isZeroValue('000')).toBe(true);
      expect(isZeroValue('000.00')).toBe(true);
    });
    test('should reject non-zero or fractional values', () => {
      expect(isZeroValue('0.0001')).toBe(false);
      expect(isZeroValue('000.0001')).toBe(false);
      expect(isZeroValue(faker.number.int(SMALL_INT).toString())).toBe(false);
    });
    test('should return false for empty or non-numeric', () => {
      expect(isZeroValue('')).toBe(false);
      expect(isZeroValue('abc')).toBe(false);
    });
  });

  describe('check currency format validation', () => {
    // Default behavior (maxDecimals = 2)
    test('should accepts integers and up to 2 decimals', () => {
      expect(isValidCurrencyFormat('0')).toBe(true);
      expect(isValidCurrencyFormat('10.2')).toBe(true);
      expect(isValidCurrencyFormat('10.25')).toBe(true);
    });

    test('should rejects more than 2 decimals', () => {
      expect(isValidCurrencyFormat('1.234')).toBe(false);
      expect(isValidCurrencyFormat('0.001')).toBe(false);
    });

    test('should rejects leading zero on non-zero integer', () => {
      expect(isValidCurrencyFormat('01')).toBe(false);
      expect(isValidCurrencyFormat('00.5')).toBe(false);
    });

    test('should rejects non-numeric and malformed strings', () => {
      expect(isValidCurrencyFormat('')).toBe(false);
      expect(isValidCurrencyFormat('.5')).toBe(false);
      expect(isValidCurrencyFormat('1.2.3')).toBe(false);
      expect(isValidCurrencyFormat('abc')).toBe(false);
      expect(isValidCurrencyFormat('0.1a')).toBe(false);
    });

    test('should allows up to specified decimals', () => {
      expect(isValidCurrencyFormat('1.234', THREE_MAX_DECIMAL)).toBe(true);
      expect(isValidCurrencyFormat('0.1234', FOUR_MAX_DECIMAL)).toBe(true);
    });

    test('should rejects if decimals exceed custom limit', () => {
      expect(isValidCurrencyFormat('2.1234', THREE_MAX_DECIMAL)).toBe(false);
      expect(isValidCurrencyFormat('0.12345', FOUR_MAX_DECIMAL)).toBe(false);
    });

    test('should rejects trailing dot', () => {
      expect(isValidCurrencyFormat('10.')).toBe(false);
    });

    test('should handles zero with custom decimals edge', () => {
      expect(isValidCurrencyFormat('0.0', 1)).toBe(true);
      expect(isValidCurrencyFormat('0.00', 1)).toBe(false);
    });

    test('check large values within limits', () => {
      expect(isValidCurrencyFormat('1234567890.12')).toBe(true);
      expect(isValidCurrencyFormat('1234567890.123')).toBe(false);
    });
  });

  describe('check numeric string validation', () => {
    test('should accept integers and decimals', () => {
      expect(isNumeric('0')).toBe(true);
      expect(isNumeric('00.1')).toBe(true);
      expect(isNumeric('123.456')).toBe(true);
      expect(isNumeric(faker.number.float(FLOAT_OPTS).toString())).toBe(true);
    });
    test('should reject leading dot or letters', () => {
      expect(isNumeric('.5')).toBe(false);
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('1.2.3')).toBe(false);
    });
    test('should reject empty string', () => {
      expect(isNumeric('')).toBe(false);
    });
  });

  describe('check color key override detection', () => {
    test('should detect numeric suffix keys', () => {
      expect(isColorKeyOverridden('primary550')).toBe(true);
      expect(isColorKeyOverridden('secondary100')).toBe(true);
      expect(
        isColorKeyOverridden(
          faker.word.sample() +
            faker.number.int({ min: 1, max: 999 }).toString()
        )
      ).toBe(true);
    });
    test('should reject keys without digits', () => {
      expect(isColorKeyOverridden('primary')).toBe(false);
      expect(isColorKeyOverridden('colorKey')).toBe(false);
      expect(isColorKeyOverridden('')).toBe(false);
    });
  });
});
