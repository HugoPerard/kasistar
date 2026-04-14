import { useMutation } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { type GameId } from '@/lib/game-config'
import { isGameDateSolved, markGameDateSolved } from '@/lib/kasi-game-storage'
import { useSound } from '@/hooks/use-sound'
import { confirmation003Sound } from '@/lib/confirmation-003'
import { error008Sound } from '@/lib/error-008'
import { submitGuess as submitGuessFn } from '#/server/puzzle-fns'

export type DailyGameSubmitMutation = {
  data?: { ok: boolean; date: string }
  isPending: boolean
  isError: boolean
  isSuccess: boolean
  mutate: (variables: { date: string; guess: string }) => void
  reset: () => void
}

export function useDailyGamePlay(gameId: GameId) {
  const submitGuess = useServerFn(submitGuessFn)
  const [guess, setGuess] = useState('')
  const [playSuccess] = useSound(confirmation003Sound)
  const [playError] = useSound(error008Sound)

  const submitMutation = useMutation({
    mutationFn: async ({ date, guess }: { date: string; guess: string }) => {
      const result = await submitGuess({ data: { gameId, date, guess } })
      return { ...result, date }
    },
    onSuccess: (data) => {
      if (data.ok) {
        markGameDateSolved(gameId, data.date)
        playSuccess()
      } else {
        playError()
      }
    },
    onError: () => {
      playError()
    },
  })

  function reset() {
    setGuess('')
    submitMutation.reset()
  }

  return {
    guess,
    setGuess,
    submitMutation: submitMutation as DailyGameSubmitMutation,
    isDateSolved: (date: string) => isGameDateSolved(gameId, date),
    reset,
  }
}
