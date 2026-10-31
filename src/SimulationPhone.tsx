import {
  Camera,
  CameraOff,
  Check,
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  Smartphone,
  UserRound,
  Video,
} from 'lucide-react'
import { getCopy } from './content'
import type { Language } from '../shared/learner-state'
import type { PermissionStage, PracticeAction } from './simulation'

interface SimulationPhoneProps {
  language: Language
  step: number
  permissionStage: PermissionStage
  feedback: string | null
  cameraOn: boolean
  microphoneOn: boolean
  onAction: (action: PracticeAction) => void
}

export function SimulationPhone({
  language,
  step,
  permissionStage,
  feedback,
  cameraOn,
  microphoneOn,
  onAction,
}: SimulationPhoneProps) {
  const t = getCopy(language)
  const sampleContact = language === 'ur' ? 'امی' : 'Ammi'

  return (
    <section className="phone-frame" aria-label={t.samplePhone}>
      <div className="phone-top">
        <span className="phone-camera" aria-hidden="true" />
        <span>9:41</span>
        <span className="phone-safe">{t.sampleOnly}</span>
      </div>
      <div className="phone-screen">
        {step === 0 && (
          <div className="phone-home-screen">
            <div className="phone-screen-heading">
              <Smartphone size={22} aria-hidden="true" />
              <span>{t.phoneHome}</span>
            </div>
            <div className="phone-app-grid">
              <button
                className="phone-app"
                type="button"
                onClick={() => onAction('open-app')}
              >
                <span className="app-icon app-icon-video">
                  <Video size={28} aria-hidden="true" />
                </span>
                <span>{t.videoApp}</span>
              </button>
              <button className="phone-app" type="button" onClick={() => onAction('other')}>
                <span className="app-icon app-icon-settings">
                  <Settings size={28} aria-hidden="true" />
                </span>
                <span>{t.settingsApp}</span>
              </button>
              <button className="phone-app" type="button" onClick={() => onAction('other')}>
                <span className="app-icon app-icon-photos">
                  <UserRound size={28} aria-hidden="true" />
                </span>
                <span>{t.photosApp}</span>
              </button>
            </div>
            <p className="phone-helper">{t.genericHint}</p>
          </div>
        )}

        {step === 1 && (
          <div className="phone-list-screen">
            <h2>{t.contactsTitle}</h2>
            <button
              className="contact-row"
              type="button"
              onClick={() => onAction('select-family-contact')}
            >
              <span className="contact-avatar" aria-hidden="true">
                <UserRound size={28} />
              </span>
              <span>{t.sampleContact}</span>
            </button>
            <button className="contact-row" type="button" onClick={() => onAction('other')}>
              <span className="contact-avatar" aria-hidden="true">
                <UserRound size={28} />
              </span>
              <span>{t.otherContact}</span>
            </button>
            <p className="phone-helper">{t.contactNote}</p>
          </div>
        )}

        {step === 2 && (
          <div className="phone-contact-screen">
            <span className="contact-avatar contact-avatar-large" aria-hidden="true">
              <UserRound size={48} />
            </span>
            <h2>{sampleContact}</h2>
            <p>{t.sampleOnly}</p>
            <div className="contact-actions">
              <button type="button" onClick={() => onAction('start-video-call')}>
                <Video size={27} aria-hidden="true" />
                <span>{t.videoCall}</span>
              </button>
              <button type="button" onClick={() => onAction('other')}>
                <Mic size={27} aria-hidden="true" />
                <span>{t.audioCall}</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="permission-screen">
            <span className="permission-icon" aria-hidden="true">
              {permissionStage === 'camera' ? (
                <Camera size={32} />
              ) : (
                <Mic size={32} />
              )}
            </span>
            <h2>
              {permissionStage === 'camera'
                ? t.cameraPermissionTitle
                : t.microphonePermissionTitle}
            </h2>
            <p>
              {permissionStage === 'camera'
                ? t.cameraPermissionText
                : t.microphonePermissionText}
            </p>
            <button
              className="primary-button phone-primary"
              type="button"
              onClick={() => onAction('allow-permission')}
            >
              <Check size={20} aria-hidden="true" />
              {t.allow}
            </button>
            <button
              className="text-button phone-text-button"
              type="button"
              onClick={() => onAction('deny-permission')}
            >
              {t.notNow}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="call-ready-screen">
            <span className="contact-avatar contact-avatar-large" aria-hidden="true">
              <UserRound size={48} />
            </span>
            <h2>{t.practicePreview}</h2>
            <p>{t.practicePreviewText}</p>
            <button
              className="primary-button phone-primary"
              type="button"
              onClick={() => onAction('join-call')}
            >
              <Video size={20} aria-hidden="true" />
              {t.joinPracticeCall}
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="practice-call-screen">
            <span className="contact-avatar contact-avatar-large" aria-hidden="true">
              <UserRound size={52} />
            </span>
            <h2>{t.practiceCallWith}</h2>
            <p>{t.simulatorNotice}</p>
            <div className="call-controls">
              <button
                type="button"
                aria-label={cameraOn ? t.turnCameraOff : t.turnCameraOn}
                aria-pressed={cameraOn}
                onClick={() => onAction('toggle-camera')}
              >
                {cameraOn ? (
                  <Camera size={21} aria-hidden="true" />
                ) : (
                  <CameraOff size={21} aria-hidden="true" />
                )}
                <span>{cameraOn ? t.cameraOn : t.cameraOff}</span>
              </button>
              <button
                type="button"
                aria-label={microphoneOn ? t.turnMicrophoneOff : t.turnMicrophoneOn}
                aria-pressed={microphoneOn}
                onClick={() => onAction('toggle-microphone')}
              >
                {microphoneOn ? (
                  <Mic size={21} aria-hidden="true" />
                ) : (
                  <MicOff size={21} aria-hidden="true" />
                )}
                <span>{microphoneOn ? t.microphoneOn : t.microphoneOff}</span>
              </button>
            </div>
            <button
              className="end-call-button"
              type="button"
              onClick={() => onAction('end-call')}
            >
              <PhoneOff size={20} aria-hidden="true" />
              {t.endPracticeCall}
            </button>
          </div>
        )}
      </div>
      <div className="phone-bottom" aria-hidden="true">
        <span />
      </div>
      {feedback && (
        <div className="practice-feedback" role="status" aria-live="polite">
          {feedback}
        </div>
      )}
    </section>
  )
}
