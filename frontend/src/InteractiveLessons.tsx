import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Pause,
  Play,
  ReceiptText,
  RotateCcw,
  ShieldAlert,
  StopCircle,
  Volume2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import type { InteractiveLessonId, Language } from '../../shared/learner-state'
import { getInteractiveLessonProgress } from '../../shared/learner-state'
import { interactiveLessonIds, interactiveLessons } from '../../shared/interactive-lessons'
import { useLearner } from './learner-context'
import { useSpeech } from './useSpeech'

function routeFor(lessonId: InteractiveLessonId, stage: 'lesson' | 'practice' | 'complete') {
  return `/${stage}/${lessonId}`
}

export function InteractiveLessonCards() {
  const { state } = useLearner()
  const isUrdu = state.language === 'ur'

  return (
    <div className="interactive-lesson-list">
      {interactiveLessonIds.map((lessonId) => {
        const lesson = interactiveLessons[state.language][lessonId]
        const progress = getInteractiveLessonProgress(state, lessonId)
        const Icon = lessonId === 'scam-detective' ? ShieldAlert : ReceiptText
        const countLabel = isUrdu
          ? `${lesson.steps.length} میں سے ${progress.step} ${lesson.progressLabel} مکمل`
          : `${progress.step} of ${lesson.steps.length} ${lesson.progressLabel} complete`
        return (
          <article className="interactive-lesson-card" key={lessonId}>
            <div className="interactive-lesson-card-heading">
              <span className="interactive-lesson-icon" aria-hidden="true"><Icon size={24} /></span>
              <span className="interactive-lesson-duration">{lesson.duration}</span>
            </div>
            <h3>{lesson.title}</h3>
            <p>{lesson.summary}</p>
            <div className="interactive-lesson-progress">
              <span>{progress.completed ? lesson.completed : countLabel}</span>
              {progress.completed && <CheckCircle2 size={18} aria-hidden="true" />}
            </div>
            <Link
              className="secondary-button"
              to={routeFor(lessonId, progress.completed ? 'complete' : 'lesson')}
            >
              {progress.completed ? lesson.review : progress.step > 0 ? lesson.continue : lesson.start}
              {isUrdu ? <ArrowLeft size={19} aria-hidden="true" /> : <ArrowRight size={19} aria-hidden="true" />}
            </Link>
          </article>
        )
      })}
    </div>
  )
}

export function InteractiveLessonIntro({ lessonId }: { lessonId: InteractiveLessonId }) {
  const { state } = useLearner()
  const lesson = interactiveLessons[state.language][lessonId]
  const progress = getInteractiveLessonProgress(state, lessonId)
  const navigate = useNavigate()
  const speech = useSpeech(state.language)
  const isUrdu = state.language === 'ur'
  const firstStep = lesson.steps[Math.min(progress.step, lesson.steps.length - 1)]
  const goToPractice = (guided: boolean) => {
    navigate(`${routeFor(lessonId, 'practice')}${guided ? '?guided=1' : ''}`)
  }

  if (progress.completed) return <Navigate to={routeFor(lessonId, 'complete')} replace />

  return (
    <div className="page interactive-lesson-page">
      <Link to="/dashboard" className="back-link">
        {isUrdu ? <ArrowRight size={19} /> : <ArrowLeft size={19} />}
        {lesson.back}
      </Link>
      <section className="interactive-intro">
        <div className="interactive-intro-copy">
          <h1>{lesson.title}</h1>
          <p className="intro-summary">{lesson.summary}</p>
          <p className="interactive-duration">{lesson.duration} · {lesson.steps.length} {lesson.progressLabel}</p>
          <div className="voice-panel">
            <p>{firstStep.instruction}</p>
            <LessonVoiceControls
              lessonId={lessonId}
              step={Math.min(progress.step, lesson.steps.length - 1)}
              instruction={firstStep.instruction}
              speech={speech}
              lesson={lesson}
              language={state.language}
            />
          </div>
          <div className="intro-actions">
            <button className="primary-button" type="button" onClick={() => goToPractice(true)}>
              <Play size={19} aria-hidden="true" /> {lesson.start}
            </button>
            <button className="secondary-button" type="button" onClick={() => goToPractice(false)}>
              {lesson.continue}
            </button>
          </div>
        </div>
        <aside className="interactive-safety-note">
          <span className="interactive-lesson-icon" aria-hidden="true">
            {lessonId === 'scam-detective' ? <ShieldAlert size={25} /> : <ReceiptText size={25} />}
          </span>
          <h2>{lesson.safeTitle}</h2>
          <p>{lesson.practiceNotice}</p>
          <p>{lesson.safeDescription}</p>
        </aside>
      </section>
      <section className="interactive-outline" aria-labelledby="interactive-outline-title">
        <h2 id="interactive-outline-title">
          {isUrdu ? 'اس سبق میں آپ یہ سیکھیں گے' : 'What you will practise'}
        </h2>
        <ol>
          {lesson.steps.map((step) => <li key={step.title}>{step.title}</li>)}
        </ol>
      </section>
    </div>
  )
}

