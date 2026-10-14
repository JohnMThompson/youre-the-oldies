import { describe, expect, it } from 'vitest';
import { createComparison, equivalentYear, findOldiesSong, songs } from './comparison';

describe('comparison calculations', () => {
  it('uses the current year in the equivalent year calculation', () => {
    expect(equivalentYear(2003, 2003, 2026)).toBe(1980);
    expect(equivalentYear(2003, 2003, 2027)).toBe(1979);
  });

  it('prefers exact matches before higher scored nearby matches', () => {
    const exact = { id: 'exact', title: 'Exact', artist: 'A', year: 1980, genre: 'Pop', recognition: 1 };
    const near = { id: 'near', title: 'Near', artist: 'B', year: 1981, genre: 'Pop', recognition: 5 };
    expect(findOldiesSong(1980, [near, exact])?.id).toBe('exact');
  });

  it('falls back by one year and excludes the previous result', () => {
    const a = { id: 'a', title: 'A', artist: 'A', year: 1979, genre: 'Pop', recognition: 5 };
    const b = { id: 'b', title: 'B', artist: 'B', year: 1981, genre: 'Pop', recognition: 4 };
    expect(findOldiesSong(1980, [a, b])?.id).toBe('a');
    expect(findOldiesSong(1980, [a, b], ['a'])?.id).toBe('b');
    expect(findOldiesSong(1980, [a], ['a'])).toBeUndefined();
  });

  it('handles empty years and invalid graduation years gracefully', () => {
    expect(createComparison(2003, 2026, 'missing', [], [])).toBeUndefined();
    expect(createComparison(2030, 2026)).toBeUndefined();
    expect(createComparison(2003, 2026, 'in-da-club')?.oldiesSong.id).toBe('another-one-bites-the-dust');
    expect(songs.length).toBeGreaterThan(30);
  });
});
