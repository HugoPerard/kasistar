export const PUZZLE_TIMEZONE = 'Europe/Paris'

/** YYYY-MM-DD in Europe/Paris (used for “minuit” du jeu). */
export function getCalendarDateInParis(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: PUZZLE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}
