import assert from 'node:assert/strict'
import test from 'node:test'
import { transitionPractice } from './simulation'

test('a wrong tap leaves the learner on the same step', () => {
  const result = transitionPractice(0, 'camera', 'other')
  assert.equal(result.step, 0)
  assert.equal(result.result, 'wrong')
})

test('camera and microphone permissions advance only after both are allowed', () => {
  const camera = transitionPractice(3, 'camera', 'allow-permission')
  assert.deepEqual(camera, {
    step: 3,
    permissionStage: 'microphone',
    result: 'camera-allowed',
  })

  const microphone = transitionPractice(
    camera.step,
    camera.permissionStage,
    'allow-permission',
  )
  assert.equal(microphone.step, 4)
  assert.equal(microphone.result, 'microphone-allowed')
})

test('denying a simulated permission does not advance the lesson', () => {
  const result = transitionPractice(3, 'camera', 'deny-permission')
  assert.equal(result.step, 3)
  assert.equal(result.result, 'permission-denied')
})

test('the simulated call ends only from the final step', () => {
  const result = transitionPractice(5, 'camera', 'end-call')
  assert.equal(result.step, 6)
  assert.equal(result.result, 'finish')
})