export function InteractiveLessonPractice({ lessonId }: { lessonId: InteractiveLessonId }) {
  const { state, update } = useLearner()
  const lesson = interactiveLessons[state.language][lessonId]
  const progress = getInteractiveLessonProgress(state, lessonId)
  const navigate = useNavigate()
  const speech = useSpeech(state.language)
  const [selectedAnswer, setSelectedAnswer] = useState<{
    index: number
    stepIndex: number
    language: Language
  } | null>(null)
  const [hintForQuestion, setHintForQuestion] = useState<string | null>(null)
  const isUrdu = state.language === 'ur'
  const stepIndex = Math.min(progress.step, lesson.steps.length - 1)
  const step = lesson.steps[stepIndex]
  const questionKey = `${state.language}:${stepIndex}`
  const selectedChoice =
    selectedAnswer?.stepIndex === stepIndex && selectedAnswer.language === state.language
      ? selectedAnswer.index
      : null
  const selected = selectedChoice === null ? null : step.choices[selectedChoice]
  const hintShown = hintForQuestion === questionKey
  const guided = new URLSearchParams(window.location.search).get('guided') === '1'
  const lastGuidedStep = useRef<string | null>(null)
  const speakInstruction = speech.speak

  useEffect(() => {
    if (guided && progress.step < lesson.steps.length && lastGuidedStep.current !== questionKey) {
      lastGuidedStep.current = questionKey
      speakInstruction(step.instruction, stepIndex, lessonId)
    }
  }, [guided, lessonId, lesson.steps.length, progress.step, questionKey, speakInstruction, step.instruction, stepIndex])

  if (progress.completed) return <Navigate to={routeFor(lessonId, 'complete')} replace />

  async function continueAfterCorrectChoice() {
    setSelectedAnswer(null)
    setHintForQuestion(null)
    if (stepIndex === lesson.steps.length - 1) {
      await update({
        lessonProgress: {
          ...state.lessonProgress,
          [lessonId]: { step: lesson.steps.length, completed: true },
        },
      })
      speech.stop()
      navigate(routeFor(lessonId, 'complete'))
      return
    }

    await update({
      lessonProgress: {
        ...state.lessonProgress,
        [lessonId]: { step: stepIndex + 1, completed: false },
      },
    })
  }

  function restartCurrentQuestion() {
    setSelectedAnswer(null)
    setHintForQuestion(null)
  }

  return (
    <div className="page interactive-practice-page">
      <div className="practice-heading">
        <div>
          <Link to={routeFor(lessonId, 'lesson')} className="back-link">
            {isUrdu ? <ArrowRight size={19} /> : <ArrowLeft size={19} />}
            {lesson.back}
          </Link>
          <h1>{lesson.title}</h1>
          <p>{lesson.practiceNotice}</p>
        </div>
        <button className="text-button restart-button" type="button" onClick={restartCurrentQuestion}>
          <RotateCcw size={19} aria-hidden="true" /> {lesson.retry}
        </button>
      </div>

      <section className="interactive-practice-layout">
        <aside className="instruction-panel">
          <div className="step-count-label">
            {isUrdu ? `قدم ${stepIndex + 1} از ${lesson.steps.length}` : `Step ${stepIndex + 1} of ${lesson.steps.length} ${lesson.progressLabel}`}
          </div>
          <ol className="interactive-progress" aria-label={lesson.title}>
            {lesson.steps.map((item, index) => (
              <li
                key={item.title}
                className={`${index < stepIndex ? 'is-complete' : ''}${index === stepIndex ? ' is-current' : ''}`}
                aria-current={index === stepIndex ? 'step' : undefined}
                aria-label={`${index + 1}. ${item.title}`}
              >
                {index < stepIndex ? <CheckCircle2 size={17} aria-hidden="true" /> : index + 1}
              </li>
            ))}
          </ol>
          <h2>{step.title}</h2>
          <p className="instruction-text">{step.instruction}</p>
          <LessonVoiceControls
            lessonId={lessonId}
            step={stepIndex}
            instruction={step.instruction}
            speech={speech}
            lesson={lesson}
            language={state.language}
          />
          <div className="hint-area">
            <button
              className="hint-button"
              type="button"
              aria-expanded={hintShown}
              onClick={() => setHintForQuestion(hintShown ? null : questionKey)}
            >
              <Lightbulb size={19} aria-hidden="true" />
              {hintShown ? lesson.hideHint : lesson.showHint}
            </button>
            {hintShown && <p className="hint-message">{step.hint}</p>}
          </div>
          <aside className="interactive-safe-card">
            <h3>{lesson.safeTitle}</h3>
            <p>{lesson.safeDescription}</p>
          </aside>
        </aside>

        <section className="interactive-simulator" aria-label={lesson.practiceLabel}>
          <div className="simulator-caption">
            {lessonId === 'scam-detective' ? <ShieldAlert size={19} aria-hidden="true" /> : <ReceiptText size={19} aria-hidden="true" />}
            <strong>{lesson.practiceLabel}</strong>
            <span>{isUrdu ? `قدم ${stepIndex + 1} از ${lesson.steps.length}` : `Step ${stepIndex + 1}`}</span>
          </div>
          {lessonId === 'scam-detective' ? (
            <MessageScenario step={step} />
          ) : (
            <SampleBillScreen lesson={lesson} />
          )}
          <h2 className="choice-prompt">
            {lessonId === 'scam-detective' ? lesson.choicePrompt : step.prompt}
          </h2>
          <div className="lesson-choices" role="group" aria-label={lesson.choicePrompt}>
            {step.choices.map((choice, index) => (
              <button
                className={`lesson-choice${selectedChoice === index ? (choice.correct ? ' is-correct' : ' is-incorrect') : ''}`}
                type="button"
                key={choice.label}
                aria-pressed={selectedChoice === index}
                onClick={() => setSelectedAnswer({ index, stepIndex, language: state.language })}
              >
                <span className="choice-marker" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                <span>{choice.label}</span>
              </button>
            ))}
          </div>
          {selected && (
            <div className={`choice-feedback${selected.correct ? ' feedback-correct' : ' feedback-retry'}`} role="status">
              <p>{selected.feedback}</p>
              {selected.correct ? (
                <button className="primary-button" type="button" onClick={() => void continueAfterCorrectChoice()}>
                  {stepIndex === lesson.steps.length - 1 ? lesson.finish : lesson.next}
                  {isUrdu ? <ArrowLeft size={19} aria-hidden="true" /> : <ArrowRight size={19} aria-hidden="true" />}
                </button>
              ) : (
                <button className="secondary-button" type="button" onClick={restartCurrentQuestion}>
                  {lesson.tryAgain}
                </button>
              )}
            </div>
          )}
        </section>
      </section>
    </div>
  )
}

