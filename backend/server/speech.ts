import { EdgeTTS } from 'node-edge-tts'
import { interactiveLessons } from '../../shared/interactive-lessons.js'
import { lessonSteps } from '../../shared/lesson-steps.js'
import type { InteractiveLessonId } from '../../shared/learner-state.js'

const voiceName = 'ur-IN-GulNeural'
const audioCache = new Map<string, Buffer>()
const pendingAudio = new Map<string, Promise<Buffer>>()
type LessonId = InteractiveLessonId | 'video-call'

type EdgeSpeechClient = Pick<EdgeTTS, 'streamAudio'>
type EdgeSpeechFactory = () => EdgeSpeechClient

function createEdgeSpeechClient(): EdgeSpeechClient {
  return new EdgeTTS({
    voice: voiceName,
    lang: 'ur-IN',
    outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
    timeout: 20000,
  })
}

async function requestUrduSpeech(
  step: number,
  createClient: EdgeSpeechFactory,
  lessonId: LessonId,
): Promise<Buffer> {
  const steps =
    lessonId === 'video-call'
      ? lessonSteps.ur
      : interactiveLessons.ur[lessonId].steps
  if (!Number.isInteger(step) || step < 0 || step >= steps.length) {
    throw new RangeError('The requested Urdu lesson step does not exist.')
  }

  const client = createClient()
  const chunks: Buffer[] = []
  for await (const chunk of client.streamAudio(steps[step].instruction)) {
    if (!Buffer.isBuffer(chunk)) {
      throw new Error('Edge TTS returned unexpected subtitle metadata.')
    }
    chunks.push(chunk)
  }

  const audio = Buffer.concat(chunks)
  if (audio.length === 0) throw new Error('Edge TTS returned an empty audio clip.')
  return audio
}

export function getUrduSpeechAudio(
  step: number,
  createClient: EdgeSpeechFactory = createEdgeSpeechClient,
  lessonId: LessonId = 'video-call',
): Promise<Buffer> {
  const steps =
    lessonId === 'video-call'
      ? lessonSteps.ur
      : interactiveLessons.ur[lessonId].steps
  if (!Number.isInteger(step) || step < 0 || step >= steps.length) {
    return Promise.reject(new RangeError('The requested Urdu lesson step does not exist.'))
  }

  const cacheKey = `${lessonId}:${step}`
  const cached = audioCache.get(cacheKey)
  if (cached) return Promise.resolve(cached)

  const pending = pendingAudio.get(cacheKey)
  if (pending) return pending

  const request = requestUrduSpeech(step, createClient, lessonId)
  pendingAudio.set(cacheKey, request)
  return request.then(
    (audio) => {
      audioCache.set(cacheKey, audio)
      pendingAudio.delete(cacheKey)
      return audio
    },
    (error: unknown) => {
      pendingAudio.delete(cacheKey)
      throw error
    },
  )
}

export async function getAssistantSpeechAudio(text: string): Promise<Buffer> {
  const client = new EdgeTTS({
    voice: voiceName,
    lang: 'ur-IN',
    outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
    timeout: 20000,
  })
  const chunks: Buffer[] = []
  for await (const chunk of client.streamAudio(text)) {
    if (!Buffer.isBuffer(chunk)) {
      throw new Error('Edge TTS returned unexpected subtitle metadata.')
    }
    chunks.push(chunk)
  }

  const audio = Buffer.concat(chunks)
  if (audio.length === 0) throw new Error('Edge TTS returned an empty audio clip.')
  return audio
}
