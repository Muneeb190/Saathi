import type { Language } from '../../shared/learner-state'

export function findSpeechVoice(
  voices: SpeechSynthesisVoice[],
  language: Language,
): SpeechSynthesisVoice | undefined {
  const languagePrefix = language === 'ur' ? 'ur' : 'en'
  const preferredLocales = language === 'ur' ? ['ur-pk', 'ur-in', 'ur'] : ['en-us', 'en-gb']
  const matchesLanguage = (voice: SpeechSynthesisVoice) => {
    const locale = voice.lang.toLowerCase().replaceAll('_', '-')
    return locale === languagePrefix || locale.startsWith(`${languagePrefix}-`)
  }

  for (const locale of preferredLocales) {
    const preferred = voices.find(
      (voice) => voice.lang.toLowerCase().replaceAll('_', '-') === locale,
    )
    if (preferred) return preferred
  }

  return voices.find(matchesLanguage)
}
