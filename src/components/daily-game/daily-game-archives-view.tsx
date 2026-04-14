import { useState, type FormEvent, type ReactNode } from 'react'
import { type UseQueryResult } from '@tanstack/react-query'
import { getUiState } from '@bearstudio/ui-state'
import { Link } from '@tanstack/react-router'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArchiveCalendarModal } from '@/components/archive-calendar-modal'
import { Button } from '@/components/ui/button'
import {
  DailyGameArchiveSkeleton,
  DailyGameGuessForm,
  DailyGameHowTo,
  DailyGamePage,
  DailyGameSuccessAlert,
  formatDisplayDate,
  parseIsoDate,
} from '@/components/daily-game/daily-game-layout'
import { useDailyGamePlay } from '@/components/daily-game/use-daily-game-play'
import { type GameDefinition } from '@/lib/game-config'

type DailyGamePublic = {
  date: string
}

type DailyGameArchivesViewProps<TPublic extends DailyGamePublic> = {
  game: GameDefinition
  dateParam?: string
  availableDatesQuery: UseQueryResult<string[], Error>
  puzzleQuery: UseQueryResult<TPublic | null, Error>
  onSelectDate: (date: Date | undefined) => void
  renderContent: (puzzle: TPublic) => ReactNode
}

export function DailyGameArchivesView<TPublic extends DailyGamePublic>({
  game,
  dateParam,
  availableDatesQuery,
  puzzleQuery,
  onSelectDate,
  renderContent,
}: DailyGameArchivesViewProps<TPublic>) {
  const { guess, setGuess, submitMutation, isDateSolved, reset } =
    useDailyGamePlay(game.id)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const isoDate = dateParam ?? undefined
  const selectedDate = isoDate ? parseIsoDate(isoDate) : undefined
  const minDate = availableDatesQuery.data?.[0]
    ? parseIsoDate(availableDatesQuery.data[0])
    : undefined
  const maxDate =
    availableDatesQuery.data && availableDatesQuery.data.length > 0
      ? parseIsoDate(
          availableDatesQuery.data[availableDatesQuery.data.length - 1],
        )
      : undefined
  const selectedDateIndex = isoDate
    ? availableDatesQuery.data?.indexOf(isoDate) ?? -1
    : -1
  const previousDate =
    selectedDateIndex > 0 && availableDatesQuery.data
      ? availableDatesQuery.data[selectedDateIndex - 1]
      : undefined
  const nextDate =
    selectedDateIndex >= 0 &&
    availableDatesQuery.data &&
    selectedDateIndex < availableDatesQuery.data.length - 1
      ? availableDatesQuery.data[selectedDateIndex + 1]
      : undefined

  const ui = getUiState((set) => {
    if (!selectedDate) return set('no-date')
    if (puzzleQuery.status === 'pending') return set('loading')
    if (puzzleQuery.status === 'error') return set('error')

    const puzzle = puzzleQuery.data
    if (!puzzle) return set('not-found', { selectedDate })

    const solved =
      isDateSolved(puzzle.date) ||
      (submitMutation.isSuccess &&
        submitMutation.data?.ok &&
        submitMutation.data.date === puzzle.date)

    if (solved) return set('success', { puzzle })
    if (submitMutation.isSuccess && !submitMutation.data?.ok) {
      return set('wrong', { puzzle })
    }

    return set('form', { puzzle })
  })

  function handleSelectDate(date: Date | undefined) {
    onSelectDate(date)
    reset()
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!puzzleQuery.data) return
    submitMutation.mutate({ date: puzzleQuery.data.date, guess })
  }

  return (
    <DailyGamePage panelClassName="content-panel min-w-0">
      <p className="type-overline mb-2 text-center">
        {game.dailyGame.archivesLabel}
      </p>
      <div className="mb-8 flex items-center justify-center gap-2 sm:gap-3">
        {previousDate ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Voir la devinette du ${formatDisplayDate(previousDate)}`}
            onClick={() => handleSelectDate(parseIsoDate(previousDate))}
          >
            <ChevronLeftIcon aria-hidden />
          </Button>
        ) : null}
        {isoDate ? (
          <button
            type="button"
            className="type-date-hero glass-date-pill inline-flex cursor-pointer items-center gap-2"
            aria-haspopup="dialog"
            aria-expanded={calendarOpen}
            aria-label={`Choisir une autre date. ${formatDisplayDate(isoDate)}`}
            onClick={() => setCalendarOpen(true)}
          >
            <span>{formatDisplayDate(isoDate)}</span>
            <ChevronDownIcon
              className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${calendarOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </button>
        ) : (
          <span className="type-date-hero text-muted-foreground">—</span>
        )}
        {nextDate ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Voir la devinette du ${formatDisplayDate(nextDate)}`}
            onClick={() => handleSelectDate(parseIsoDate(nextDate))}
          >
            <ChevronRightIcon aria-hidden />
          </Button>
        ) : null}
      </div>

      <ArchiveCalendarModal
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
        selectedDate={selectedDate}
        availableDates={availableDatesQuery.data}
        minDate={minDate}
        maxDate={maxDate}
        onSelectDate={handleSelectDate}
        isDateSolved={isDateSolved}
      />

      {ui
        .match('no-date', () => (
          <div className="puzzle-frame-empty">
            <p className="type-body-muted-sm px-4 text-center">
              {game.dailyGame.noArchiveDateDescription}
            </p>
          </div>
        ))
        .match('loading', () => <DailyGameArchiveSkeleton />)
        .match('error', () => (
          <Alert variant="error" className="mb-8">
            <AlertDescription>{game.dailyGame.loadErrorDescription}</AlertDescription>
          </Alert>
        ))
        .match('not-found', ({ selectedDate }) => (
          <Alert variant="default" className="mb-8">
            <AlertDescription>
              {game.dailyGame.archiveNotFoundPrefix}{' '}
              {format(selectedDate, 'd MMMM yyyy', { locale: fr })}.
            </AlertDescription>
          </Alert>
        ))
        .match('success', ({ puzzle }) => (
          <div className="motion-safe:animate-success-pop motion-reduce:animate-none">
            {renderContent(puzzle)}
            <DailyGameSuccessAlert
              title={game.dailyGame.successTitle}
              description={game.dailyGame.archivesSuccessDescription}
            />
          </div>
        ))
        .match('wrong', ({ puzzle }) => (
          <>
            {renderContent(puzzle)}
            <DailyGameGuessForm
              copy={game.dailyGame}
              guess={guess}
              setGuess={setGuess}
              onSubmit={onSubmit}
              submitMutation={submitMutation}
              variant="wrong"
            />
          </>
        ))
        .match('form', ({ puzzle }) => (
          <>
            {renderContent(puzzle)}
            <DailyGameGuessForm
              copy={game.dailyGame}
              guess={guess}
              setGuess={setGuess}
              onSubmit={onSubmit}
              submitMutation={submitMutation}
              variant="form"
            />
          </>
        ))
        .exhaustive()}

      <DailyGameHowTo text={game.dailyGame.archivesHowToPlay} />
      <p className="mt-6 text-center">
        <Link to={game.routes.basePath} className="type-link-subtle">
          <span>{game.dailyGame.todayLinkLabel}</span>
          <span aria-hidden>→</span>
        </Link>
      </p>
    </DailyGamePage>
  )
}
