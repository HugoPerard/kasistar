import { createFileRoute, redirect } from '@tanstack/react-router'
import { gameDefinitions } from '@/lib/game-config'

/**
 * Ancienne URL : redirige vers les archives du mode Star.
 */
const legacyArchivesGame = Object.values(gameDefinitions).find(
  (game) => game.routes.legacyArchivesPath === '/archives',
)

export const Route = createFileRoute('/archives')({
  beforeLoad: ({ search }) => {
    if (!legacyArchivesGame) {
      throw new Error('No game configured for /archives redirect')
    }

    throw redirect({
      to: legacyArchivesGame.routes.archivesPath,
      search,
    })
  },
})
