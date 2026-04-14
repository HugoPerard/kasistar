export type GameId = 'star'
export type GameBasePath = '/star'
export type GameArchivesPath = '/star/archives'
export type LegacyGameArchivesPath = '/archives'

export type DailyGameCopy = {
  todayLabel: string
  archivesLabel: string
  howToPlay: string
  archivesHowToPlay: string
  answerLabel: string
  answerPlaceholder: string
  submitLabel: string
  submitPendingLabel: string
  wrongAnswerDescription: string
  submitErrorDescription: string
  loadErrorTitle: string
  loadErrorDescription: string
  noPuzzleTitle: string
  successTitle: string
  successDescription: string
  archivesSuccessDescription: string
  archivesLinkLabel: string
  todayLinkLabel: string
  noArchiveDateDescription: string
  archiveNotFoundPrefix: string
}

export type GameDefinition = {
  id: GameId
  label: string
  hubDescription: string
  routes: {
    basePath: GameBasePath
    archivesPath: GameArchivesPath
    legacyArchivesPath?: LegacyGameArchivesPath
  }
  content: {
    alt: string
    authoringContentPath: string
    authoringAssetPath: string
  }
  dailyGame: DailyGameCopy
}

export const gameDefinitions = {
  star: {
    id: 'star',
    label: 'Star',
    hubDescription:
      'Une image, un nom de célébrité à retrouver — jeu de mots et énigme du jour.',
    routes: {
      basePath: '/star',
      archivesPath: '/star/archives',
      legacyArchivesPath: '/archives',
    },
    content: {
      alt: "Indice visuel pour la devinette",
      authoringContentPath: 'content/puzzles/YYYY-MM-DD.json',
      authoringAssetPath: 'public/puzzles/',
    },
    dailyGame: {
      todayLabel: "Aujourd'hui",
      archivesLabel: 'Archives',
      howToPlay:
        "Trouve le jeu de mots sur le nom de la célébrité à partir de l'image.",
      archivesHowToPlay:
        "Trouve le jeu de mots sur le nom de la célébrité à partir de l'image. Rattrape les devinettes qui t'ont échappées en parcourant les archives.",
      answerLabel: 'Ta réponse',
      answerPlaceholder: 'Prénom et nom…',
      submitLabel: 'Valider',
      submitPendingLabel: 'Vérification de ta réponse…',
      wrongAnswerDescription: 'Pas cette fois — un autre essai ?',
      submitErrorDescription:
        'Impossible de valider pour le moment. Réessaie plus tard.',
      loadErrorTitle: 'Erreur de chargement',
      loadErrorDescription:
        'Impossible de charger la devinette. Réessaie plus tard.',
      noPuzzleTitle: "Aucune devinette pour l'instant",
      successTitle: "Chapeau — c'est la bonne réponse !",
      successDescription: 'Rendez-vous demain pour une nouvelle énigme.',
      archivesSuccessDescription: 'Tu as déjà trouvé cette devinette.',
      archivesLinkLabel: 'Voir les archives',
      todayLinkLabel: 'Retour au jeu du jour',
      noArchiveDateDescription:
        'Aucune devinette publiée pour le moment.',
      archiveNotFoundPrefix: 'Aucune devinette pour le',
    },
  },
} satisfies Record<GameId, GameDefinition>

export function getGameDefinition(gameId: GameId): GameDefinition {
  return gameDefinitions[gameId]
}

export function isGameId(value: string): value is GameId {
  return value in gameDefinitions
}

export function getGameForPathname(pathname: string): GameDefinition | null {
  const normalized = pathname.replace(/\/$/, '') || '/'

  for (const game of Object.values(gameDefinitions)) {
    if (normalized === game.routes.basePath) return game
    if (normalized.startsWith(`${game.routes.basePath}/`)) return game
  }

  return null
}
