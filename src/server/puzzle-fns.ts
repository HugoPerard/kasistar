import { createServerFn } from '@tanstack/react-start'
import { type GameId, isGameId } from '#/lib/game-config'
import { normalizeGuess } from '#/lib/normalize-guess'
import { type PuzzlePublic } from '#/lib/puzzle-schema'
import {
  isPuzzleDateReleased,
  listReleasedPuzzleDates,
  resolvePuzzleDateForPlay,
} from '#/server/puzzle-dates'
import { getPuzzleFile } from '#/server/puzzle-registry'

function loadPuzzleFile(date: string) {
  const puzzle = getPuzzleFile(date)
  if (!puzzle) throw new Error('Invalid puzzle file')
  return puzzle
}

function findPuzzleFile(date: string) {
  return getPuzzleFile(date)
}

function parseGameId(value: string): GameId {
  if (!isGameId(value)) throw new Error(`Unsupported game: ${value}`)
  return value
}

function loadGamePuzzleFile(gameId: GameId, date: string) {
  switch (gameId) {
    case 'star':
      return loadPuzzleFile(date)
  }
}

function findGamePuzzleFile(gameId: GameId, date: string) {
  switch (gameId) {
    case 'star':
      return findPuzzleFile(date)
  }
}

async function resolveGameDateForPlay(gameId: GameId): Promise<string | null> {
  switch (gameId) {
    case 'star':
      return resolvePuzzleDateForPlay()
  }
}

async function listGameAvailableDates(gameId: GameId): Promise<string[]> {
  switch (gameId) {
    case 'star':
      return listReleasedPuzzleDates()
  }
}

function isGameDateReleased(gameId: GameId, date: string): boolean {
  switch (gameId) {
    case 'star':
      return isPuzzleDateReleased(date)
  }
}

function toPublic(puzzle: Awaited<ReturnType<typeof loadPuzzleFile>>): PuzzlePublic {
  return {
    date: puzzle.date,
    imagePath: puzzle.imagePath,
  }
}

export const getTodayPuzzlePublic = createServerFn({ method: 'GET' })
  .inputValidator((d: { gameId: string }) => ({
    gameId: parseGameId(d.gameId),
  }))
  .handler(async ({ data }): Promise<PuzzlePublic | null> => {
    const date = await resolveGameDateForPlay(data.gameId)
    if (!date) return null
    const puzzle = await loadGamePuzzleFile(data.gameId, date)
    return toPublic(puzzle)
  })

export const getPuzzleByDate = createServerFn({ method: 'GET' })
  .inputValidator((d: { gameId: string; date: string }) => ({
    gameId: parseGameId(d.gameId),
    date: d.date,
  }))
  .handler(async ({ data }): Promise<PuzzlePublic | null> => {
    if (!isGameDateReleased(data.gameId, data.date)) return null
    const puzzle = findGamePuzzleFile(data.gameId, data.date)
    if (!puzzle) return null
    return toPublic(puzzle)
  })

export const listAvailableDates = createServerFn({ method: 'GET' })
  .inputValidator((d: { gameId: string }) => ({
    gameId: parseGameId(d.gameId),
  }))
  .handler(async ({ data }): Promise<string[]> => listGameAvailableDates(data.gameId))

export const submitGuess = createServerFn({ method: 'POST' })
  .inputValidator((d: { gameId: string; date: string; guess: string }) => ({
    gameId: parseGameId(d.gameId),
    date: d.date,
    guess: d.guess,
  }))
  .handler(async ({ data }) => {
    if (!isGameDateReleased(data.gameId, data.date)) return { ok: false } as const
    const puzzle = await loadGamePuzzleFile(data.gameId, data.date)
    const g = normalizeGuess(data.guess)
    const ok = g.length > 0 && puzzle.answersNormalized.includes(g)
    return { ok } as const
  })
