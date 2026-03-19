/**
 * Normalizes user input for comparison with `answerNormalized` in puzzle JSON.
 */
export function normalizeGuess(input: string): string {
  return input
    .trim()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
