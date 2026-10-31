import { lessonSteps } from '../shared/lesson-steps.js'

export interface AzureSpeechConfig {
  key: string
  region: string
}

const audioCache = new Map<number, Buffer>()
const pendingAudio = new Map<number, Promise<Buffer>>()

export function getAzureSpeechConfig(
  environment: Record<string, string | undefined> = process.env,
): AzureSpeechConfig | null {
  const key = environment.AZURE_SPEECH_KEY?.trim()
  const region = environment.AZURE_SPEECH_REGION?.trim().toLowerCase()
  if (!key || !region) return null
  if (!/^[a-z0-9-]+$/.test(region)) {
    throw new Error('AZURE_SPEECH_REGION must contain only letters, numbers, and hyphens.')
  }
  return { key, region }
}

export function buildUrduSpeechSsml(text: string): string {
  const escapedText = text.replace(/[<>&"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
    }
    return entities[character]
  })

  return `<speak version="1.0" xml:lang="ur-IN"><voice name="ur-IN-GulNeural">${escapedText}</voice></speak>`
}

async function requestUrduSpeech(
  step: number,
  config: AzureSpeechConfig,
  fetcher: typeof fetch,
): Promise<Buffer> {
  if (!Number.isInteger(step) || step < 0 || step >= lessonSteps.ur.length) {
    throw new RangeError('The requested Urdu lesson step does not exist.')
  }

  const response = await fetcher(
    `https://${config.region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ssml+xml',
        'Ocp-Apim-Subscription-Key': config.key,
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      },
      body: buildUrduSpeechSsml(lessonSteps.ur[step].instruction),
      signal: AbortSignal.timeout(15000),
    },
  )

  if (!response.ok) {
    throw new Error(`Azure Speech returned HTTP ${response.status}.`)
  }

  if (!response.headers.get('content-type')?.toLowerCase().includes('audio')) {
    throw new Error('Azure Speech returned a response that was not audio.')
  }

  const audio = Buffer.from(await response.arrayBuffer())
  if (audio.length === 0) throw new Error('Azure Speech returned an empty audio clip.')
  return audio
}

export function getUrduSpeechAudio(
  step: number,
  config: AzureSpeechConfig,
  fetcher: typeof fetch = fetch,
): Promise<Buffer> {
  const cached = audioCache.get(step)
  if (cached) return Promise.resolve(cached)

  const pending = pendingAudio.get(step)
  if (pending) return pending

  const request = requestUrduSpeech(step, config, fetcher)
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
