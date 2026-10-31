import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  HandHeart,
  Heart,
  Lightbulb,
  LockKeyhole,
  Pause,
  Play,
  RotateCcw,
  Share2,
  ShieldCheck,
  Smartphone,
  Star,
  StopCircle,
  Type,
  Volume2,
} from 'lucide-react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import {
  getInteractiveLessonProgress,
  type Language,
} from '../shared/learner-state'
import { interactiveLessonIds, interactiveLessons } from '../shared/interactive-lessons'
import { AssistantWidget } from './AssistantWidget'
import { getCopy, lessonSteps } from './content'
import {
  InteractiveLessonCards,
  InteractiveLessonCompletion,
  InteractiveLessonIntro,
  InteractiveLessonPractice,
} from './InteractiveLessons'
import { LearnerProvider } from './LearnerProvider'
import { useLearner } from './learner-context'
import { SimulationPhone } from './SimulationPhone'
import {
  transitionPractice,
  type PermissionStage,
  type PracticeAction,
} from './simulation'
import { useSpeech } from './useSpeech'

function AppLayout() {
  const learner = useLearner()
  const { state, loading } = learner
  const t = getCopy(state.language)

  useEffect(() => {
    document.documentElement.lang = state.language
    document.documentElement.dir = state.language === 'ur' ? 'rtl' : 'ltr'
  }, [state.language])

  if (loading) {
    return (
      <main className="loading-screen" aria-live="polite">
        <div className="loading-mark" aria-hidden="true">
          <HandHeart size={30} />
        </div>
        <p>{t.loading}</p>
      </main>
    )
  }

  return (
    <div
      className={`app-shell${state.accessibility.largeText ? ' large-text' : ''}${
        state.accessibility.reducedMotion ? ' reduce-motion' : ''
      }`}
    >
      <Header />
      {(learner.saveError || learner.loadError || learner.localStorageError) && (
        <div className="service-notice" role="alert">
          <p>
            {learner.saveError
              ? t.saveProblem
              : learner.loadError
                ? t.loadFailed
              : t.localStorageProblem}
          </p>
          {learner.saveError && (
            <button type="button" className="text-button" onClick={learner.retrySave}>
              {t.retrySave}
            </button>
          )}
          {learner.loadError && (
            <button type="button" className="text-button" onClick={learner.retryLoad}>
              {t.retrySave}
            </button>
          )}
        </div>
      )}
      <main id="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/lesson/video-call" element={<LessonPage />} />
          <Route path="/practice/video-call" element={<PracticePage />} />
          <Route path="/complete/video-call" element={<CompletionPage />} />
          <Route path="/lesson/scam-detective" element={<InteractiveLessonIntro lessonId="scam-detective" />} />
          <Route path="/practice/scam-detective" element={<InteractiveLessonPractice lessonId="scam-detective" />} />
          <Route path="/complete/scam-detective" element={<InteractiveLessonCompletion lessonId="scam-detective" />} />
          <Route path="/lesson/utility-bill" element={<InteractiveLessonIntro lessonId="utility-bill" />} />
          <Route path="/practice/utility-bill" element={<InteractiveLessonPractice lessonId="utility-bill" />} />
          <Route path="/complete/utility-bill" element={<InteractiveLessonCompletion lessonId="utility-bill" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <AssistantWidget />
    </div>
  )
}

function Header() {
  const { state, update } = useLearner()
  const t = getCopy(state.language)

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label={`${t.brand}, ${t.home}`}>
          <span className="brand-mark" aria-hidden="true">
            <HandHeart size={25} strokeWidth={2.2} />
          </span>
          <span>
            <strong>{t.brand}</strong>
            <small>{t.brandTagline}</small>
          </span>
        </Link>
        <nav className="header-actions" aria-label={t.navigation}>
          <Link className="nav-link" to="/">{t.home}</Link>
          <Link className="nav-link" to="/dashboard">{t.myLearning}</Link>
          <label className="language-control">
            <span className="sr-only">{t.language}</span>
            <select
              aria-label={t.language}
              value={state.language}
              onChange={(event) =>
                void update({ language: event.target.value === 'ur' ? 'ur' : 'en' })
              }
            >
              <option value="en">{t.english}</option>
              <option value="ur">{t.urdu}</option>
            </select>
          </label>
          <button
            className="accessibility-toggle"
            type="button"
            aria-pressed={state.accessibility.largeText}
            onClick={() =>
              void update({
                accessibility: {
                  ...state.accessibility,
                  largeText: !state.accessibility.largeText,
                },
              })
            }
          >
            <Type size={18} aria-hidden="true" />
            <span>{t.largerText}</span>
          </button>
          <button
            className="accessibility-toggle motion-toggle"
            type="button"
            aria-pressed={state.accessibility.reducedMotion}
            onClick={() =>
              void update({
                accessibility: {
                  ...state.accessibility,
                  reducedMotion: !state.accessibility.reducedMotion,
                },
              })
            }
          >
            <Pause size={17} aria-hidden="true" />
            <span>{t.reduceMotion}</span>
          </button>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  const { state } = useLearner()
  const t = getCopy(state.language)
  return (
    <footer className="site-footer">
      <span>{t.brand} · {t.brandTagline}</span>
      <span className="footer-promise"><ShieldCheck size={17} aria-hidden="true" /> {t.safePractice}</span>
    </footer>
  )
}

function SaveStatus() {
  const { state, saving, saveError, loadError } = useLearner()
  const t = getCopy(state.language)
  if (saveError || loadError) return null
  return (
    <span className="save-status" role="status" aria-live="polite">
      {saving ? t.saving : t.saved}
    </span>
  )
}

function HeroIllustration() {
  const { state } = useLearner()
  const t = getCopy(state.language)
  return (
    <div className="hero-illustration" aria-label={t.sampleOnly} role="img">
      <div className="illustration-phone">
        <div className="illustration-phone-top"><span /><span /></div>
        <div className="illustration-screen">
          <div className="illustration-screen-label">{t.practiceLabel}</div>
          <div className="illustration-person"><HandHeart size={44} strokeWidth={1.6} /></div>
          <strong>{t.familyCall}</strong>
          <div className="illustration-call-actions">
            <span><Volume2 size={18} /></span>
            <span><VideoIcon /></span>
            <span><Heart size={18} /></span>
          </div>
        </div>
        <div className="illustration-phone-bottom" />
      </div>
      <div className="illustration-note note-bottom"><BookOpen size={17} /> {t.lessonStepList}</div>
    </div>
  )
}

function VideoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="12" height="12" rx="3" />
      <path d="m15 10 6-3v10l-6-3" />
    </svg>
  )
}

