export type Language = 'en' | 'ur'

export interface AccessibilityPreferences {
  largeText: boolean
  reducedMotion: boolean
}

export interface LearnerState {
  language: Language
  lessonStep: number
  completed: boolean
  confidence: number | null
  accessibility: AccessibilityPreferences
}

export const DEFAULT_LEARNER_STATE: LearnerState = {
  language: 'en',
  lessonStep: 0,
  completed: false,
  confidence: null,
  accessibility: {
    largeText: false,
    reducedMotion: false,
  },
}

export function isLearnerState(value: unknown): value is LearnerState {
  if (typeof value !== 'object' || value === null) return false

  const state = value as Record<string, unknown>
  const accessibility = state.accessibility
  if (typeof accessibility !== 'object' || accessibility === null) return false

  const preferences = accessibility as Record<string, unknown>
  return (
    (state.language === 'en' || state.language === 'ur') &&
    typeof state.lessonStep === 'number' &&
    Number.isInteger(state.lessonStep) &&
    state.lessonStep >= 0 &&
    state.lessonStep <= 6 &&
    typeof state.completed === 'boolean' &&
    (state.confidence === null ||
      (typeof state.confidence === 'number' &&
        Number.isInteger(state.confidence) &&
        state.confidence >= 1 &&
        state.confidence <= 5)) &&
    typeof preferences.largeText === 'boolean' &&
    typeof preferences.reducedMotion === 'boolean'
  )
}
