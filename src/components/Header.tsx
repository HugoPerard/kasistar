import { Fragment } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { getGameForPathname, type GameBasePath } from '@/lib/game-config'
import ThemeToggle from './ThemeToggle'

const wordmarkClass =
  'type-brand-wordmark m-0 shrink-0 text-primary no-underline'

type TrailSegment = { label: string; to?: GameBasePath }

function gameTrail(pathname: string): TrailSegment[] | null {
  const game = getGameForPathname(pathname)
  if (!game) return null

  const p = pathname.replace(/\/$/, '') || '/'
  if (p === game.routes.basePath) {
    return [{ label: game.label }]
  }
  if (p === game.routes.archivesPath) {
    return [
      { label: game.label, to: game.routes.basePath },
      { label: game.dailyGame.archivesLabel },
    ]
  }
  return [{ label: game.label }]
}

export default function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const game = getGameForPathname(pathname)
  const trail = gameTrail(pathname)
  const onArchivesPage = game
    ? pathname.replace(/\/$/, '') === game.routes.archivesPath
    : false

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 pb-3 sm:px-6 sm:pt-4 sm:pb-4">
      <div className="topbar-glass mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          <Link
            to="/"
            className="m-0 block shrink-0 rounded-xl no-underline ring-1 ring-transparent ring-offset-2 transition-[box-shadow] focus-visible:outline-none focus-visible:ring-ring"
          >
            <img
              src="/favicon.ico"
              alt="Accueil Kasi"
              width={32}
              height={32}
              className="block size-8 rounded-xl ring-1 ring-border dark:ring-white/15"
              decoding="async"
              fetchPriority="low"
            />
          </Link>
          <div className="flex min-w-0 flex-col justify-center [font-family:var(--font-heading)]">
            {trail ? (
              <nav
                aria-label="Fil d'Ariane du jeu"
                className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5"
              >
                <Link to="/" className={wordmarkClass}>
                  Kasi
                </Link>
                {trail.map((segment, i) => {
                  const isLast = i === trail.length - 1
                  return (
                    <Fragment key={`${segment.label}-${i}`}>
                      <span
                        className="type-brand-wordmark shrink-0 text-muted-foreground/70 select-none"
                        aria-hidden
                      >
                        /
                      </span>
                      {segment.to && !isLast ? (
                        <Link
                          to={segment.to}
                          className={`${wordmarkClass} transition-opacity hover:opacity-80`}
                        >
                          {segment.label}
                        </Link>
                      ) : (
                        <span
                          className={`${wordmarkClass} truncate`}
                          aria-current={isLast ? 'page' : undefined}
                        >
                          {segment.label}
                        </span>
                      )}
                    </Fragment>
                  )
                })}
              </nav>
            ) : (
              <Link to="/" className={`${wordmarkClass} w-fit`}>
                Kasi
              </Link>
            )}
          </div>
        </div>
        <nav className="flex shrink-0 items-center gap-3">
          {game && trail && !onArchivesPage ? (
            <Link
              to={game.routes.archivesPath}
              className="text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-primary"
            >
              {game.dailyGame.archivesLabel}
            </Link>
          ) : null}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
