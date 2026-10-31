import assert from 'node:assert/strict'
import test from 'node:test'
import {
  DEFAULT_LEARNER_STATE,
  isLearnerState,
  normalizeLearnerState,
} from './learner-state.js'

test('migrates existing learner progress without changing saved video-call progress', () => {
  const legacyState = {
    language: 'ur',
    lessonStep: 4,
    completed: false,
    confidence: 3,
    accessibility: { largeText: true, reducedMotion: false },
  }
  const migrated = normalizeLearnerState(legacyState)

  assert.ok(migrated)
  assert.equal(migrated.lessonStep, 4)
  assert.equal(migrated.language, 'ur')
  assert.deepEqual(migrated.lessonProgress, DEFAULT_LEARNER_STATE.lessonProgress)
})

test('validates independent interactive lesson progress', () => {
  const state = {
    ...DEFAULT_LEARNER_STATE,
    lessonProgress: {
      ...DEFAULT_LEARNER_STATE.lessonProgress,
      'scam-detective': { step: 3, completed: false },
      'utility-bill': { step: 6, completed: true },
    },
  }

  assert.equal(isLearnerState(state), true)
  assert.equal(
    isLearnerState({
      ...state,
      lessonProgress: {
        ...state.lessonProgress,
        'utility-bill': { step: 7, completed: false },
      },
    }),
    false,
  )
})
