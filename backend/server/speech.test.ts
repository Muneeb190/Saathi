import assert from 'node:assert/strict'
import test from 'node:test'
import { lessonSteps } from '../shared/lesson-steps.js'
import { interactiveLessonIds, interactiveLessons } from '../shared/interactive-lessons.js'
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

test('uses the selected lesson instruction for Urdu speech', async () => {
  for (const lessonId of interactiveLessonIds) {
    const lesson = interactiveLessons.ur[lessonId]
    const speechTexts: string[] = []
    await Promise.all(
      lesson.steps.map((_, step) =>
        getUrduSpeechAudio(
          step,
          () => ({
            async *streamAudio(text) {
              speechTexts.push(text)
              yield Buffer.from([step + 1])
            },
          }),
          lessonId,
        ),
      ),
    )
    assert.deepEqual(
      speechTexts,
      lesson.steps.map(({ instruction }) => instruction),
    )
  }
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

  await assert.rejects(
    getUrduSpeechAudio(
      interactiveLessons.ur['scam-detective'].steps.length,
      () => {
        connected = true
        throw new Error('Should not connect')
      },
      'scam-detective',
    ),
    /lesson step does not exist/,
  )
  assert.equal(connected, false)
})
