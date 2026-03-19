import { describe, expect, it } from 'vitest'
import { normalizeGuess } from './normalize-guess'

describe('normalizeGuess', () => {
  it('matches puzzle JSON convention (lowercase, no accents)', () => {
    expect(normalizeGuess('  Jean Dujardin  ')).toBe('jean dujardin')
    expect(normalizeGuess('MARION COTILLARD')).toBe('marion cotillard')
    expect(normalizeGuess('Élodie Bouchez')).toBe('elodie bouchez')
  })
})