function MobileLearningStart() {
  const { state, update } = useLearner()
  const t = getCopy(state.language)
  const navigate = useNavigate()

  async function continueLearning() {
    if (state.lessonStep === 6) await update({ lessonStep: 0 })
    navigate('/lesson/video-call')
  }

  return (
    <section className="mobile-learning">
      <div className="mobile-learning-welcome">
        <h1>{t.dashboardGreeting}</h1>
        <p>{t.noRush}</p>
      </div>
      <article className="mobile-lesson-feature">
        <span className="section-label">{t.nextLesson}</span>
        <h2>{t.familyCall}</h2>
        <p>{t.familyCallSummary}</p>
        <button className="primary-button" type="button" onClick={() => void continueLearning()}>
          {state.completed ? t.practiceAgain : t.continueLearning}
          {state.language === 'ur' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
        </button>
        <div className="mobile-lesson-path">
          <div className="path-heading">
            <span>{t.lessonStepList}</span>
            <strong>{state.completed ? 6 : Math.min(state.lessonStep + 1, 6)} {t.stepCount} 6</strong>
          </div>
          <ProgressSteps current={state.lessonStep} language={state.language} />
        </div>
      </article>
      <Link className="mobile-help-link" to="/dashboard">
        {t.help} <span>{t.learnTogether}</span>
      </Link>
    </section>
  )
}

function LandingPage() {
  const { state } = useLearner()
  const t = getCopy(state.language)
  return (
    <div className="page landing-page">
      <MobileLearningStart />
      <section className="hero-section">
        <div className="hero-copy">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDescription}</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/dashboard">
              {t.getStarted}
              {state.language === 'ur' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </Link>
            <Link className="secondary-button" to="/lesson/video-call">
              <BookOpen size={20} aria-hidden="true" />
              {t.tryLesson}
            </Link>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className="benefit-row" aria-label={t.achievement}>
        <Benefit icon={<BookOpen />} title={t.benefitPace} description={t.benefitPaceDescription} />
        <Benefit icon={<ShieldCheck />} title={t.benefitSafe} description={t.benefitSafeDescription} />
        <Benefit icon={<Heart />} title={t.benefitIndependent} description={t.benefitIndependentDescription} />
      </section>

      <section className="additional-lessons" aria-labelledby="home-lessons-heading">
        <div className="additional-lessons-heading">
          <h2 id="home-lessons-heading">{t.additionalLessons}</h2>
          <p>{t.additionalLessonsDescription}</p>
        </div>
        <InteractiveLessonCards />
      </section>

      <section className="safe-promise">
        <span className="safe-icon"><LockKeyhole size={23} aria-hidden="true" /></span>
        <div><h2>{t.safePractice}</h2><p>{t.safePromise}</p></div>
      </section>
    </div>
  )
}

function Benefit({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <article className="benefit">
      <span className="benefit-icon" aria-hidden="true">{icon}</span>
      <div><h2>{title}</h2><p>{description}</p></div>
    </article>
  )
}

function ProgressSteps({ current, language }: { current: number; language: Language }) {
  const steps = lessonSteps[language]
  const t = getCopy(language)
  const position = Math.min(current + 1, 6)
  return (
    <ol
      className="progress-steps"
      aria-label={`${t.practiceStep} ${position} ${t.ofSix}`}
    >
      {steps.map((step, index) => {
        const complete = index < current
        const active = index === current
        return (
          <li
            key={step.title}
            className={`${complete ? 'is-complete' : ''}${active ? ' is-current' : ''}`}
            aria-current={active ? 'step' : undefined}
            aria-label={`${index + 1}. ${step.title}${
              complete ? ` — ${getCopy(language).stepComplete}` :
              active ? ` — ${getCopy(language).currentStep}` : ''
            }`}
          >
            {complete ? <Check size={16} aria-hidden="true" /> : index + 1}
          </li>
        )
      })}
    </ol>
  )
}

function DashboardPage() {
  const { state, update } = useLearner()
  const t = getCopy(state.language)
  const navigate = useNavigate()
  const step = Math.min(state.lessonStep, 5)
  const completedLessonNames = [
    ...(state.completed ? [t.familyCall] : []),
    ...interactiveLessonIds
      .filter((lessonId) => getInteractiveLessonProgress(state, lessonId).completed)
      .map((lessonId) => interactiveLessons[state.language][lessonId].title),
  ]

  async function continueLearning() {
    if (state.lessonStep === 6) await update({ lessonStep: 0 })
    navigate('/lesson/video-call')
  }

  return (
    <div className="page dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <h1>{t.dashboardGreeting}</h1>
          <p>{t.progressEncouragement} {t.noRush}</p>
        </div>
        <SaveStatus />
      </section>

      <section className="dashboard-main">
        <article className="lesson-feature">
          <div className="lesson-feature-copy">
            <span className="section-label">{t.nextLesson}</span>
            <h2>{t.familyCall}</h2>
            <p>{t.familyCallSummary}</p>
            <p className="lesson-current-step">
              {state.completed
                ? t.lessonCompleted
                : `${t.practiceStep} ${step + 1} ${t.ofSix}: ${lessonSteps[state.language][step].title}`}
            </p>
            <button className="primary-button" type="button" onClick={() => void continueLearning()}>
              {state.completed ? t.practiceAgain : t.continueLearning}
              {state.language === 'ur' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </button>
          </div>
          <div className="lesson-path">
            <div className="path-heading">
              <span>{t.lessonStepList}</span>
              <strong>{state.completed ? 6 : step + 1} {t.stepCount} 6</strong>
            </div>
            <ProgressSteps current={state.lessonStep} language={state.language} />
          </div>
        </article>

        <aside className="dashboard-side">
          <section className="small-progress">
            <span className="side-icon"><CheckCircle2 size={22} aria-hidden="true" /></span>
            <h2>{t.completedLessons}</h2>
            {completedLessonNames.length > 0 ? (
              <ul className="completed-lesson-names">
                {completedLessonNames.map((name) => <li key={name}>{name}</li>)}
              </ul>
            ) : (
              <p>{t.noCompletedLessons}</p>
            )}
          </section>
          <section className="achievement-note">
            <span className="side-icon"><Star size={22} aria-hidden="true" /></span>
            <h2>{t.achievement}</h2>
            <p>{t.achievementDescription}</p>
          </section>
        </aside>
      </section>

      <section className="additional-lessons" aria-labelledby="dashboard-lessons-heading">
        <div className="additional-lessons-heading">
          <h2 id="dashboard-lessons-heading">{t.additionalLessons}</h2>
          <p>{t.additionalLessonsDescription}</p>
        </div>
        <InteractiveLessonCards />
      </section>

      <FamilySupport />
    </div>
  )
}

function FamilySupport() {
  const { state } = useLearner()
  const t = getCopy(state.language)
  const [message, setMessage] = useState('')

  async function shareSummary() {
    setMessage('')
    if (navigator.share) {
      try {
        await navigator.share({ title: t.familyCall, text: t.shareSummary })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setMessage(t.shareFailed)
        return
      }
    }

    await copySummary()
  }

  async function copySummary() {
    setMessage('')
    if (!navigator.clipboard?.writeText) {
      setMessage(t.copyUnavailable)
      return
    }
    try {
      await navigator.clipboard.writeText(t.shareSummary)
      setMessage(t.copied)
    } catch {
      setMessage(t.copyUnavailable)
    }
  }

  return (
    <section className="family-support">
      <div className="family-support-copy">
        <span className="support-icon"><HandHeart size={24} aria-hidden="true" /></span>
        <div><h2>{t.learnTogether}</h2><p>{t.help} {t.learnTogetherDescription}</p></div>
      </div>
      <div className="family-share">
        <p className="share-summary">{t.shareSummary}</p>
        <div className="share-actions">
          <button className="secondary-button" type="button" onClick={() => void shareSummary()}>
            <Share2 size={19} aria-hidden="true" /> {t.shareWithFamily}
          </button>
          <button className="text-button" type="button" onClick={() => void copySummary()}>
            <Copy size={18} aria-hidden="true" /> {t.copySummary}
          </button>
        </div>
        {message && <p className="inline-message" role="status">{message}</p>}
      </div>
    </section>
  )
}

function LessonPage() {
  const { state, update } = useLearner()
  const t = getCopy(state.language)
  const navigate = useNavigate()
  const speech = useSpeech(state.language)

  async function startPractice(guided: boolean) {
    if (state.lessonStep === 6) await update({ lessonStep: 0 })
    navigate(`/practice/video-call${guided ? '?guided=1' : ''}`)
  }

  return (
    <div className="page lesson-page">
      <Link to="/dashboard" className="back-link">
        {state.language === 'ur' ? <ArrowRight size={19} /> : <ArrowLeft size={19} />}
        {t.myLearning}
      </Link>
      <div className="lesson-intro-grid">
        <section className="lesson-intro">
          <span className="section-label">{t.lessonDuration} · {t.lessonStepList}</span>
          <h1>{t.familyCall}</h1>
          <p className="intro-summary">{t.familyCallSummary}</p>
          <div className="voice-panel">
            <p>{lessonSteps[state.language][0].instruction}</p>
            <VoiceControls
              language={state.language}
              step={0}
              text={lessonSteps[state.language][0].instruction}
              speech={speech}
            />
          </div>
          <div className="intro-actions">
            <button className="primary-button" type="button" onClick={() => void startPractice(true)}>
              <Play size={19} aria-hidden="true" /> {t.showMeHow}
            </button>
            <button className="secondary-button" type="button" onClick={() => void startPractice(false)}>
              {t.startPractising}
            </button>
          </div>
        </section>
        <aside className="lesson-facts">
          <section>
            <span className="side-icon"><Heart size={22} aria-hidden="true" /></span>
            <h2>{t.lessonWhyTitle}</h2>
            <p>{t.lessonWhy}</p>
          </section>
          <section>
            <span className="side-icon"><Smartphone size={22} aria-hidden="true" /></span>
            <h2>{t.lessonWhatTitle}</h2>
            <p>{t.lessonStepList} · {t.lessonDuration}</p>
          </section>
        </aside>
      </div>
      <section className="lesson-outline" aria-labelledby="outline-heading">
        <h2 id="outline-heading">{t.lessonWhatTitle}</h2>
        <ol>
          {lessonSteps[state.language].map((step) => <li key={step.title}>{step.title}</li>)}
        </ol>
      </section>
      <SafePracticeNotice language={state.language} />
    </div>
  )
}

function SafePracticeNotice({ language }: { language: Language }) {
  const t = getCopy(language)
  return (
    <aside className="safe-promise compact">
      <span className="safe-icon"><ShieldCheck size={22} aria-hidden="true" /></span>
      <div><h2>{t.safePractice}</h2><p>{t.safePromise}</p></div>
    </aside>
  )
}

function VoiceControls({
  language,
  step,
  text,
  speech,
}: {
  language: Language
  step: number
  text: string
  speech: ReturnType<typeof useSpeech>
}) {
  const t = getCopy(language)
  return (
    <div className="voice-controls">
      <button
        className="voice-button"
        type="button"
        onClick={() => speech.speak(text, step)}
        disabled={!speech.voiceAvailable || speech.loading}
      >
        <Volume2 size={19} aria-hidden="true" /> {t.listen}
      </button>
      {speech.speaking && (
        <button className="voice-button" type="button" onClick={speech.pauseOrResume}>
          {speech.paused ? <Play size={18} /> : <Pause size={18} />}
          {speech.paused ? t.listen : t.pauseVoice}
        </button>
      )}
      {speech.speaking && (
        <button className="voice-button" type="button" onClick={speech.stop}>
          <StopCircle size={18} aria-hidden="true" /> {t.stopVoice}
        </button>
      )}
      <button
        className="voice-button"
        type="button"
        onClick={() => speech.speak(text, step)}
        disabled={!speech.voiceAvailable || speech.loading}
      >
        <RotateCcw size={17} aria-hidden="true" /> {t.repeatInstruction}
      </button>
      {speech.loading && <span className="voice-note" role="status">{t.voiceLoading}</span>}
      {speech.failed && <span className="voice-note" role="status">{t.voiceFailed}</span>}
      {!speech.supported && <span className="voice-note" role="status">{t.voiceUnsupported}</span>}
      {speech.supported && language === 'ur' && speech.urduServiceStatus === 'loading' && (
        <span className="voice-note" role="status">{t.voiceLoading}</span>
      )}
      {speech.supported && language === 'ur' && speech.urduServiceStatus === 'error' && (
        <span className="voice-note" role="status">{t.voiceServiceUnavailable}</span>
      )}
      {speech.supported && language === 'en' && !speech.voiceAvailable && (
        <span className="voice-note" role="status">{t.voiceLanguageUnavailable}</span>
      )}
    </div>
  )
}

function PracticePage() {
  const { state, update } = useLearner()
  const t = getCopy(state.language)
  const navigate = useNavigate()
  const [permissionStage, setPermissionStage] = useState<PermissionStage>('camera')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [hintShown, setHintShown] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)
  const [microphoneOn, setMicrophoneOn] = useState(true)
  const speech = useSpeech(state.language)
  const speakInstruction = speech.speak
  const currentStep = Math.min(state.lessonStep, 5)
  const instruction = lessonSteps[state.language][currentStep]
  const hint = instruction.hint

  useEffect(() => {
    if (state.lessonStep === 6) navigate('/complete/video-call', { replace: true })
  }, [navigate, state.lessonStep])

  useEffect(() => {
    const guided = new URLSearchParams(window.location.search).get('guided') === '1'
    if (guided && state.lessonStep < 6) {
      speakInstruction(instruction.instruction, currentStep)
    }
  }, [currentStep, instruction.instruction, speakInstruction, state.language, state.lessonStep])

  async function restartPractice() {
    setPermissionStage('camera')
    setFeedback(null)
    setHintShown(false)
    setCameraOn(true)
    setMicrophoneOn(true)
    speech.stop()
    await update({ lessonStep: 0 })
  }

  async function handleAction(action: PracticeAction) {
    const transition = transitionPractice(
      state.lessonStep,
      permissionStage,
      action,
    )
    if (transition.result === 'wrong') {
      const specificHint =
        currentStep === 0 ? t.wrongAppHint :
        currentStep === 1 ? t.wrongContactHint :
        currentStep === 2 ? t.wrongCallHint :
        currentStep === 4 ? t.wrongJoinHint :
        t.wrongEndHint
      setFeedback(`${t.niceTry} ${t.tryAnotherWay} ${specificHint}`)
      return
    }
    if (transition.result === 'permission-denied') {
      setFeedback(`${t.niceTry} ${t.permissionHint}`)
      return
    }
    if (transition.result === 'camera-allowed') {
      setPermissionStage('microphone')
      setFeedback(t.cameraGranted)
      return
    }
    if (transition.result === 'microphone-allowed') {
      setPermissionStage('camera')
      setFeedback(t.microphoneGranted)
      await update({ lessonStep: transition.step })
      return
    }
    if (transition.result === 'control-toggled') {
      if (action === 'toggle-camera') setCameraOn((value) => !value)
      if (action === 'toggle-microphone') setMicrophoneOn((value) => !value)
      setFeedback(t.controlUpdated)
      return
    }
    if (transition.result === 'finish') {
      setFeedback(null)
      speech.stop()
      await update({ lessonStep: 6, completed: true })
      navigate('/complete/video-call')
      return
    }

    setFeedback(null)
    await update({ lessonStep: transition.step })
  }

  return (
    <div className="page practice-page">
      <div className="practice-heading">
        <div>
          <Link to="/lesson/video-call" className="back-link">
            {state.language === 'ur' ? <ArrowRight size={19} /> : <ArrowLeft size={19} />}
            {t.back}
          </Link>
          <h1>{t.practiceTitle}</h1>
          <p>{t.safePromise}</p>
        </div>
        <button className="text-button restart-button" type="button" onClick={() => void restartPractice()}>
          <RotateCcw size={19} aria-hidden="true" /> {t.restart}
        </button>
      </div>

      <section className="practice-layout">
        <aside className="instruction-panel">
          <div className="step-count-label">
            {t.practiceStep} {currentStep + 1} {t.ofSix}
          </div>
          <ProgressSteps current={state.lessonStep} language={state.language} />
          <h2>{instruction.title}</h2>
          <p className="instruction-text">{instruction.instruction}</p>
          <VoiceControls
            language={state.language}
            step={currentStep}
            text={instruction.instruction}
            speech={speech}
          />
          <div className="hint-area">
            <button
              className="hint-button"
              type="button"
              aria-expanded={hintShown}
              onClick={() => setHintShown((shown) => !shown)}
            >
              <Lightbulb size={19} aria-hidden="true" />
              {hintShown ? t.hideHint : t.hint}
            </button>
            {hintShown && <p className="hint-message">{hint}</p>}
          </div>
          <SafePracticeNotice language={state.language} />
        </aside>

        <div className="phone-stage">
          <div className="simulator-caption">
            <span><Smartphone size={19} aria-hidden="true" /> {t.practiceLabel}</span>
            <span>{t.practiceStep} {currentStep + 1} {t.ofSix}</span>
          </div>
          <SimulationPhone
            language={state.language}
            step={currentStep}
            permissionStage={permissionStage}
            feedback={feedback}
            cameraOn={cameraOn}
            microphoneOn={microphoneOn}
            onAction={(action) => void handleAction(action)}
          />
        </div>
      </section>
    </div>
  )
}

function CompletionPage() {
  const { state, update } = useLearner()
  const t = getCopy(state.language)
  const navigate = useNavigate()
  const [shareMessage, setShareMessage] = useState('')

  if (!state.completed) return <Navigate to="/dashboard" replace />

  async function restartLesson() {
    await update({ lessonStep: 0 })
    navigate('/practice/video-call')
  }

  async function shareAchievement() {
    setShareMessage('')
    const text = `${t.completionTitle} ${t.familyCall}`
    if (!navigator.share) {
      setShareMessage(t.copyUnavailable)
      return
    }
    try {
      await navigator.share({ title: t.completionTitle, text })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setShareMessage(t.shareFailed)
    }
  }

  return (
    <div className="page completion-page">
      <section className="completion-hero">
        <div className="celebration-mark" aria-hidden="true">
          <CheckCircle2 size={45} />
          <span className="celebration-dot dot-one" />
          <span className="celebration-dot dot-two" />
          <span className="celebration-dot dot-three" />
        </div>
        <h1>{t.completionTitle}</h1>
        <p>{t.completionDescription}</p>
        <div className="completed-step-list">
          <h2>{t.learnedTitle}</h2>
          <ProgressSteps current={6} language={state.language} />
          <p>{t.familyCall}</p>
        </div>
      </section>

      <section className="confidence-panel" aria-labelledby="confidence-heading">
        <h2 id="confidence-heading">{t.confidenceTitle}</h2>
        <div className="confidence-scale">
          <span>{t.confidenceLow}</span>
          <div className="rating-buttons" role="group" aria-label={t.confidenceTitle}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                aria-label={`${rating} ${t.stars}`}
                aria-pressed={state.confidence === rating}
                className={state.confidence !== null && rating <= state.confidence ? 'selected' : ''}
                onClick={() => void update({ confidence: rating })}
              >
                <Star size={22} fill={state.confidence !== null && rating <= state.confidence ? 'currentColor' : 'none'} />
                <span>{rating}</span>
              </button>
            ))}
          </div>
          <span>{t.confidenceHigh}</span>
        </div>
        {state.confidence !== null && <p className="inline-message" role="status">{t.confidenceSaved}</p>}
      </section>

      <section className="real-world-checklist">
        <div className="checklist-heading">
          <span className="side-icon"><Smartphone size={22} aria-hidden="true" /></span>
          <div><h2>{t.realWorldTitle}</h2><p>{t.safePromise}</p></div>
        </div>
        <ol>
          {[t.checklist1, t.checklist2, t.checklist3, t.checklist4, t.checklist5].map((item) => (
            <li key={item}><Check size={19} aria-hidden="true" /><span>{item}</span></li>
          ))}
        </ol>
      </section>

      <div className="completion-actions">
        <button className="primary-button" type="button" onClick={() => void restartLesson()}>
          <RotateCcw size={19} aria-hidden="true" /> {t.repeatLesson}
        </button>
        <Link className="secondary-button" to="/dashboard">
          {t.goToDashboard}
        </Link>
        <button className="text-button" type="button" onClick={() => void shareAchievement()}>
          <Share2 size={18} aria-hidden="true" /> {t.shareWithFamily}
        </button>
      </div>
      {shareMessage && <p className="inline-message" role="status">{shareMessage}</p>}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LearnerProvider>
        <AppLayout />
      </LearnerProvider>
    </BrowserRouter>
  )
}
