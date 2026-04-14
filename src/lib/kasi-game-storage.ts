import { type GameId } from './game-config'

const PRIMARY_STORAGE_PREFIX = 'kasi-game'

const legacyStorageKeysByGame: Partial<Record<GameId, string[]>> = {
  star: ['kasi-star:puzzle-solved', 'puzzle-solved'],
}

function storageKey(gameId: GameId): string {
  return `${PRIMARY_STORAGE_PREFIX}:${gameId}:solved`
}

function readStoredMap(raw: string | null): Record<string, boolean> | null {
  if (!raw) return null

  try {
    return JSON.parse(raw) as Record<string, boolean>
  } catch {
    return null
  }
}

function readMap(gameId: GameId): Record<string, boolean> {
  if (typeof window === 'undefined') return {}

  const primaryKey = storageKey(gameId)
  const primaryValue = readStoredMap(window.localStorage.getItem(primaryKey))
  const primaryEntries = primaryValue ? Object.keys(primaryValue) : []
  let mergedLegacyValue: Record<string, boolean> | null = null
  const legacyKeys = legacyStorageKeysByGame[gameId] ?? []

  for (const legacyKey of legacyKeys) {
    const legacyValue = readStoredMap(window.localStorage.getItem(legacyKey))
    if (!legacyValue) continue
    mergedLegacyValue = {
      ...(mergedLegacyValue ?? primaryValue ?? {}),
      ...legacyValue,
    }
  }

  if (mergedLegacyValue) {
    try {
      window.localStorage.setItem(primaryKey, JSON.stringify(mergedLegacyValue))
    } catch {
      // ignore storage errors
    }

    return mergedLegacyValue
  }

  return primaryEntries.length > 0 ? primaryValue ?? {} : {}
}

export function isGameDateSolved(gameId: GameId, date: string): boolean {
  return readMap(gameId)[date] === true
}

export function markGameDateSolved(gameId: GameId, date: string): void {
  if (typeof window === 'undefined') return

  try {
    const solved = readMap(gameId)
    solved[date] = true
    window.localStorage.setItem(storageKey(gameId), JSON.stringify(solved))
  } catch {
    // ignore storage errors
  }
}
