import catalog from '../data/songs.json';

export interface Song {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  recognition: number;
  peakYear?: number;
  url?: string;
}

export const songs = catalog as Song[];

export interface Comparison {
  graduationYear: number;
  currentYear: number;
  schoolSong: Song;
  oldiesSong: Song;
  targetYear: number;
  matchedYear: number;
  approximate: boolean;
}

export function getCurrentYear(date = new Date()): number {
  return date.getFullYear();
}

export function equivalentYear(graduationYear: number, songYear: number, currentYear = getCurrentYear()): number {
  return graduationYear - (currentYear - songYear);
}

function candidatesFor(year: number, available: Song[], tolerance: number): Song[] {
  return available.filter((song) => Math.abs(song.year - year) <= tolerance);
}

export function findOldiesSong(targetYear: number, available: Song[] = songs, excludedIds: string[] = []): Song | undefined {
  const pool = available.filter((song) => !excludedIds.includes(song.id));
  for (const tolerance of [0, 1]) {
    const candidates = candidatesFor(targetYear, pool, tolerance);
    if (candidates.length) {
      return candidates.sort((a, b) => b.recognition - a.recognition || Math.abs(a.year - targetYear) - Math.abs(b.year - targetYear) || a.id.localeCompare(b.id))[0];
    }
  }
  return undefined;
}

export function createComparison(
  graduationYear: number,
  currentYear = getCurrentYear(),
  selectedSongId?: string,
  excludedIds: string[] = [],
  available: Song[] = songs,
): Comparison | undefined {
  if (!Number.isInteger(graduationYear) || graduationYear < 1945 || graduationYear > currentYear) return undefined;
  const schoolSongs = available.filter((song) => song.year >= graduationYear - 4 && song.year <= graduationYear);
  const schoolSong = schoolSongs.find((song) => song.id === selectedSongId) ??
    [...schoolSongs].sort((a, b) => b.recognition - a.recognition || b.year - a.year || a.id.localeCompare(b.id))[0];
  if (!schoolSong) return undefined;

  const targetYear = equivalentYear(graduationYear, schoolSong.year, currentYear);
  const oldiesSong = findOldiesSong(targetYear, available, excludedIds);
  if (!oldiesSong) return undefined;
  return {
    graduationYear,
    currentYear,
    schoolSong,
    oldiesSong,
    targetYear,
    matchedYear: oldiesSong.year,
    approximate: oldiesSong.year !== targetYear,
  };
}
