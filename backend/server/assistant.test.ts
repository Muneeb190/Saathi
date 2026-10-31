import assert from 'node:assert/strict'
import test from 'node:test'
import type { AssistantRequest } from '../../shared/assistant.js'
import { lessonSteps } from '../../shared/lesson-steps.js'
import {
  getAssistantReply,
  getGroqConfig,
  isAssistantRequest,
} from './assistant.js'

const request: AssistantRequest = {
  message: 'What should I do now?',
  language: 'en',
  route: '/practice/video-call',
  lessonStep: 2,
  history: [{ role: 'user', content: 'I am learning to call Ammi.' }],
}

test('requires a server-side Groq key and defaults to a production model', () => {
  assert.equal(getGroqConfig({}), null)
  assert.deepEqual(getGroqConfig({ GROQ_API_KEY: ' test-key ' }), {
    apiKey: 'test-key',
    model: 'openai/gpt-oss-20b',
  })
  assert.deepEqual(
    getGroqConfig({ GROQ_API_KEY: 'test-key', GROQ_MODEL: 'custom/model-1' }),
    { apiKey: 'test-key', model: 'custom/model-1' },
  )
})

test('validates current app context and bounds user history', () => {
  assert.equal(isAssistantRequest(request), true)
  assert.equal(isAssistantRequest({ ...request, route: '/admin' }), false)
  assert.equal(isAssistantRequest({ ...request, lessonStep: 7 }), false)
  assert.equal(isAssistantRequest({ ...request, message: ' ' }), false)
  assert.equal(isAssistantRequest({ ...request, history: Array(9).fill(request.history[0]) }), false)
})

test('sends bounded conversation and current lesson context to Groq', async () => {
  let requestUrl = ''
  let requestHeaders: Headers | undefined
  let requestBody: Record<string, unknown> | undefined
  const fetcher: typeof fetch = async (input, init) => {
    requestUrl = String(input)
    requestHeaders = new Headers(init?.headers)
    requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>
    return Response.json({
      choices: [{ message: { content: 'Tap the video-call button.' } }],
    })
  }

  const reply = await getAssistantReply(
    request,
    { GROQ_API_KEY: 'secret-test-key' },
    fetcher,
  )

  assert.equal(requestUrl, 'https://api.groq.com/openai/v1/chat/completions')
  assert.equal(requestHeaders?.get('authorization'), 'Bearer secret-test-key')
  assert.equal(requestBody?.model, 'openai/gpt-oss-20b')
  assert.equal(requestBody?.max_completion_tokens, 300)
  assert.equal(reply, 'Tap the video-call button.')

  const messages = requestBody?.messages as Array<{ role: string; content: string }>
  assert.match(messages[0].content, /safe simulated video-call practice/)
  assert.match(messages[0].content, new RegExp(lessonSteps.en[2].instruction))
  assert.equal(messages[1].content, request.history[0].content)
  assert.equal(messages[2].content, request.message)
})

test('gives exact home-page navigation and simulation context to Groq', async () => {
  let systemPrompt = ''
  const fetcher: typeof fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body)) as {
      messages: Array<{ role: string; content: string }>
    }
    systemPrompt = body.messages[0].content
    return Response.json({ choices: [{ message: { content: 'Choose Try a practice lesson.' } }] })
  }

  await getAssistantReply(
    { ...request, route: '/', message: 'How do I start the lesson?' },
    { GROQ_API_KEY: 'test-key' },
    fetcher,
  )

  assert.match(systemPrompt, /“Get started” opens My learning/)
  assert.match(systemPrompt, /“Try a practice lesson” opens the video-call lesson/)
  assert.match(systemPrompt, /“Scam Detective” and “Pay Your Utility Bill Safely”/)
  assert.match(systemPrompt, /never tell the learner Saathi can make a real call/i)
  assert.match(systemPrompt, /No lesson-specific step is active/)
})

test('gives scam and utility-bill safety context for the active lesson', async () => {
  const prompts: string[] = []
  const fetcher: typeof fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body)) as {
      messages: Array<{ role: string; content: string }>
    }
    prompts.push(body.messages[0].content)
    return Response.json({ choices: [{ message: { content: 'Pause and check safely.' } }] })
  }

  assert.equal(isAssistantRequest({
    ...request,
    route: '/practice/scam-detective',
    lessonStep: 2,
  }), true)
  assert.equal(isAssistantRequest({
    ...request,
    route: '/practice/scam-detective',
    lessonStep: 6,
  }), false)
  await getAssistantReply(
    { ...request, route: '/practice/scam-detective', lessonStep: 2 },
    { GROQ_API_KEY: 'test-key' },
    fetcher,
  )
  await getAssistantReply(
    { ...request, route: '/practice/utility-bill', lessonStep: 4 },
    { GROQ_API_KEY: 'test-key' },
    fetcher,
  )

  assert.match(prompts[0], /never sharing OTPs or passwords/)
  assert.match(prompts[0], /Current lesson step: 3 of 5/)
  assert.match(prompts[1], /all displayed bill details are fictional/)
  assert.match(prompts[1], /never ask the learner to enter financial information/i)
  assert.match(prompts[1], /Current lesson step: 5 of 6/)
})

test('uses the selected language and step when composing Urdu context', async () => {
  let systemPrompt = ''
  const fetcher: typeof fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body)) as {
      messages: Array<{ role: string; content: string }>
    }
    systemPrompt = body.messages[0].content
    return Response.json({ choices: [{ message: { content: 'اچھا، آگے بڑھیں۔' } }] })
  }

  const reply = await getAssistantReply(
    { ...request, language: 'ur', lessonStep: 0 },
    { GROQ_API_KEY: 'test-key' },
    fetcher,
  )

  assert.equal(reply, 'اچھا، آگے بڑھیں۔')
  assert.match(systemPrompt, /Reply in Urdu/)
  assert.match(systemPrompt, new RegExp(lessonSteps.ur[0].instruction))
})

test('reports rate limits and missing credentials as explicit service errors', async () => {
  await assert.rejects(getAssistantReply(request, {}), /not configured/)
  await assert.rejects(
    getAssistantReply(
      request,
      { GROQ_API_KEY: 'test-key' },
      async () => new Response(null, { status: 429 }),
    ),
    /could not complete the request/,
  )
})
