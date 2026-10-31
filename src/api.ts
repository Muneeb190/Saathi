import { normalizeLearnerState, type LearnerState } from '../shared/learner-state'
import type { AssistantRequest } from '../shared/assistant'

export class AssistantApiError extends Error {
  readonly status: number

  constructor(
    message: string,
    status: number,
  ) {
    super(message)
    this.name = 'AssistantApiError'
    this.status = status
  }
}

async function readState(response: Response): Promise<LearnerState> {
  if (!response.ok) {
    throw new Error(`Progress service returned ${response.status}.`)
  }

  const value: unknown = await response.json()
  const state = normalizeLearnerState(value)
  if (!state) {
    throw new Error('Progress service returned an unsupported state.')
  }
  return state
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

export async function fetchAssistantAvailability(): Promise<boolean> {
  const response = await fetch('/api/assistant/status')
  if (!response.ok) {
    throw new Error(`Assistant service returned ${response.status}.`)
  }

  const value: unknown = await response.json()
  if (
    typeof value !== 'object' ||
    value === null ||
    !('available' in value) ||
    typeof value.available !== 'boolean'
  ) {
    throw new Error('Assistant service returned an unsupported status.')
  }
  return value.available
}

export async function sendAssistantMessage(
  request: AssistantRequest,
): Promise<string> {
  const response = await fetch('/api/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!response.ok) {
    throw new AssistantApiError(
      `Assistant request returned ${response.status}.`,
      response.status,
    )
  }

  const value: unknown = await response.json()
  if (
    typeof value !== 'object' ||
    value === null ||
    !('reply' in value) ||
    typeof value.reply !== 'string' ||
    !value.reply.trim()
  ) {
    throw new Error('Assistant returned an unsupported reply.')
  }
  return value.reply
}

export async function fetchAssistantSpeech(text: string): Promise<Blob> {
  const response = await fetch('/api/speech/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!response.ok) {
    throw new Error(`Assistant speech returned ${response.status}.`)
  }
  return response.blob()
}
