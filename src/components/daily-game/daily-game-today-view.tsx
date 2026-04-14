import { useLayoutEffect, useState, type FormEvent, type ReactNode } from 'react'
import { type UseQueryResult } from '@tanstack/react-query'
import { getUiState } from '@bearstudio/ui-state'
import { Link } from '@tanstack/react-router'
import {
  DailyGameCenteredPage,
  DailyGameDateHeader,
  DailyGameGuessForm,
  DailyGameHowTo,
  DailyGameLoadErrorState,
  DailyGameLoadingState,
  DailyGameNoPuzzleState,
  DailyGamePage,
  DailyGameSuccessAlert,
} from '@/components/daily-game/daily-game-layout'
import { useDailyGamePlay } from '@/components/daily-game/use-daily-game-play'
import { type GameDefinition, type GameId } from '@/lib/game-config'
import { todayPuzzleQueryOptions } from '@/lib/puzzle-queries'
import { queryClient } from '@/lib/query-client'

type DailyGamePublic = {
  date: string
}

type DailyGameTodayViewProps<TPublic extends DailyGamePublic> = {
  game: GameDefinition
  renderContent: (puzzle: TPublic) => ReactNode
  puzzleQuery: UseQueryResult<TPublic | null, Error>
}

export function createDailyGameTodayLoader(gameId: GameId) {
  return async () => queryClient.ensureQueryData(todayPuzzleQueryOptions(gameId))
}

export function DailyGameTodayView<TPublic extends DailyGamePublic>({
  game,
  renderContent,
  puzzleQuery,
}: DailyGameTodayViewProps<TPublic>) {
  const { guess, setGuess, submitMutation, isDateSolved } = useDailyGamePlay(game.id)
  const [solvedFromStorage, setSolvedFromStorage] = useState(false)

  useLayoutEffect(() => {
    setSolvedFromStorage(
      puzzleQuery.data ? isDateSolved(puzzleQuery.data.date) : false,
    )
  }, [isDateSolved, puzzleQuery.data])

  const ui = getUiState((set) => {
    if (puzzleQuery.isPending && !puzzleQuery.data) return set('pending')
    if (puzzleQuery.isError) return set('error')

    const puzzle = puzzleQuery.data
    if (!puzzle) return set('no-puzzle')

    const solved =
      solvedFromStorage ||
      (submitMutation.isSuccess &&
        submitMutation.data?.ok &&
        submitMutation.data.date === puzzle.date)

    if (solved) return set('success', { puzzle })
    if (submitMutation.isSuccess && !submitMutation.data?.ok) {
      return set('wrong', { puzzle })
    }

    return set('form', { puzzle })
  })

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!puzzleQuery.data) return
    submitMutation.mutate({ date: puzzleQuery.data.date, guess })
  }

  return ui
    .match('pending', () => (
      <DailyGameCenteredPage>
        <DailyGameLoadingState />
      </DailyGameCenteredPage>
    ))
    .match('error', () => (
      <DailyGameCenteredPage>
        <DailyGameLoadErrorState
          title={game.dailyGame.loadErrorTitle}
          description={game.dailyGame.loadErrorDescription}
          linkTo={game.routes.archivesPath}
          linkLabel={game.dailyGame.archivesLinkLabel}
        />
      </DailyGameCenteredPage>
    ))
    .match('no-puzzle', () => (
      <DailyGameCenteredPage>
        <DailyGameNoPuzzleState game={game} />
      </DailyGameCenteredPage>
    ))
    .match('success', ({ puzzle }) => (
      <DailyGamePage>
        <div className="motion-safe:animate-success-pop motion-reduce:animate-none">
          <DailyGameDateHeader
            label={game.dailyGame.todayLabel}
            date={puzzle.date}
          />
          {renderContent(puzzle)}
          <DailyGameSuccessAlert
            title={game.dailyGame.successTitle}
            description={game.dailyGame.successDescription}
          />
          <DailyGameHowTo text={game.dailyGame.howToPlay} />
          <p className="mt-6 text-center">
            <Link to={game.routes.archivesPath} className="type-link-subtle">
              <span>{game.dailyGame.archivesLinkLabel}</span>
              <span aria-hidden>→</span>
            </Link>
          </p>
        </div>
      </DailyGamePage>
    ))
    .match('wrong', ({ puzzle }) => (
      <DailyGamePage panelClassName="content-panel mx-auto max-w-lg">
        <DailyGameDateHeader
          label={game.dailyGame.todayLabel}
          date={puzzle.date}
        />
        {renderContent(puzzle)}
        <DailyGameGuessForm
          copy={game.dailyGame}
          guess={guess}
          setGuess={setGuess}
          onSubmit={onSubmit}
          submitMutation={submitMutation}
          variant="wrong"
        />
        <DailyGameHowTo text={game.dailyGame.howToPlay} />
        <p className="mt-6 text-center">
          <Link to={game.routes.archivesPath} className="type-link-subtle">
            <span>{game.dailyGame.archivesLinkLabel}</span>
            <span aria-hidden>→</span>
          </Link>
        </p>
      </DailyGamePage>
    ))
    .match('form', ({ puzzle }) => (
      <DailyGamePage panelClassName="content-panel mx-auto max-w-lg">
        <DailyGameDateHeader
          label={game.dailyGame.todayLabel}
          date={puzzle.date}
        />
        {renderContent(puzzle)}
        <DailyGameGuessForm
          copy={game.dailyGame}
          guess={guess}
          setGuess={setGuess}
          onSubmit={onSubmit}
          submitMutation={submitMutation}
          variant="form"
        />
        <DailyGameHowTo text={game.dailyGame.howToPlay} />
        <p className="mt-6 text-center">
          <Link to={game.routes.archivesPath} className="type-link-subtle">
            <span>{game.dailyGame.archivesLinkLabel}</span>
            <span aria-hidden>→</span>
          </Link>
        </p>
      </DailyGamePage>
    ))
    .exhaustive()
}
