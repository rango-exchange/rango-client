import { describe, expect, test } from 'vitest';

import { defineVersions, pickVersion } from './versions.js';

describe('Picking versions should work correctly', () => {
  test("Error on picking a version doesn't exist", () => {
    const versions = defineVersions().build();
    // const versions: Versions = [['1.0.0', {}]];
    expect(() => pickVersion(versions, '1.0.0')).toThrowError();
  });

  test('Pick the correct version if it exist', () => {
    const versions = defineVersions()
      .version('0.0.0', {} as any)
      .version('1.0.0', {} as any)
      .build();

    const target = pickVersion(versions, '1.0.0');
    expect(target).toBeDefined();
    expect(target[0]).toBe('1.0.0');
  });
});
