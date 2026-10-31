import express from 'express'
import { normalizeLearnerState } from '../../shared/learner-state.js'
import { interactiveLessons } from '../../shared/interactive-lessons.js'
import { lessonSteps } from '../../shared/lesson-steps.js'
import {
  AssistantServiceError,
  getGroqConfig,
  getAssistantReply,
  isAssistantRequest,
} from './assistant.js'
import { createLearnerDatabase } from './database.js'
import { createRateLimit } from './rate-limit.js'
import { getAssistantSpeechAudio, getUrduSpeechAudio } from './speech.js'

const database = await createLearnerDatabase()
const app = express()
const port = Number(process.env.PORT ?? 3001)
const frontendOrigin = process.env.FRONTEND_ORIGIN

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port number.')
}

app.use(express.json({ limit: '16kb' }))
app.use((request, response, next) => {
  if (request.headers.origin === frontendOrigin && frontendOrigin) {
    response.setHeader('Access-Control-Allow-Origin', frontendOrigin)
    response.setHeader('Vary', 'Origin')
    response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
  if (request.method === 'OPTIONS') {
    response.sendStatus(204)
    return
  }
  next()
})

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/speech/status', (_request, response) => {
  response.json({ available: true })
})

app.get('/api/assistant/status', (_request, response) => {
  response.json({ available: getGroqConfig() !== null })
})

app.post('/api/assistant/chat', createRateLimit(8, 60_000), async (request, response) => {
  const body: unknown = request.body
  if (!isAssistantRequest(body)) {
    response.status(400).json({ error: 'Send a message and a valid current app context.' })
    return
  }

  try {
    const reply = await getAssistantReply(body)
    response.json({ reply })
  } catch (error) {
    if (error instanceof AssistantServiceError) {
      response.status(error.status).json({ error: error.message })
      return
    }
    console.error('Groq assistant request failed:', error)
    response.status(502).json({ error: 'The assistant could not answer right now.' })
  }
})

app.get('/api/speech/ur/:step', async (request, response) => {
  const step = Number(request.params.step)
  const requestedLesson = request.query.lesson
  const lessonId =
    requestedLesson === 'scam-detective' || requestedLesson === 'utility-bill'
      ? requestedLesson
      : requestedLesson === undefined
        ? 'video-call'
        : null
  const stepCount =
    lessonId === null
      ? 0
      : lessonId === 'video-call'
        ? lessonSteps.ur.length
        : interactiveLessons.ur[lessonId].steps.length
  if (lessonId === null || !Number.isInteger(step) || step < 0 || step >= stepCount) {
    response.status(400).json({ error: 'Choose a valid Urdu lesson step.' })
    return
  }

  try {
    const audio = await getUrduSpeechAudio(step, undefined, lessonId)
    response
      .status(200)
      .set('Cache-Control', 'private, max-age=86400')
      .type('audio/mpeg')
      .send(audio)
  } catch (error) {
    console.error('Edge Urdu speech request failed:', error)
    response.status(502).json({
      error: 'Urdu voice playback could not be prepared. Please try again.',
    })
  }
})

app.post('/api/speech/assistant', createRateLimit(12, 60_000), async (request, response) => {
  const text: unknown = isRecord(request.body) ? request.body.text : undefined
  if (typeof text !== 'string' || !text.trim() || text.length > 600) {
    response.status(400).json({ error: 'Provide a reply of 600 characters or fewer.' })
    return
  }

  try {
    const audio = await getAssistantSpeechAudio(text.trim())
    response
      .status(200)
      .set('Cache-Control', 'no-store')
      .type('audio/mpeg')
      .send(audio)
  } catch (error) {
    console.error('Edge assistant speech request failed:', error)
    response.status(502).json({
      error: 'The spoken reply could not be prepared. Please read the message instead.',
    })
  }
})

app.get('/api/progress', (_request, response) => {
  response.json(database.getState())
})

app.put('/api/progress', async (request, response) => {
  const state = normalizeLearnerState(request.body)
  if (!state) {
    response.status(400).json({
      error: 'Progress must include a supported language, lesson step, rating, and accessibility settings.',
    })
    return
  }

  response.json(await database.saveState(state))
})

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof SyntaxError) {
    response.status(400).json({ error: 'The request could not be read. Please try again.' })
    return
  }

  console.error('Saathi API request failed:', error)
  response.status(500).json({ error: 'The progress service could not complete that request.' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Saathi API listening on port ${port}`)
})
