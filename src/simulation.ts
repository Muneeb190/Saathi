export type PermissionStage = 'camera' | 'microphone'

export type PracticeAction =
  | 'open-app'
  | 'select-family-contact'
  | 'start-video-call'
  | 'allow-permission'
  | 'deny-permission'
  | 'join-call'
  | 'end-call'
  | 'toggle-camera'
  | 'toggle-microphone'
  | 'other'

export type PracticeResult =
  | 'advance'
  | 'finish'
  | 'wrong'
  | 'camera-allowed'
  | 'microphone-allowed'
  | 'permission-denied'
  | 'control-toggled'

export interface PracticeTransition {
  step: number
  permissionStage: PermissionStage
  result: PracticeResult
}

export function transitionPractice(
  step: number,
  permissionStage: PermissionStage,
  action: PracticeAction,
): PracticeTransition {
  if (step === 0 && action === 'open-app') {
    return { step: 1, permissionStage, result: 'advance' }
  }
  if (step === 1 && action === 'select-family-contact') {
    return { step: 2, permissionStage, result: 'advance' }
  }
  if (step === 2 && action === 'start-video-call') {
    return { step: 3, permissionStage: 'camera', result: 'advance' }
  }
  if (step === 3 && action === 'deny-permission') {
    return { step, permissionStage, result: 'permission-denied' }
  }
  if (step === 3 && action === 'allow-permission' && permissionStage === 'camera') {
    return { step, permissionStage: 'microphone', result: 'camera-allowed' }
  }
  if (step === 3 && action === 'allow-permission' && permissionStage === 'microphone') {
    return { step: 4, permissionStage: 'camera', result: 'microphone-allowed' }
  }
  if (step === 4 && action === 'join-call') {
    return { step: 5, permissionStage, result: 'advance' }
  }
  if (step === 5 && action === 'end-call') {
    return { step: 6, permissionStage, result: 'finish' }
  }
  if (step === 5 && (action === 'toggle-camera' || action === 'toggle-microphone')) {
    return { step, permissionStage, result: 'control-toggled' }
  }

  return { step, permissionStage, result: 'wrong' }
}
