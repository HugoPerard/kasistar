import { useState } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import {
  getPuzzlePublicByDate,
  submitGuess as submitGuessFn,
} from '#/server/puzzle-fns'
import { PUZZLE_TIMEZONE } from '#/lib/puzzle-constants'

export const Route = createFileRoute('/archive/$date')({
  loader: async ({ params }) => {
    try {
      return await getPuzzlePublicByDate({ data: { date: params.date } })
    } catch {
      throw notFound()
    }
  },
  component: ArchivePage,
})

function ArchivePage() {
  const puzzle = Route.useLoaderData()
  const submitGuess = useServerFn(submitGuessFn)
  const [guess, setGuess] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'wrong'
  >('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setStatus('submitting')
    try {
      const result = await submitGuess({
        data: { date: puzzle.date, guess },
      })
      if (result.ok) {
        setStatus('success')
      } else {
        setStatus('wrong')
      }
    } catch {
      setError('Impossible de valider pour le moment. Réessaie plus tard.')
      setStatus('idle')
    }
  }

  return (
    <main className="page-wrap px-4 pb-12 pt-10">
      <p className="mb-4 text-center text-sm text-[var(--sea-ink-soft)]">
        <Link to="/" className="font-semibold text-[var(--lagoon-deep)] underline">
          Retour à l’accueil
        </Link>
      </p>
      <section className="island-shell rise-in rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
        <p className="island-kicker mb-2">Archive</p>
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
          {PUZZLE_TIMEZONE} — énigme du <strong>{puzzle.date}</strong>
        </p>
        <div className="mx-auto mb-8 max-w-md overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--chip-bg)] shadow-[0_12px_40px_rgba(30,90,72,0.12)]">
          <img
            src={puzzle.imagePath}
            alt="Indice visuel pour la devinette"
            className="h-auto w-full object-cover"
            width={400}
            height={400}
          />
        </div>
        {puzzle.hint ? (
          <p className="mb-6 text-center text-sm text-[var(--sea-ink-soft)]">
            <span className="font-semibold text-[var(--sea-ink)]">Indice :</span>{' '}
            {puzzle.hint}
          </p>
        ) : null}

        {status === 'success' ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-6 py-8 text-center text-lg font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            Bravo — bonne réponse !
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto flex max-w-md flex-col gap-3"
          >
            <label className="text-sm font-medium text-[var(--sea-ink)]">
              Ta réponse
              <input
                type="text"
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value)
                  if (status === 'wrong') setStatus('idle')
                }}
                autoComplete="off"
                className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-[var(--sea-ink)] shadow-inner outline-none transition focus:border-[rgba(79,184,178,0.6)] focus:ring-2 focus:ring-[rgba(79,184,178,0.25)] dark:bg-zinc-900/80"
                placeholder="Prénom et nom…"
                disabled={status === 'submitting'}
              />
            </label>
            {status === 'wrong' ? (
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Ce n’est pas ça — encore un essai ?
              </p>
            ) : null}
            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ) : null}
            <button
              type="submit"
              disabled={status === 'submitting' || !guess.trim()}
              className="rounded-full border border-[rgba(50,143,151,0.35)] bg-[rgba(79,184,178,0.2)] px-6 py-3 text-sm font-semibold text-[var(--lagoon-deep)] transition enabled:hover:-translate-y-0.5 enabled:hover:bg-[rgba(79,184,178,0.32)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'submitting' ? 'Vérification…' : 'Valider'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
