import type { Language } from './learner-state.js'

export type AppRoute =
  | '/'
  | '/dashboard'
  | '/lesson/video-call'
  | '/practice/video-call'
  | '/complete/video-call'
  | '/lesson/scam-detective'
  | '/practice/scam-detective'
  | '/complete/scam-detective'
  | '/lesson/utility-bill'
  | '/practice/utility-bill'
  | '/complete/utility-bill'

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
