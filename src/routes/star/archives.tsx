import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { DailyGameArchivesView } from '@/components/daily-game/daily-game-archives-view'
import { StarPuzzleContent } from '@/components/star/star-puzzle-content'
import { getGameDefinition } from '@/lib/game-config'
import { type PuzzlePublic } from '@/lib/puzzle-schema'
import {
  availableDatesQueryOptions,
  puzzleByDateQueryOptions,
} from '@/lib/puzzle-queries'
import { pickDefaultArchiveDate } from '@/lib/archive-default-date'
import { listAvailableDates } from '#/server/puzzle-fns'

const starGame = getGameDefinition('star')

export const Route = createFileRoute('/star/archives')({
  validateSearch: (search: Record<string, unknown>): { date?: string } => {
    const value = search.date
    if (value == null || value === '') return {}

    const date = typeof value === 'string' ? value : String(value)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return {}

    const parsed = new Date(`${date}T12:00:00`)
    if (Number.isNaN(parsed.getTime())) return {}

    return { date }
  },
  beforeLoad: async ({ search }) => {
    if (search.date) return

    const dates = await listAvailableDates({ data: { gameId: starGame.id } })
    const defaultDate = pickDefaultArchiveDate(dates)

    if (defaultDate) {
      throw redirect({
        to: starGame.routes.archivesPath,
        search: { date: defaultDate },
      })
    }
  },
  component: StarArchivesPage,
})

function StarArchivesPage() {
  const navigate = useNavigate()
  const { date: dateParam } = Route.useSearch()

  const availableDatesQuery = useQuery(availableDatesQueryOptions(starGame.id))
  const puzzleQuery = useQuery({
    ...puzzleByDateQueryOptions(starGame.id, dateParam ?? ''),
    enabled: !!dateParam,
  })

  return (
    <DailyGameArchivesView<PuzzlePublic>
      game={starGame}
      dateParam={dateParam}
      availableDatesQuery={availableDatesQuery}
      puzzleQuery={puzzleQuery}
      onSelectDate={(date) =>
        navigate({
          to: starGame.routes.archivesPath,
          search: date ? { date: format(date, 'yyyy-MM-dd') } : {},
        })
      }
      renderContent={(puzzle) => (
        <StarPuzzleContent imagePath={puzzle.imagePath} alt={starGame.content.alt} />
      )}
    />
  )
}
