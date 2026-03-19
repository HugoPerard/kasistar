import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { getCalendarDateInParis } from '#/lib/puzzle-constants'

export function puzzlesDir(): string {
  return join(process.cwd(), 'content/puzzles')
}

function isIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s)
}

export async function listPuzzleDates(): Promise<string[]> {
  let files: string[] = []
  try {
    files = await readdir(puzzlesDir())
  } catch {
    return []
  }
  return files
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.slice(0, -5))
    .filter(isIsoDate)
    .sort()
}

/**
 * Date of the puzzle to show on the home page:
 * today’s file if present, else latest on/before today, else latest in repo (dev fallback).
 */
export async function resolvePuzzleDateForPlay(): Promise<string | null> {
  const today = getCalendarDateInParis()
  const dates = await listPuzzleDates()
  if (dates.length === 0) return null
  if (dates.includes(today)) return today
  const onOrBefore = dates.filter((d) => d <= today)
  if (onOrBefore.length > 0) return onOrBefore[onOrBefore.length - 1]
  return dates[dates.length - 1]
}
