import { isLearnerState, type LearnerState } from '../shared/learner-state'

async function readState(response: Response): Promise<LearnerState> {
  if (!response.ok) {
    throw new Error(`Progress service returned ${response.status}.`)
  }

  const value: unknown = await response.json()
  if (!isLearnerState(value)) {
    throw new Error('Progress service returned an unsupported state.')
  }
  return value
}

export async function fetchLearnerState(): Promise<LearnerState> {
  const response = await fetch('/api/progress')
  return readState(response)
}

export async function saveLearnerState(state: LearnerState): Promise<LearnerState> {
  const response = await fetch('/api/progress', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  })
  return readState(response)
}

export async function fetchUrduSpeechAvailability(): Promise<boolean> {
  const response = await fetch('/api/speech/status')
  if (!response.ok) {
    throw new Error(`Urdu speech service returned ${response.status}.`)
  }

  const value: unknown = await response.json()
  if (
    typeof value !== 'object' ||
    value === null ||
    !('available' in value) ||
    typeof value.available !== 'boolean'
  ) {
    throw new Error('Urdu speech service returned an unsupported status.')
  }

  return value.available
}
