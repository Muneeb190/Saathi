import type { Language } from './learner-state.js'

export const lessonSteps: Record<
  Language,
  Array<{ title: string; instruction: string; hint: string }>
> = {
  en: [
    {
      title: 'Find the video-calling app',
      instruction: 'Look for the video-calling app on the practice phone.',
      hint: 'Choose the app named Video Calls.',
    },
    {
      title: 'Choose a family contact',
      instruction: 'Choose the sample contact named Ammi.',
      hint: 'This is a practice contact. No real contacts are used.',
    },
    {
      title: 'Find the video-call button',
      instruction: 'Look for the video-call button on the contact screen.',
      hint: 'A video icon starts a video call. The voice-call button is different.',
    },
    {
      title: 'Allow camera and microphone',
      instruction: 'Read each practice permission and choose Allow for practice.',
      hint: 'These pretend prompts do not change your real phone settings.',
    },
    {
      title: 'Join the practice call',
      instruction: 'When you are ready, choose Join practice call.',
      hint: 'You are still in a pretend call. Nobody will be contacted.',
    },
    {
      title: 'End the call safely',
      instruction: 'Choose End practice call when you are ready to leave.',
      hint: 'The end-call button is separate from the camera and microphone controls.',
    },
  ],
  ur: [
    {
      title: 'ویڈیو کال کی ایپ تلاش کریں',
      instruction: 'مشق والے فون پر ویڈیو کال کی ایپ تلاش کریں۔',
      hint: 'ویڈیو کالز کے نام والی ایپ چنیں۔',
    },
    {
      title: 'گھر کے فرد کا نام چنیں',
      instruction: 'نمونے کے رابطوں میں امی کا نام چنیں۔',
      hint: 'یہ مشق کا رابطہ ہے۔ اصل رابطے استعمال نہیں ہوتے۔',
    },
    {
      title: 'ویڈیو کال کا بٹن تلاش کریں',
      instruction: 'امی کے رابطے پر ویڈیو کال کا بٹن تلاش کریں۔',
      hint: 'ویڈیو کا نشان ویڈیو کال شروع کرتا ہے۔ آواز کی کال کا بٹن الگ ہے۔',
    },
    {
      title: 'کیمرے اور مائیک کی اجازت دیں',
      instruction: 'مشق کی اجازتیں پڑھیں، پھر اجازت دیں کا بٹن چنیں۔',
      hint: 'یہ فرضی پیغامات آپ کے اصل فون کی ترتیبات نہیں بدلتے۔',
    },
    {
      title: 'مشق کی کال میں شامل ہوں',
      instruction: 'جب تیار ہوں تو مشق کی کال میں شامل ہونے کا بٹن چنیں۔',
      hint: 'یہ ابھی بھی فرضی کال ہے۔ کسی سے رابطہ نہیں ہوگا۔',
    },
    {
      title: 'کال محفوظ طریقے سے ختم کریں',
      instruction: 'جب کال ختم کرنی ہو تو کال ختم کرنے کا بٹن چنیں۔',
      hint: 'کال ختم کرنے کا بٹن کیمرے اور مائیک سے الگ ہے۔',
    },
  ],
}
