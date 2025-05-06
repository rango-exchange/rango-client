import { faker } from '@faker-js/faker';
import { describe, expect, test } from 'vitest';

import {
  ensureLeadingZeroForDecimal,
  formatThousandsWithCommas,
  removeLeadingZeros,
  replaceSpacesWithDash,
} from './sanitizers';

const WORD_COUNT = 5;
const FAKER_SEED = 12;
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
      console.log(replaceSpacesWithDash(words.join('\t')));
      expect(replaceSpacesWithDash(words.join('\t'))).toBe(words.join('-'));
      expect(replaceSpacesWithDash(words.join('\n'))).toBe(words.join('-'));
    });

    test('should handle empty or single-word strings', () => {
      expect(replaceSpacesWithDash('')).toBe('');
      expect(replaceSpacesWithDash('nospace')).toBe('nospace');
    });
  });
});
