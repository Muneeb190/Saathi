import { useCallback, useEffect, useRef, useState } from 'react'
import type { Language } from '../shared/learner-state'
import { fetchUrduSpeechAvailability } from './api'
import { findSpeechVoice } from './speech'

interface PlaybackState {
  language: Language
  speaking: boolean
  paused: boolean
  loading: boolean
  failed: boolean
}

type UrduServiceStatus = 'loading' | 'available' | 'missing' | 'error'

export function useSpeech(language: Language) {
  const synthesis =
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis
      : null
  const supported = language === 'ur' || synthesis !== null
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() =>
    synthesis?.getVoices() ?? [],
  )
  const [playback, setPlayback] = useState<PlaybackState>({
    language,
    speaking: false,
    paused: false,
    loading: false,
    failed: false,
  })
  const [urduService, setUrduService] = useState<{
    language: Language
    status: UrduServiceStatus
  }>({ language, status: language === 'ur' ? 'loading' : 'available' })
  const activeUtterance = useRef<SpeechSynthesisUtterance | null>(null)
  const activeAudio = useRef<HTMLAudioElement | null>(null)
  const voice = language === 'en' ? findSpeechVoice(voices, language) : undefined
  const currentPlayback =
    playback.language === language
      ? playback
      : { language, speaking: false, paused: false, loading: false, failed: false }
  const urduServiceStatus =
    language === 'ur'
      ? urduService.language === 'ur'
        ? urduService.status
        : 'loading'
      : 'available'
  const voiceAvailable =
    language === 'ur' ? urduServiceStatus === 'available' : voice !== undefined

  useEffect(() => {
    if (!synthesis) return

    const refreshVoices = () => setVoices(synthesis.getVoices())
    synthesis.addEventListener('voiceschanged', refreshVoices)
    refreshVoices()
    return () => synthesis.removeEventListener('voiceschanged', refreshVoices)
  }, [synthesis])

  useEffect(() => {
    if (language !== 'ur') return

    let active = true
    void fetchUrduSpeechAvailability().then(
      (available) => {
        if (active) {
          setUrduService({ language, status: available ? 'available' : 'missing' })
        }
      },
      () => {
        if (active) setUrduService({ language, status: 'error' })
      },
    )
    return () => {
      active = false
    }
  }, [language])

  useEffect(
    () => () => {
      activeUtterance.current = null
      synthesis?.cancel()
      activeAudio.current?.pause()
      activeAudio.current = null
    },
    [language, synthesis],
  )

  const speak = useCallback(
    (text: string, lessonStep?: number) => {
      activeUtterance.current = null
      synthesis?.cancel()
      activeAudio.current?.pause()
      activeAudio.current = null

      if (language === 'ur') {
        if (urduServiceStatus !== 'available' || lessonStep === undefined) return

        setPlayback({ language, speaking: false, paused: false, loading: true, failed: false })
        const audio = new Audio(`/api/speech/ur/${lessonStep}`)
        activeAudio.current = audio
        audio.preload = 'auto'
        audio.onplaying = () => {
          if (activeAudio.current !== audio) return
          setPlayback({ language, speaking: true, paused: false, loading: false, failed: false })
        }
        audio.onpause = () => {
          if (activeAudio.current !== audio) return
          setPlayback({
            language,
            speaking: false,
            paused: !audio.ended,
            loading: false,
            failed: false,
          })
        }
        audio.onended = () => {
          if (activeAudio.current !== audio) return
          activeAudio.current = null
          setPlayback({ language, speaking: false, paused: false, loading: false, failed: false })
        }
        audio.onerror = () => {
          if (activeAudio.current !== audio) return
          activeAudio.current = null
          setPlayback({ language, speaking: false, paused: false, loading: false, failed: true })
        }
        void audio.play().catch(() => {
          if (activeAudio.current !== audio) return
          activeAudio.current = null
          setPlayback({ language, speaking: false, paused: false, loading: false, failed: true })
        })
        return
      }

      if (!synthesis || !voice) return

      setPlayback({ language, speaking: false, paused: false, loading: false, failed: false })
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = voice
      utterance.lang = voice.lang
      utterance.rate = 0.86
      activeUtterance.current = utterance
      utterance.onstart = () => {
        if (activeUtterance.current === utterance) {
          setPlayback({ language, speaking: true, paused: false, loading: false, failed: false })
        }
      }
      utterance.onend = () => {
        if (activeUtterance.current !== utterance) return
        activeUtterance.current = null
        setPlayback({ language, speaking: false, paused: false, loading: false, failed: false })
      }
      utterance.onerror = () => {
        if (activeUtterance.current !== utterance) return
        activeUtterance.current = null
        setPlayback({ language, speaking: false, paused: false, loading: false, failed: true })
      }
      try {
        synthesis.speak(utterance)
      } catch {
        activeUtterance.current = null
        setPlayback({ language, speaking: false, paused: false, loading: false, failed: true })
      }
    },
    [language, synthesis, urduServiceStatus, voice],
  )

  const pauseOrResume = useCallback(() => {
    if (language === 'ur') {
      const audio = activeAudio.current
      if (!audio) return
      if (currentPlayback.paused) {
        void audio.play().catch(() => {
          activeAudio.current = null
          setPlayback({ language, speaking: false, paused: false, loading: false, failed: true })
        })
      } else {
        audio.pause()
      }
      return
    }

    if (!synthesis) return
    if (synthesis.paused) {
      synthesis.resume()
      setPlayback({ language, speaking: true, paused: false, loading: false, failed: false })
    } else {
      synthesis.pause()
      setPlayback({ language, speaking: true, paused: true, loading: false, failed: false })
    }
  }, [currentPlayback.paused, language, synthesis])

  const stop = useCallback(() => {
    activeUtterance.current = null
    synthesis?.cancel()
    if (activeAudio.current) {
      activeAudio.current.pause()
      activeAudio.current.currentTime = 0
      activeAudio.current = null
    }
    setPlayback({ language, speaking: false, paused: false, loading: false, failed: false })
  }, [language, synthesis])

  return {
    supported,
    voiceAvailable,
    urduServiceStatus,
    speaking: currentPlayback.speaking,
    paused: currentPlayback.paused,
    loading: currentPlayback.loading,
    failed: currentPlayback.failed,
    speak,
    pauseOrResume,
    stop,
  }
}
