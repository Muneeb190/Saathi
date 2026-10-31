import assert from 'node:assert/strict'
import test from 'node:test'
import { lessonSteps } from '../shared/lesson-steps.js'
import { getUrduSpeechAudio } from './speech.js'

test('requests and returns audio for every fixed Urdu lesson step', async () => {
  const requestTexts: string[] = []

  const audioClips = await Promise.all(
    lessonSteps.ur.map((_, step) =>
      getUrduSpeechAudio(step, () => ({
        async *streamAudio(text) {
          requestTexts.push(text)
          yield Buffer.from([1, 2, 3])
        },
      })),
    ),
  )

  assert.deepEqual(
    requestTexts,
    lessonSteps.ur.map(({ instruction }) => instruction),
  )
  for (const audio of audioClips) assert.deepEqual(audio, Buffer.from([1, 2, 3]))
})

test('rejects invalid lesson indices before connecting to Edge TTS', async () => {
  let connected = false

  await assert.rejects(
    getUrduSpeechAudio(6, () => {
      connected = true
      throw new Error('Should not connect')
    }),
    /lesson step does not exist/,
  )
  assert.equal(connected, false)
})