export function InteractiveLessonCompletion({ lessonId }: { lessonId: InteractiveLessonId }) {
  const { state, update } = useLearner()
  const lesson = interactiveLessons[state.language][lessonId]
  const progress = getInteractiveLessonProgress(state, lessonId)
  const navigate = useNavigate()
  if (!progress.completed) return <Navigate to="/dashboard" replace />

  async function restartLesson() {
    await update({
      lessonProgress: {
        ...state.lessonProgress,
        [lessonId]: { step: 0, completed: false },
      },
    })
    navigate(routeFor(lessonId, 'practice'))
  }

  return (
    <div className="page interactive-completion-page">
      <section className="interactive-completion">
        <span className="completion-mark" aria-hidden="true"><CheckCircle2 size={44} /></span>
        <h1>{lesson.completedTitle}</h1>
        <p>{lesson.completedDescription}</p>
        <div className="interactive-completion-summary">
          <h2>{lesson.title}</h2>
          <p>{lesson.practiceNotice}</p>
        </div>
        <div className="completion-actions">
          <button className="primary-button" type="button" onClick={() => void restartLesson()}>
            <RotateCcw size={19} aria-hidden="true" /> {lesson.start}
          </button>
          <Link className="secondary-button" to="/dashboard">{lesson.back}</Link>
        </div>
      </section>
    </div>
  )
}

