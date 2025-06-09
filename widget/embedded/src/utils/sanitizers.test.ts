import { faker } from '@faker-js/faker';
import { describe, expect, test } from 'vitest';

import {
  ensureLeadingZeroForDecimal,
  formatThousandsWithCommas,
  removeLeadingZeros,
  replaceSpacesWithDash,
  stripTrailingZeros,
} from './sanitizers';

const WORD_COUNT = 5;
const FAKER_SEED = 12;
const LONG_NUMBER_LENGTH = 50;
faker.seed(FAKER_SEED);

describe('check sanitization behaviors', () => {
  describe('check leading zero removal', () => {
    test('should remove zeros at start before digits', () => {
      expect(removeLeadingZeros('000123')).toBe('123');
      expect(removeLeadingZeros('00123')).toBe('123');
    });

    test('should preserve lone zero or non-digit prefixes', () => {
      expect(removeLeadingZeros('0')).toBe('0');
      expect(removeLeadingZeros('0000')).toBe('0');
      expect(removeLeadingZeros('00.1')).toBe('0.1');
      expect(removeLeadingZeros('00a')).toBe('0a');
    });

    test('should leave strings with no leading zeros unchanged', () => {
      const val = faker.number.int({ min: 1, max: 999 }).toString();
      expect(removeLeadingZeros(val)).toBe(val);
    });
  });

  describe('check decimal leading zero insertion', () => {
    test('should add a zero before lone decimal points', () => {
      expect(ensureLeadingZeroForDecimal('.5')).toBe('0.5');
      expect(ensureLeadingZeroForDecimal('.000')).toBe('0.000');
      expect(ensureLeadingZeroForDecimal('0.001')).toBe('0.001');
      expect(ensureLeadingZeroForDecimal('000.000')).toBe('000.000');
    });

    test('should not alter other inputs', () => {
      expect(ensureLeadingZeroForDecimal('0.5')).toBe('0.5');
      expect(ensureLeadingZeroForDecimal('2.')).toBe('2.');
      expect(ensureLeadingZeroForDecimal('')).toBe('');
    });
  });

  describe('check thousand separator formatting', () => {
    test('should insert commas every three digits for 4–6 digit numbers', () => {
      expect(formatThousandsWithCommas('1000')).toBe('1,000');
      expect(formatThousandsWithCommas('12345')).toBe('12,345');
      expect(formatThousandsWithCommas('123456')).toBe('123,456');
    });

    test('should handle large numbers correctly', () => {
      expect(formatThousandsWithCommas('1234567')).toBe('1,234,567');
      expect(formatThousandsWithCommas('1234567890')).toBe('1,234,567,890');
    });

    test('should not add commas for numbers below 1000', () => {
      expect(formatThousandsWithCommas('0')).toBe('0');
      expect(formatThousandsWithCommas('999')).toBe('999');
    });
  });

  describe('check space-to-dash replacement', () => {
    test('should convert any spaces to a single dash', () => {
      const words = faker.lorem.words(WORD_COUNT).split(' ');
      const spaced = words.join('   ');
      expect(replaceSpacesWithDash(spaced)).toBe(words.join('-'));
    });

    test('should convert tabs and newlines into dashes', () => {
      const words = faker.lorem.words(WORD_COUNT).split(' ');
      expect(replaceSpacesWithDash(words.join('\t'))).toBe(words.join('-'));
      expect(replaceSpacesWithDash(words.join('\n'))).toBe(words.join('-'));
    });

    test('should handle empty or single-word strings', () => {
      expect(replaceSpacesWithDash('')).toBe('');
      expect(replaceSpacesWithDash('nospace')).toBe('nospace');
    });
  });

  describe('check trailing zero stripping', () => {
    test('should trim only zeros after last non-zero digit', () => {
      expect(stripTrailingZeros('0.0010000')).toBe('0.001');
      expect(stripTrailingZeros('123.45000')).toBe('123.45');
      expect(stripTrailingZeros('5.1000')).toBe('5.1');
    });

    test('should remove entire fractional part if all zeros', () => {
      expect(stripTrailingZeros('10.000')).toBe('10');
      expect(stripTrailingZeros('0.000')).toBe('0');
    });

    test('should leave inputs without trailing zeros untouched', () => {
      expect(stripTrailingZeros('42')).toBe('42');
      expect(stripTrailingZeros('7.89')).toBe('7.89');
      expect(stripTrailingZeros('0.123')).toBe('0.123');
    });

    test('edge: very long fractional zeros', () => {
      const long =
        '0.' +
        '0'.repeat(LONG_NUMBER_LENGTH) +
        '1' +
        '0'.repeat(LONG_NUMBER_LENGTH);
      expect(stripTrailingZeros(long)).toBe(
        '0.' + '0'.repeat(LONG_NUMBER_LENGTH) + '1'
      );
    });

    test('edge: no decimal point', () => {
      expect(stripTrailingZeros('1000')).toBe('1000');
    });
  });
});
