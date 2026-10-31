import {
  Bot,
  LoaderCircle,
  MessageCircle,
  Mic,
  Send,
  Square,
  Volume2,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { useLocation } from 'react-router-dom'
import type {
  AppRoute,
  AssistantHistoryMessage,
} from '../shared/assistant'
import {
  getInteractiveLessonProgress,
  type InteractiveLessonId,
  type Language,
} from '../shared/learner-state'
import {
  AssistantApiError,
  fetchAssistantAvailability,
  fetchAssistantSpeech,
  sendAssistantMessage,
} from './api'
import { useLearner } from './learner-context'
import { findSpeechVoice } from './speech'

interface ChatMessage extends AssistantHistoryMessage {
  id: number
}

interface SpeechRecognitionResultLike {
  readonly 0?: { readonly transcript: string }
}

interface SpeechRecognitionResultsLike {
  readonly length: number
  readonly [index: number]: SpeechRecognitionResultLike
}

interface SpeechRecognitionEventLike {
  readonly results: SpeechRecognitionResultsLike
}

interface SpeechRecognitionErrorLike {
  readonly error: string
}

interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

const copy = {
  en: {
    open: 'Ask Saathi',
    close: 'Close assistant',
    title: 'Ask Saathi',
    subtitle: 'A little help, right where you are.',
    welcome:
      'Hello! I can guide you through Saathi’s lessons and help with the step you are practising. What would you like to know?',
    currentPage: 'What can I do here?',
    currentStep: 'Help me with this step',
    placeholder: 'Type a question…',
    send: 'Send message',
    startListening: 'Speak your question',
    stopListening: 'Stop listening',
    listening: 'Listening… say your question.',
    voiceInputNote:
      'When you tap the microphone, your browser may send audio to its speech service. Review the transcript before sending.',
    privacy:
      'Your question, recent chat, language, and current page/step go to Groq. When you choose Read aloud, that reply also goes to Microsoft Edge. Do not share passwords or private details. Saathi does not save this chat.',
    loading: 'Saathi is thinking…',
    setup:
      'The Groq assistant is not set up yet. Add GROQ_API_KEY to the server environment and restart the app.',
    offline: 'I could not connect to the assistant. Check your internet connection and try again.',
    rateLimited: 'Too many questions just now. Please wait a moment and try again.',
    failed: 'I could not get a reply this time. Please try again.',
    speechFailed: 'I could not play that reply. You can read it on screen.',
    microphoneUnsupported: 'Voice input is not supported in this browser. You can type instead.',
    microphoneFailed: 'I could not hear that. Check microphone permission or type your question.',
    readReply: 'Read reply aloud',
    stopReply: 'Stop spoken reply',
    suggestions: 'Try asking',
    limit: '1000 characters maximum',
  },
  ur: {
    open: 'ساتھی سے پوچھیں',
    close: 'مدد بند کریں',
    title: 'ساتھی سے پوچھیں',
    subtitle: 'آپ جہاں ہیں، وہیں تھوڑی سی مدد۔',
    welcome:
      'السلام علیکم! میں ساتھی کے اسباق اور موجودہ مشق کے قدم میں آپ کی رہنمائی کر سکتا ہوں۔ آپ کیا جاننا چاہتے ہیں؟',
    currentPage: 'میں یہاں کیا کر سکتا ہوں؟',
    currentStep: 'اس قدم میں میری مدد کریں',
    placeholder: 'اپنا سوال لکھیں…',
    send: 'پیغام بھیجیں',
    startListening: 'اپنا سوال بولیں',
    stopListening: 'سننا بند کریں',
    listening: 'سن رہا ہوں… اپنا سوال بولیں۔',
    voiceInputNote:
      'مائیک دبانے پر براؤزر آواز کو اپنی سروس میں بھیج سکتا ہے۔ بھیجنے سے پہلے لکھی ہوئی بات دیکھ لیں۔',
    privacy:
      'آپ کا سوال، حالیہ گفتگو، زبان اور موجودہ صفحہ یا قدم جواب کے لیے Groq کو بھیجا جاتا ہے۔ جواب سننے پر وہ متن Microsoft Edge کو بھی بھیجا جاتا ہے۔ پاس ورڈ یا نجی معلومات نہ دیں۔ ساتھی گفتگو محفوظ نہیں کرتا۔',
    loading: 'ساتھی جواب تیار کر رہا ہے…',
    setup:
      'Groq مدد ابھی ترتیب نہیں دی گئی۔ سرور کے ماحول میں GROQ_API_KEY شامل کر کے ایپ دوبارہ چلائیں۔',
    offline: 'مدد سے رابطہ نہیں ہو سکا۔ انٹرنیٹ دیکھیں اور دوبارہ کوشش کریں۔',
    rateLimited: 'ابھی بہت سے سوالات ہو گئے ہیں۔ تھوڑی دیر بعد دوبارہ کوشش کریں۔',
    failed: 'اس بار جواب نہیں مل سکا۔ دوبارہ کوشش کریں۔',
    speechUnsupported: 'اس براؤزر میں جواب سنانے کی سہولت دستیاب نہیں۔',
    speechFailed: 'جواب سنایا نہیں جا سکا۔ آپ اسے اسکرین پر پڑھ سکتے ہیں۔',
    microphoneUnsupported: 'اس براؤزر میں آواز سے سوال ممکن نہیں۔ آپ لکھ کر پوچھ سکتے ہیں۔',
    microphoneFailed: 'آواز سمجھ نہیں آئی۔ مائیک کی اجازت دیکھیں یا سوال لکھیں۔',
    readReply: 'جواب سنیں',
    stopReply: 'جواب سننا بند کریں',
    suggestions: 'یہ سوال پوچھیں',
    limit: 'زیادہ سے زیادہ ۱۰۰۰ حروف',
  },
} satisfies Record<Language, Record<string, string>>

function getAppRoute(pathname: string): AppRoute {
  switch (pathname) {
    case '/dashboard':
    case '/lesson/video-call':
    case '/practice/video-call':
    case '/complete/video-call':
    case '/lesson/scam-detective':
    case '/practice/scam-detective':
    case '/complete/scam-detective':
    case '/lesson/utility-bill':
    case '/practice/utility-bill':
    case '/complete/utility-bill':
      return pathname
    default:
      return '/'
  }
}

export function AssistantWidget() {
  const { state } = useLearner()
  const { pathname } = useLocation()
  const language = state.language
  const text = copy[language]
  const [isOpen, setIsOpen] = useState(false)
  const [serviceStatus, setServiceStatus] = useState<'loading' | 'ready' | 'missing' | 'offline'>('loading')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<
    'offline' | 'rateLimited' | 'failed' | 'speech' | 'microphone' | null
  >(null)
  const [speakingMessage, setSpeakingMessage] = useState<number | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const messageListRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const speechRequestId = useRef(0)
  const nextMessageId = useRef(0)
  const route = getAppRoute(pathname)
  const interactiveLessonId: InteractiveLessonId | null =
    route.endsWith('scam-detective')
      ? 'scam-detective'
      : route.endsWith('utility-bill')
        ? 'utility-bill'
        : null
  const lessonStep = interactiveLessonId
    ? getInteractiveLessonProgress(state, interactiveLessonId).step
    : state.lessonStep
  const SpeechRecognition =
    typeof window === 'undefined'
      ? undefined
      : window.SpeechRecognition ?? window.webkitSpeechRecognition
  const canListen = SpeechRecognition !== undefined

  const stopSpokenReply = useCallback(() => {
    speechRequestId.current += 1
    audioRef.current?.pause()
    audioRef.current = null
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
    utteranceRef.current = null
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeakingMessage(null)
  }, [])

  const closeAssistant = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
    stopSpokenReply()
    setIsOpen(false)
    window.requestAnimationFrame(() => launcherRef.current?.focus())
  }, [stopSpokenReply])

  useEffect(() => {
    let active = true
    void fetchAssistantAvailability().then(
      (available) => {
        if (active) setServiceStatus(available ? 'ready' : 'missing')
      },
      () => {
        if (active) setServiceStatus('offline')
      },
    )
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [isSending, messages])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeAssistant()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeAssistant, isOpen])

  useEffect(
    () => () => {
      recognitionRef.current?.stop()
      audioRef.current?.pause()
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    },
    [],
  )

  async function speakReply(message: ChatMessage) {
    stopSpokenReply()
    const requestId = speechRequestId.current
    setError(null)
    if (language === 'ur') {
      try {
        const audioBlob = await fetchAssistantSpeech(message.content)
        const url = URL.createObjectURL(audioBlob)
        if (requestId !== speechRequestId.current) {
          URL.revokeObjectURL(url)
          return
        }
        const audio = new Audio(url)
        audioRef.current = audio
        audioUrlRef.current = url
        audio.onended = stopSpokenReply
        audio.onerror = () => {
          stopSpokenReply()
          setError('speech')
        }
        await audio.play()
        setSpeakingMessage(message.id)
      } catch {
        stopSpokenReply()
        setError('speech')
      }
      return
    }

    if (!('speechSynthesis' in window)) {
      setError('speech')
      return
    }
    const utterance = new SpeechSynthesisUtterance(message.content)
    const englishVoice = findSpeechVoice(window.speechSynthesis.getVoices(), 'en')
    if (englishVoice) utterance.voice = englishVoice
    utterance.lang = englishVoice?.lang ?? 'en-US'
    utterance.rate = 0.9
    utterance.onend = () => {
      if (utteranceRef.current !== utterance) return
      utteranceRef.current = null
      setSpeakingMessage(null)
    }
    utterance.onerror = () => {
      if (utteranceRef.current !== utterance) return
      utteranceRef.current = null
      setSpeakingMessage(null)
      setError('speech')
    }
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setSpeakingMessage(message.id)
  }

  function toggleListening() {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    if (!SpeechRecognition) return

    setError(null)
    const recognition = new SpeechRecognition()
    recognition.lang = language === 'ur' ? 'ur-PK' : 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript
      if (transcript) setDraft((current) => `${current}${current ? ' ' : ''}${transcript}`)
    }
    recognition.onerror = () => {
      setError('microphone')
      setIsListening(false)
    }
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    try {
      recognition.start()
      setIsListening(true)
    } catch {
      setError('offline')
      setIsListening(false)
    }
  }

  async function submitMessage(eventOrText: FormEvent<HTMLFormElement> | string) {
    if (typeof eventOrText !== 'string') eventOrText.preventDefault()
    const message = (typeof eventOrText === 'string' ? eventOrText : draft).trim()
    if (!message || isSending || serviceStatus !== 'ready') return

    recognitionRef.current?.stop()
    setIsListening(false)
    const userMessage: ChatMessage = {
      id: nextMessageId.current++,
      role: 'user',
      content: message.slice(0, 1000),
    }
    const history = messages.slice(-8).map(({ role, content }) => ({ role, content }))
    setMessages((current) => [...current, userMessage])
    setDraft('')
    setError(null)
    setIsSending(true)

    try {
      const reply = await sendAssistantMessage({
        message: userMessage.content,
        language,
        route,
        lessonStep,
        history,
      })
      setMessages((current) => [
        ...current,
        { id: nextMessageId.current++, role: 'assistant', content: reply },
      ])
    } catch (requestError) {
      setMessages((current) => current.filter(({ id }) => id !== userMessage.id))
      setDraft(userMessage.content)
      setError(requestError instanceof AssistantApiError && requestError.status === 429
        ? 'rateLimited'
        : requestError instanceof AssistantApiError && requestError.status === 502
          ? 'offline'
          : 'failed')
    } finally {
      setIsSending(false)
    }
  }

  function messageError(): string | null {
    if (error === 'rateLimited') return text.rateLimited
    if (error === 'offline') return text.offline
    if (error === 'speech') return text.speechFailed
    if (error === 'microphone') return text.microphoneFailed
    if (error === 'failed') return text.failed
    return null
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div
      className="assistant-widget"
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      lang={language}
    >
      {isOpen && (
        <section
          className="assistant-panel"
          id="assistant-panel"
          role="dialog"
          aria-labelledby="assistant-title"
          aria-describedby="assistant-description"
        >
          <header className="assistant-header">
            <span className="assistant-avatar" aria-hidden="true"><Bot size={23} /></span>
            <div className="assistant-heading">
              <h2 id="assistant-title">{text.title}</h2>
              <p id="assistant-description">{text.subtitle}</p>
            </div>
            <button
              className="assistant-icon-button"
              type="button"
              aria-label={text.close}
              onClick={closeAssistant}
            >
              <X size={21} aria-hidden="true" />
            </button>
          </header>

          <div
            className="assistant-messages"
            ref={messageListRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            <div className="assistant-welcome" dir="auto">{text.welcome}</div>
            {messages.map((message) => (
              <article
                className={`assistant-message assistant-message-${message.role}`}
                key={message.id}
              >
                <p dir="auto">{message.content}</p>
                {message.role === 'assistant' && (
                  <button
                    className="assistant-read-button"
                    type="button"
                    aria-label={speakingMessage === message.id ? text.stopReply : text.readReply}
                    onClick={() => {
                      if (speakingMessage === message.id) stopSpokenReply()
                      else void speakReply(message)
                    }}
                  >
                    {speakingMessage === message.id
                      ? <Square size={16} aria-hidden="true" />
                      : <Volume2 size={17} aria-hidden="true" />}
                    <span>
                      {speakingMessage === message.id ? text.stopReply : text.readReply}
                    </span>
                  </button>
                )}
              </article>
            ))}
            {isSending && (
              <div className="assistant-thinking" role="status">
                <LoaderCircle size={17} aria-hidden="true" />
                <span>{text.loading}</span>
              </div>
            )}
            <div />
          </div>

          {messages.length === 0 && serviceStatus === 'ready' && (
            <div className="assistant-suggestions">
              <span>{text.suggestions}</span>
              <button type="button" onClick={() => void submitMessage(text.currentPage)}>
                {text.currentPage}
              </button>
              <button type="button" onClick={() => void submitMessage(text.currentStep)}>
                {text.currentStep}
              </button>
            </div>
          )}

          {serviceStatus === 'loading' && (
            <p className="assistant-service-note" role="status">{text.loading}</p>
          )}
          {serviceStatus === 'missing' && (
            <p className="assistant-service-note" role="status">{text.setup}</p>
          )}
          {serviceStatus === 'offline' && (
            <p className="assistant-service-note" role="alert">{text.offline}</p>
          )}
          {isListening && <p className="assistant-listening" role="status">{text.listening}</p>}
          {messageError() && <p className="assistant-error" role="alert">{messageError()}</p>}

          <form className="assistant-composer" onSubmit={(event) => void submitMessage(event)}>
            <label className="sr-only" htmlFor="assistant-message">{text.placeholder}</label>
            <textarea
              id="assistant-message"
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value.slice(0, 1000))}
              onKeyDown={handleInputKeyDown}
              placeholder={text.placeholder}
              maxLength={1000}
              rows={2}
              dir="auto"
              disabled={serviceStatus !== 'ready' || isSending}
              aria-describedby="assistant-privacy"
            />
            <div className="assistant-composer-actions">
              <button
                className="assistant-icon-button assistant-mic-button"
                type="button"
                aria-label={isListening ? text.stopListening : text.startListening}
                title={!canListen ? text.microphoneUnsupported : undefined}
                onClick={toggleListening}
                disabled={!canListen || serviceStatus !== 'ready' || isSending}
              >
                {isListening ? <Square size={19} aria-hidden="true" /> : <Mic size={20} aria-hidden="true" />}
              </button>
              <span className="assistant-character-hint">{text.limit}</span>
              <button
                className="assistant-send-button"
                type="submit"
                aria-label={text.send}
                disabled={!draft.trim() || serviceStatus !== 'ready' || isSending}
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
          </form>

          <p className="assistant-privacy" id="assistant-privacy">{text.privacy}</p>
          {!canListen && <p className="assistant-privacy">{text.microphoneUnsupported}</p>}
          {canListen && <p className="assistant-privacy">{text.voiceInputNote}</p>}
        </section>
      )}

      <button
        className={`assistant-launcher${isOpen ? ' assistant-launcher-open' : ''}`}
        ref={launcherRef}
        type="button"
        aria-label={isOpen ? text.close : text.open}
        aria-controls="assistant-panel"
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) closeAssistant()
          else setIsOpen(true)
        }}
      >
        {isOpen ? <X size={22} aria-hidden="true" /> : <MessageCircle size={22} aria-hidden="true" />}
        <span>{isOpen ? text.close : text.open}</span>
      </button>
    </div>
  )
}
