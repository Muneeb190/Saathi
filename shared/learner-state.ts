export type Language = 'en' | 'ur'
export type InteractiveLessonId = 'scam-detective' | 'utility-bill'

export interface LessonProgress {
  step: number
  completed: boolean
}

export interface AccessibilityPreferences {
  largeText: boolean
  reducedMotion: boolean
}

export interface LearnerState {
  language: Language
  lessonStep: number
  completed: boolean
  confidence: number | null
  lessonProgress: Record<InteractiveLessonId, LessonProgress>
  accessibility: AccessibilityPreferences
}

export const DEFAULT_LEARNER_STATE: LearnerState = {
  language: 'en',
  lessonStep: 0,
  completed: false,
  confidence: null,
  lessonProgress: {
    'scam-detective': { step: 0, completed: false },
    'utility-bill': { step: 0, completed: false },
  },
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
  const lessonProgress = state.lessonProgress
  const isLessonProgressValid =
    lessonProgress === undefined ||
    (typeof lessonProgress === 'object' &&
      lessonProgress !== null &&
      isProgressRecord(lessonProgress))

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
    typeof preferences.reducedMotion === 'boolean' &&
    isLessonProgressValid
  )
}

function isProgressRecord(value: object): boolean {
  const progress = value as Record<string, unknown>
  return (['scam-detective', 'utility-bill'] as const).every((id) => {
    const lesson = progress[id]
    if (typeof lesson !== 'object' || lesson === null) return false
    const entry = lesson as Record<string, unknown>
    return (
      typeof entry.step === 'number' &&
      Number.isInteger(entry.step) &&
      entry.step >= 0 &&
      entry.step <= (id === 'scam-detective' ? 5 : 6) &&
      typeof entry.completed === 'boolean' &&
      (!entry.completed || entry.step === (id === 'scam-detective' ? 5 : 6))
    )
  })
}

export function normalizeLearnerState(value: unknown): LearnerState | null {
  if (!isLearnerState(value)) return null
  const state = value as LearnerState & {
    lessonProgress?: LearnerState['lessonProgress']
  }
  return {
    ...state,
    lessonProgress: state.lessonProgress ?? DEFAULT_LEARNER_STATE.lessonProgress,
  }
}

export function getInteractiveLessonProgress(
  state: LearnerState,
  lessonId: InteractiveLessonId,
): LessonProgress {
  return state.lessonProgress[lessonId] ?? DEFAULT_LEARNER_STATE.lessonProgress[lessonId]
}
