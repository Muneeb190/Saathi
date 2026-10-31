import type { Language } from './learner-state.js'

export type AppRoute =
  | '/'
  | '/dashboard'
  | '/lesson/video-call'
  | '/practice/video-call'
  | '/complete/video-call'

export interface AssistantHistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AssistantRequest {
  message: string
  language: Language
  route: AppRoute
  lessonStep: number
  history: AssistantHistoryMessage[]
}