function MessageScenario({ step }: { step: (typeof interactiveLessons.en)['scam-detective']['steps'][number] }) {
  const { state } = useLearner()
  const lesson = interactiveLessons[state.language]['scam-detective']
  return (
    <div className="message-simulation">
      <div className="message-simulation-header">
        <span className="message-avatar" aria-hidden="true"><ShieldAlert size={20} /></span>
        <div><strong>{step.prompt}</strong><span>{step.sender}</span></div>
      </div>
      <div className="message-bubble">
        <p>{step.message}</p>
        <span>{state.language === 'ur' ? 'نمونہ پیغام' : 'Sample message'}</span>
      </div>
      <p className="simulator-disclaimer">{lesson.practiceNotice}</p>
    </div>
  )
}

function SampleBillScreen({ lesson }: { lesson: (typeof interactiveLessons.en)['utility-bill'] }) {
  const bill = lesson.bill
  if (!bill) throw new Error('The fictional utility bill sample is missing.')
  const rows = [
    [bill.labels.consumerNumber, bill.consumerNumber],
    [bill.labels.referenceNumber, bill.referenceNumber],
    [bill.labels.period, bill.billingPeriod],
    [bill.labels.issueDate, bill.issueDate],
    [bill.labels.dueDate, bill.dueDate],
    [bill.labels.units, bill.units],
    [bill.labels.currentCharges, bill.currentCharges],
    [bill.labels.lateFee, bill.lateFee],
  ]
  return (
    <div className="sample-bill">
      <div className="sample-bill-header">
        <span>{bill.labels.sample}</span>
        <strong>{bill.provider}</strong>
      </div>
      <dl className="sample-bill-details">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd dir="auto"><bdi>{value}</bdi></dd>
          </div>
        ))}
        <div className="sample-bill-total">
          <dt>{bill.labels.totalDue}</dt>
          <dd dir="auto"><bdi>{bill.totalDue}</bdi></dd>
        </div>
      </dl>
      <p className="simulator-disclaimer">{lesson.practiceNotice}</p>
    </div>
  )
}

function LessonVoiceControls({
  lessonId,
  step,
  instruction,
  speech,
  lesson,
  language,
}: {
  lessonId: InteractiveLessonId
  step: number
  instruction: string
  speech: ReturnType<typeof useSpeech>
  lesson: (typeof interactiveLessons.en)[InteractiveLessonId]
  language: Language
}) {
  const isUrdu = language === 'ur'
  return (
    <div className="voice-controls">
      <button
        className="voice-button"
        type="button"
        disabled={!speech.voiceAvailable || speech.loading}
        onClick={() => speech.speak(instruction, step, lessonId)}
      >
        <Volume2 size={18} aria-hidden="true" /> {lesson.listen}
      </button>
      {speech.speaking && (
        <button className="voice-button" type="button" onClick={speech.pauseOrResume}>
          {speech.paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
          {speech.paused ? lesson.listen : lesson.pause}
        </button>
      )}
      {speech.speaking && (
        <button className="voice-button" type="button" onClick={speech.stop}>
          <StopCircle size={18} aria-hidden="true" /> {lesson.stop}
        </button>
      )}
      <button
        className="voice-button"
        type="button"
        disabled={!speech.voiceAvailable || speech.loading}
        onClick={() => speech.speak(instruction, step, lessonId)}
      >
        <RotateCcw size={17} aria-hidden="true" /> {lesson.repeat}
      </button>
      {speech.loading && <span className="voice-note" role="status">{lesson.voiceLoading}</span>}
      {speech.failed && <span className="voice-note" role="status">{lesson.voiceFailed}</span>}
      {isUrdu && speech.urduServiceStatus === 'error' && (
        <span className="voice-note" role="status">{lesson.voiceUnavailable}</span>
      )}
      {!speech.supported && <span className="voice-note" role="status">{lesson.voiceUnavailable}</span>}
    </div>
  )
}
