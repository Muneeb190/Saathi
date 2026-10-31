import assert from 'node:assert/strict'
import test from 'node:test'
import { interactiveLessonIds, interactiveLessons } from './interactive-lessons.js'

test('each interactive lesson has bilingual, recoverable decision points', () => {
  for (const language of ['en', 'ur'] as const) {
    for (const lessonId of interactiveLessonIds) {
      const lesson = interactiveLessons[language][lessonId]
      assert.ok(lesson.steps.length >= 5)
      for (const step of lesson.steps) {
        assert.ok(step.instruction.trim())
        assert.ok(step.hint.trim())
        assert.ok(step.choices.length >= 2)
        assert.equal(step.choices.filter((choice) => choice.correct).length, 1)
        assert.ok(step.choices.every((choice) => choice.feedback.trim()))
      }
    }
  }
})

test('scam scenarios teach safe handling for the requested message types', () => {
  const scamLesson = interactiveLessons.en['scam-detective']
  const scenarioText = scamLesson.steps
    .map((step) => `${step.title} ${step.instruction} ${step.message}`)
    .join(' ')
    .toLowerCase()

  assert.match(scenarioText, /whatsapp/)
  assert.match(scenarioText, /prize/)
  assert.match(scenarioText, /bank alert/)
  assert.match(scenarioText, /link/)
  assert.match(scenarioText, /otp/)
  const links = scenarioText.match(/https?:\/\/\S+/g) ?? []
  assert.ok(links.length >= 2)
  assert.ok(links.every((link) => link.endsWith('.invalid')))
})

test('utility-bill practice uses fictional values and never offers a payment action', () => {
  for (const language of ['en', 'ur'] as const) {
    const lesson = interactiveLessons[language]['utility-bill']
    assert.ok(lesson.bill)
    assert.match(lesson.bill.consumerNumber, /^0{4}-0{4}-0{4}$/)
    assert.equal(lesson.bill.referenceNumber, 'DEMO-REF-000000')
    assert.match(lesson.practiceNotice, /no payment|کوئی ادائیگی نہیں/i)
    assert.ok(lesson.steps.at(-1)?.choices.every((choice) => !choice.correct || /real payment|حقیقی ادائیگی/i.test(choice.feedback)))
    assert.ok(lesson.steps.every((step) => !step.choices.some((choice) => /pay now|ادائیگی ابھی کریں/i.test(choice.label))))
  }
})
