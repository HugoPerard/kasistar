import { queryOptions } from '@tanstack/react-query'
import { type GameId } from '#/lib/game-config'
import {
  getTodayPuzzlePublic,
  getPuzzleByDate,
  listAvailableDates,
} from '#/server/puzzle-fns'

export const todayPuzzleQueryOptions = (gameId: GameId) =>
  queryOptions({
    queryKey: ['dailyGame', gameId, 'today'] as const,
    queryFn: () => getTodayPuzzlePublic({ data: { gameId } }),
  })

export const puzzleByDateQueryOptions = (gameId: GameId, date: string) =>
  queryOptions({
    queryKey: ['dailyGame', gameId, 'date', date] as const,
    queryFn: () => getPuzzleByDate({ data: { gameId, date } }),
  })

export const availableDatesQueryOptions = (gameId: GameId) =>
  queryOptions({
    queryKey: ['dailyGame', gameId, 'dates'] as const,
    queryFn: () => listAvailableDates({ data: { gameId } }),
  })
