import assert from 'node:assert/strict'
import test from 'node:test'
import { lessonSteps } from '../shared/lesson-steps.js'
import {
  buildUrduSpeechSsml,
  getAzureSpeechConfig,
  getUrduSpeechAudio,
} from './speech.js'

test('requires a server-side Azure key and region', () => {
  assert.equal(getAzureSpeechConfig({}), null)
  assert.deepEqual(
    getAzureSpeechConfig({
      AZURE_SPEECH_KEY: 'test-key',
      AZURE_SPEECH_REGION: 'CentralIndia',
    }),
    { key: 'test-key', region: 'centralindia' },
  )
})

test('rejects malformed Azure regions rather than building an unsafe host', () => {
  assert.throws(
    () =>
      getAzureSpeechConfig({
        AZURE_SPEECH_KEY: 'test-key',
        AZURE_SPEECH_REGION: 'centralindia.example.com',
      }),
    /AZURE_SPEECH_REGION/,
  )
})

test('escapes text in Urdu SSML and selects the Urdu neural voice', () => {
  assert.equal(
    buildUrduSpeechSsml('امی & <ویڈیو>'),
    '<speak version="1.0" xml:lang="ur-IN"><voice name="ur-IN-GulNeural">امی &amp; &lt;ویڈیو&gt;</voice></speak>',
  )
})

test('requests and returns audio for every fixed Urdu lesson step', async () => {
  let requestUrl = ''
  let requestHeaders: Headers | undefined
  const requestBodies: string[] = []
  const fetcher: typeof fetch = async (input, init) => {
    requestUrl = String(input)
    requestHeaders = new Headers(init?.headers)
    requestBodies.push(String(init?.body ?? ''))
    return new Response(new Uint8Array([1, 2, 3]), {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
    })
  }

  const config = { key: 'test-key', region: 'centralindia' }
  const audioClips = await Promise.all(
    lessonSteps.ur.map((_, step) => getUrduSpeechAudio(step, config, fetcher)),
  )

  assert.equal(
    requestUrl,
    'https://centralindia.tts.speech.microsoft.com/cognitiveservices/v1',
  )
  assert.equal(requestHeaders?.get('Ocp-Apim-Subscription-Key'), 'test-key')
  assert.equal(requestHeaders?.get('X-Microsoft-OutputFormat'), 'audio-24khz-48kbitrate-mono-mp3')
  assert.deepEqual(
    requestBodies,
    lessonSteps.ur.map(({ instruction }) => buildUrduSpeechSsml(instruction)),
  )
  for (const audio of audioClips) assert.deepEqual(audio, Buffer.from([1, 2, 3]))
})

test('rejects invalid lesson indices before contacting Azure', async () => {
  let called = false
  const fetcher: typeof fetch = async () => {
    called = true
    return new Response(new Uint8Array([1]), {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
    })
  }

  await assert.rejects(
    getUrduSpeechAudio(6, { key: 'test-key', region: 'centralindia' }, fetcher),
    /lesson step does not exist/,
  )
  assert.equal(called, false)
})
