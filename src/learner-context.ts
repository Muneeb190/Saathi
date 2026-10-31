import { createContext, useContext } from 'react'
import type { LearnerState } from '../shared/learner-state'

export interface LearnerContextValue {
  state: LearnerState
  loading: boolean
  saving: boolean
  saveError: boolean
  loadError: boolean
  localStorageError: boolean
  update: (patch: Partial<LearnerState>) => Promise<void>
  retrySave: () => Promise<void>
  retryLoad: () => Promise<void>
}

export const LearnerContext = createContext<LearnerContextValue | null>(null)

export function useLearner() {
  const value = useContext(LearnerContext)
  if (!value) {
    throw new Error('useLearner must be used inside LearnerProvider.')
  }
  return value
}
