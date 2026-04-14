import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { DailyGameTodayView, createDailyGameTodayLoader } from '@/components/daily-game/daily-game-today-view'
import { StarPuzzleContent } from '@/components/star/star-puzzle-content'
import { getGameDefinition } from '@/lib/game-config'
import { type PuzzlePublic } from '@/lib/puzzle-schema'
import { todayPuzzleQueryOptions } from '@/lib/puzzle-queries'

const starGame = getGameDefinition('star')

export const Route = createFileRoute('/star/')({
  loader: createDailyGameTodayLoader(starGame.id),
  component: StarHome,
})

function StarHome() {
  const loaderData = Route.useLoaderData()
  const puzzleQuery = useQuery({
    ...todayPuzzleQueryOptions(starGame.id),
    initialData: loaderData,
  })

  return (
    <DailyGameTodayView<PuzzlePublic>
      game={starGame}
      puzzleQuery={puzzleQuery}
      renderContent={(puzzle) => (
        <StarPuzzleContent imagePath={puzzle.imagePath} alt={starGame.content.alt} />
      )}
    />
  )
}
