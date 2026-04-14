import type { FormEvent, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CircleCheckIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadingPuzzleHint } from '@/components/loading-puzzle-hint'
import {
  type GameDefinition,
  type DailyGameCopy,
} from '@/lib/game-config'
import { type DailyGameSubmitMutation } from './use-daily-game-play'

export function parseIsoDate(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00`)
}

export function formatDisplayDate(isoDate: string): string {
  return format(parseIsoDate(isoDate), 'EEEE d MMMM yyyy', {
    locale: fr,
  })
}

export function DailyGamePage({
  children,
  panelClassName = 'content-panel',
}: {
  children: ReactNode
  panelClassName?: string
}) {
  return (
    <main className="page-atmosphere mx-auto w-full max-w-4xl">
      <div className={panelClassName}>{children}</div>
    </main>
  )
}

export function DailyGameCenteredPage({ children }: { children: ReactNode }) {
  return (
    <main className="page-atmosphere mx-auto flex w-full max-w-4xl flex-col items-center justify-center">
      {children}
    </main>
  )
}

export function DailyGameDateHeader({
  label,
  date,
}: {
  label: string
  date: string
}) {
  return (
    <>
      <p className="type-overline mb-2 text-center">{label}</p>
      <p className="mb-8 text-center">
        <span className="type-date-hero glass-date-pill cursor-default">
          {formatDisplayDate(date)}
        </span>
      </p>
    </>
  )
}

export function DailyGameHowTo({ text }: { text: string }) {
  return (
    <p className="type-body-muted-sm mx-auto mt-10 max-w-[42ch] text-balance text-center">
      {text}
    </p>
  )
}

export function DailyGameLoadingState() {
  return (
    <div className="content-panel content-panel--compact w-full max-w-lg">
      <LoadingPuzzleHint />
    </div>
  )
}

export function DailyGameLoadErrorState({
  title,
  description,
  linkTo,
  linkLabel,
}: {
  title: string
  description: string
  linkTo: string
  linkLabel: string
}) {
  return (
    <div className="content-panel content-panel--compact m-auto w-full max-w-lg text-center">
      <h2 className="type-page-title mb-3">{title}</h2>
      <p className="type-body-muted mx-auto max-w-[65ch]">{description}</p>
      <p className="mt-8">
        <Link to={linkTo} className="type-link-subtle">
          {linkLabel}
          <span aria-hidden>→</span>
        </Link>
      </p>
    </div>
  )
}

export function DailyGameNoPuzzleState({
  game,
}: {
  game: GameDefinition
}) {
  return (
    <div className="content-panel content-panel--compact m-auto w-full max-w-lg text-center">
      <h2 className="type-page-title mb-3">{game.dailyGame.noPuzzleTitle}</h2>
      <p className="type-body-muted mx-auto max-w-[65ch]">
        Ajoute{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
          {game.content.authoringContentPath}
        </code>{' '}
        et l'indice associé sous{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
          {game.content.authoringAssetPath}
        </code>
        .
      </p>
      <p className="mt-8">
        <Link to={game.routes.archivesPath} className="type-link-subtle">
          {game.dailyGame.archivesLinkLabel}
          <span aria-hidden>→</span>
        </Link>
      </p>
    </div>
  )
}

export function DailyGameGuessForm({
  copy,
  guess,
  setGuess,
  onSubmit,
  submitMutation,
  variant,
}: {
  copy: DailyGameCopy
  guess: string
  setGuess: (value: string) => void
  onSubmit: (event: FormEvent) => void
  submitMutation: DailyGameSubmitMutation
  variant: 'form' | 'wrong'
}) {
  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-md flex-col gap-4">
      <label className="type-label flex flex-col gap-2">
        {copy.answerLabel}
        <Input
          nativeInput
          placeholder={copy.answerPlaceholder}
          value={guess}
          onChange={(event) => {
            setGuess(event.target.value)
            if (variant === 'wrong') submitMutation.reset()
          }}
          disabled={submitMutation.isPending}
          autoComplete="off"
          className="h-11 sm:h-10"
        />
      </label>
      {variant === 'wrong' ? (
        <Alert variant="warning">
          <AlertDescription>{copy.wrongAnswerDescription}</AlertDescription>
        </Alert>
      ) : null}
      {submitMutation.isError ? (
        <Alert variant="error">
          <AlertDescription>{copy.submitErrorDescription}</AlertDescription>
        </Alert>
      ) : null}
      <Button
        type="submit"
        size="lg"
        disabled={submitMutation.isPending || !guess.trim()}
        loading={submitMutation.isPending}
        className="mt-1"
      >
        {submitMutation.isPending ? copy.submitPendingLabel : copy.submitLabel}
      </Button>
    </form>
  )
}

export function DailyGameSuccessAlert({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Alert variant="success" className="mb-8">
      <CircleCheckIcon aria-hidden className="size-4 shrink-0" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

export function DailyGameArchiveSkeleton() {
  return (
    <>
      <div className="puzzle-frame">
        <Skeleton className="size-full" />
      </div>
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-2xl sm:h-10" />
        </div>
        <Skeleton className="mt-1 h-10 w-full rounded-full" />
      </div>
    </>
  )
}
