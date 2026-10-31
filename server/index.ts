import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import express from 'express'
import { isLearnerState } from '../shared/learner-state.js'
import { createLearnerDatabase } from './database.js'
import { getAzureSpeechConfig, getUrduSpeechAudio } from './speech.js'

const database = await createLearnerDatabase()
const app = express()
const port = Number(process.env.PORT ?? 3001)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port number.')
}

app.use(express.json({ limit: '16kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/speech/status', (_request, response) => {
  response.json({ available: getAzureSpeechConfig() !== null })
})

app.get('/api/speech/ur/:step', async (request, response) => {
  const step = Number(request.params.step)
  if (!Number.isInteger(step) || step < 0 || step > 5) {
    response.status(400).json({ error: 'Choose a valid Urdu lesson step.' })
    return
  }

  const config = getAzureSpeechConfig()
  if (!config) {
    response.status(503).json({ error: 'Urdu voice service is not configured.' })
    return
  }

  try {
    const audio = await getUrduSpeechAudio(step, config)
    response
      .status(200)
      .set('Cache-Control', 'private, max-age=86400')
      .type('audio/mpeg')
      .send(audio)
  } catch (error) {
    console.error('Azure Urdu speech request failed:', error)
    response.status(502).json({
      error: 'Urdu voice playback could not be prepared. Please try again.',
    })
  }
})

app.get('/api/progress', (_request, response) => {
  response.json(database.getState())
})

app.put('/api/progress', async (request, response) => {
  const state: unknown = request.body
  if (!isLearnerState(state)) {
    response.status(400).json({
      error: 'Progress must include a supported language, lesson step, rating, and accessibility settings.',
    })
    return
  }

  response.json(await database.saveState(state))
})

const distributionPath = resolve('dist')
if (existsSync(distributionPath)) {
  app.use(express.static(distributionPath))
  app.use((request, response, next) => {
    if (request.method !== 'GET' || request.path.startsWith('/api/')) {
      next()
      return
    }

    response.sendFile(resolve(distributionPath, 'index.html'), (error) => {
      if (error) next(error)
    })
  })
}

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof SyntaxError) {
    response.status(400).json({ error: 'The request could not be read. Please try again.' })
    return
  }

  console.error('Saathi API request failed:', error)
  response.status(500).json({ error: 'The progress service could not complete that request.' })
})

app.listen(port, '127.0.0.1', () => {
  console.log(`Saathi API listening on http://127.0.0.1:${port}`)
})
