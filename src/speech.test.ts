import assert from 'node:assert/strict'
import test from 'node:test'
import { lessonSteps } from './content'
import { findSpeechVoice } from './speech'

function voice(lang: string): SpeechSynthesisVoice {
  return {
    default: false,
    lang,
    localService: true,
    name: lang,
    voiceURI: lang,
  }
}

test('selects a matching Urdu voice and prefers Pakistani Urdu', () => {
  const urIn = voice('ur-IN')
  const urPk = voice('ur-PK')
  assert.equal(findSpeechVoice([urIn, urPk], 'ur'), urPk)
})

test('does not use a different language voice for Urdu instructions', () => {
  assert.equal(findSpeechVoice([voice('en-US'), voice('ar-SA')], 'ur'), undefined)
})

test('selects an English voice when the learner uses English', () => {
  const english = voice('en-US')
  assert.equal(findSpeechVoice([voice('fr-FR'), english], 'en'), english)
})

test('provides a spoken Urdu instruction for all six practice steps', () => {
  const steps = lessonSteps.ur
  assert.equal(steps.length, 6)
  for (const step of steps) {
    assert.match(step.instruction, /[\u0600-\u06ff]/u)
    assert.ok(step.instruction.trim().length > 0)
  }
})
