import { EdgeTTS } from 'node-edge-tts'
import { lessonSteps } from '../shared/lesson-steps.js'

const voiceName = 'ur-IN-GulNeural'
const audioCache = new Map<number, Buffer>()
const pendingAudio = new Map<number, Promise<Buffer>>()

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
): Promise<Buffer> {
  if (!Number.isInteger(step) || step < 0 || step >= lessonSteps.ur.length) {
    throw new RangeError('The requested Urdu lesson step does not exist.')
  }

  const client = createClient()
  const chunks: Buffer[] = []
  for await (const chunk of client.streamAudio(lessonSteps.ur[step].instruction)) {
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
): Promise<Buffer> {
  if (!Number.isInteger(step) || step < 0 || step >= lessonSteps.ur.length) {
    return Promise.reject(new RangeError('The requested Urdu lesson step does not exist.'))
  }

  const cached = audioCache.get(step)
  if (cached) return Promise.resolve(cached)

  const pending = pendingAudio.get(step)
  if (pending) return pending

  const request = requestUrduSpeech(step, createClient)
  pendingAudio.set(step, request)
  return request.then(
    (audio) => {
      audioCache.set(step, audio)
      pendingAudio.delete(step)
      return audio
    },
    (error: unknown) => {
      pendingAudio.delete(step)
      throw error
    },
  )
}
