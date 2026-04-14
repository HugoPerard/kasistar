import { createFileRoute, Link } from '@tanstack/react-router'
import { SparklesIcon } from 'lucide-react'
import { gameDefinitions } from '@/lib/game-config'

export const Route = createFileRoute('/')({
  component: ModesHub,
})

const modes = Object.values(gameDefinitions).map((game) => ({
  id: game.id,
  title: game.label,
  description: game.hubDescription,
  to: game.routes.basePath,
}))

function ModesHub() {
  return (
    <main className="page-atmosphere mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-12 pt-6 sm:pt-10">
      <div className="mb-10 max-w-xl text-center">
        <h1 className="type-page-title mb-3">Kasi</h1>
        <p className="type-body-muted text-balance">
          Choisis un mode de jeu. D&apos;autres modes arriveront bientôt.
        </p>
      </div>
      <ul className="grid w-full max-w-lg gap-4">
        {modes.map((mode) => (
          <li key={mode.id}>
            <Link
              to={mode.to}
              className="group content-panel flex flex-col gap-2 no-underline transition-[box-shadow,transform] hover:shadow-md motion-safe:hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2 font-semibold text-foreground">
                <SparklesIcon
                  className="size-5 shrink-0 text-primary"
                  aria-hidden
                />
                {mode.title}
              </span>
              <span className="type-body-muted-sm text-balance">
                {mode.description}
              </span>
              <span className="type-link-subtle mt-1 text-sm">
                Jouer
                <span aria-hidden>→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
