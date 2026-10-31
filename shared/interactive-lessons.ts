import type { InteractiveLessonId, Language } from './learner-state.js'

export interface LessonChoice {
  label: string
  correct: boolean
  feedback: string
}

export interface InteractiveLessonStep {
  title: string
  instruction: string
  hint: string
  prompt: string
  sender?: string
  message?: string
  choices: LessonChoice[]
}

export interface SampleBill {
  provider: string
  consumerNumber: string
  referenceNumber: string
  billingPeriod: string
  issueDate: string
  dueDate: string
  units: string
  currentCharges: string
  lateFee: string
  totalDue: string
  labels: {
    sample: string
    consumerNumber: string
    referenceNumber: string
    period: string
    issueDate: string
    dueDate: string
    units: string
    currentCharges: string
    lateFee: string
    totalDue: string
  }
}

export interface InteractiveLesson {
  id: InteractiveLessonId
  title: string
  summary: string
  duration: string
  practiceLabel: string
  practiceNotice: string
  next: string
  finish: string
  retry: string
  completedTitle: string
  completedDescription: string
  back: string
  start: string
  continue: string
  review: string
  completed: string
  progressLabel: string
  showHint: string
  hideHint: string
  listen: string
  repeat: string
  pause: string
  stop: string
  voiceUnavailable: string
  voiceLoading: string
  voiceFailed: string
  safeTitle: string
  safeDescription: string
  choicePrompt: string
  tryAgain: string
  steps: InteractiveLessonStep[]
  bill?: SampleBill
}

export const interactiveLessonIds: InteractiveLessonId[] = [
  'scam-detective',
  'utility-bill',
]

export const interactiveLessons: Record<
  Language,
  Record<InteractiveLessonId, InteractiveLesson>
> = {
  en: {
    'scam-detective': {
      id: 'scam-detective',
      title: 'Scam Detective',
      summary: 'Pause, spot warning signs, and choose a safer next step in sample messages.',
      duration: 'About 6 minutes',
      practiceLabel: 'FICTIONAL MESSAGE PRACTICE',
      practiceNotice: 'Practice only. These invented messages are not real alerts. Never share an OTP, password, or banking details.',
      next: 'Next message',
      finish: 'Finish lesson',
      retry: 'Try this step again',
      completedTitle: 'You spotted the warning signs!',
      completedDescription: 'You practised pausing, checking through a trusted channel, and keeping codes and money safe.',
      back: 'Back to lessons',
      start: 'Start safe practice',
      continue: 'Continue lesson',
      review: 'View lesson summary',
      completed: 'Lesson completed',
      progressLabel: 'messages',
      showHint: 'Show me a hint',
      hideHint: 'Hide hint',
      listen: 'Listen',
      repeat: 'Repeat instruction',
      pause: 'Pause voice',
      stop: 'Stop voice',
      voiceUnavailable: 'Voice guidance is unavailable. You can read each instruction.',
      voiceLoading: 'Preparing voice guidance…',
      voiceFailed: 'Voice guidance could not play. Please read the instruction.',
      safeTitle: 'A safe way to check',
      safeDescription: 'Pause. Do not tap links or share codes. Contact the person or organisation using a number or app you already trust.',
      choicePrompt: 'What is the safest next step?',
      tryAgain: 'Choose another answer',
      steps: [
        {
          title: 'A WhatsApp message asks you to tap a link',
          instruction: 'A new number claims to be a relative and asks you to open a link urgently. Decide what to do before tapping anything.',
          hint: 'A new number and pressure to act quickly are reasons to pause. Verify with a number you already know.',
          prompt: 'WhatsApp · unknown number',
          sender: 'Unverified number · fictional sample',
          message: 'I changed my phone. Open this link now to see my photos: https://photos.example.invalid',
          choices: [
            { label: 'Open the link to check', correct: false, feedback: 'A link from an unverified number could be unsafe. You do not need to open it.' },
            { label: 'Pause and call your relative on their saved number', correct: true, feedback: 'Right. Check through a contact method you already trust before opening a link or replying.' },
            { label: 'Forward the link to family', correct: false, feedback: 'Forwarding can put other people at risk. Verify the sender first and do not spread the link.' },
          ],
        },
        {
          title: 'A prize message asks for a fee',
          instruction: 'A message says you won a prize, but asks you to pay a small fee or share details to receive it.',
          hint: 'A surprise prize plus an upfront fee or request for private details is a warning sign.',
          prompt: 'Prize desk · fictional message',
          sender: 'Prize Claim Centre · unverified',
          message: 'Congratulations! You won Rs 100,000. Pay a claim fee today and send your bank details.',
          choices: [
            { label: 'Pay the fee so the prize is released', correct: false, feedback: 'Do not send money to claim an unexpected prize. The fee request is a strong warning sign.' },
            { label: 'Send only your name and bank details', correct: false, feedback: 'Do not share banking or identity details with an unverified prize message.' },
            { label: 'Do not reply or pay; verify independently or delete it', correct: true, feedback: 'Correct. Unexpected prizes that ask for money or private details should not be trusted.' },
          ],
        },
        {
          title: 'A fake bank alert asks for an OTP',
          instruction: 'A message says your account will be blocked and asks you to reply with a one-time password (OTP).',
          hint: 'An OTP is a secret code. A real support person should not ask you to send it in a message or call.',
          prompt: 'Bank alert · fictional sample',
          sender: 'BANK-SUPPORT · unverified',
          message: 'Your account will be blocked. Reply with the OTP you just received to keep it active.',
          choices: [
            { label: 'Reply with the OTP to protect the account', correct: false, feedback: 'Never share an OTP. Someone who has it may be able to approve an action as you.' },
            { label: 'Do not share the code; contact the bank using its official app or card', correct: true, feedback: 'Exactly. Keep the OTP private and contact the bank through a channel you find independently.' },
            { label: 'Send a screenshot of the message to the sender', correct: false, feedback: 'Do not continue with an unverified sender. Use the bank’s official app or a number on your card.' },
          ],
        },
        {
          title: 'A link says your account will close',
          instruction: 'A message urges you to sign in through a link because your account will supposedly close today.',
          hint: 'Look for urgency, an unexpected sender, and a web address that is not the organisation’s known address.',
          prompt: 'Account notice · fictional sample',
          sender: 'Account Team · unverified',
          message: 'Your account closes today. Sign in here: https://secure-bank.example.invalid',
          choices: [
            { label: 'Use the message link and enter your password', correct: false, feedback: 'Do not enter a password after following an unexpected message link.' },
            { label: 'Open the bank’s official app yourself or call a trusted number', correct: true, feedback: 'Good choice. Reach the organisation independently instead of using a message link.' },
            { label: 'Reply with your account number to ask if it is real', correct: false, feedback: 'Do not send account details to an unverified sender. Check using a trusted channel.' },
          ],
        },
        {
          title: 'Someone asks you to read out a code',
          instruction: 'A caller says they are helping you and asks you to read aloud a code that just arrived on your phone.',
          hint: 'A verification code belongs only to you. Do not read it to a caller, even if they sound helpful.',
          prompt: 'Incoming call · practice scenario',
          sender: 'Caller claims to be “support”',
          message: 'I am fixing your account. Please read me the six-digit code you just received.',
          choices: [
            { label: 'Read the code so support can help', correct: false, feedback: 'Never tell a caller your verification code. End the call if they pressure you.' },
            { label: 'Keep the code private and end the unexpected call', correct: true, feedback: 'That protects your account. Contact the organisation yourself using a trusted number if needed.' },
            { label: 'Ask the caller to send a link instead', correct: false, feedback: 'A different link does not make an unexpected request safe. Keep codes private and verify independently.' },
          ],
        },
      ],
    },
    'utility-bill': {
      id: 'utility-bill',
      title: 'Pay Your Utility Bill Safely',
      summary: 'Read a fictional Pakistan-style bill and practise checking details before a payment.',
      duration: 'About 7 minutes',
      practiceLabel: 'FICTIONAL BILL PRACTICE',
      practiceNotice: 'Practice only. This sample bill is invented. No payment is processed and no financial details are collected.',
      next: 'Next step',
      finish: 'Finish safe practice',
      retry: 'Review the sample again',
      completedTitle: 'You checked before paying!',
      completedDescription: 'You practised reading the bill and checking the details. This lesson did not make a payment.',
      back: 'Back to lessons',
      start: 'Start bill practice',
      continue: 'Continue lesson',
      review: 'View lesson summary',
      completed: 'Lesson completed',
      progressLabel: 'steps',
      showHint: 'Show me a hint',
      hideHint: 'Hide hint',
      listen: 'Listen',
      repeat: 'Repeat instruction',
      pause: 'Pause voice',
      stop: 'Stop voice',
      voiceUnavailable: 'Voice guidance is unavailable. You can read each instruction.',
      voiceLoading: 'Preparing voice guidance…',
      voiceFailed: 'Voice guidance could not play. Please read the instruction.',
      safeTitle: 'Your safety comes first',
      safeDescription: 'Use only official payment channels. Check the biller, consumer/reference number, due date, and total. Stop if anything does not match.',
      choicePrompt: 'Choose the safest answer:',
      tryAgain: 'Choose another answer',
      bill: {
        provider: 'Saathi Demo Power (fictional)',
        consumerNumber: '0000-0000-0000',
        referenceNumber: 'DEMO-REF-000000',
        billingPeriod: 'October 2026',
        issueDate: '20 October 2026',
        dueDate: '30 November 2026',
        units: '000 kWh',
        currentCharges: 'PKR 2,400.00',
        lateFee: 'PKR 50.00',
        totalDue: 'PKR 2,450.00',
        labels: {
          sample: 'FICTIONAL SAMPLE — NOT A REAL BILL',
          consumerNumber: 'Consumer number',
          referenceNumber: 'Reference number',
          period: 'Billing period',
          issueDate: 'Issue date',
          dueDate: 'Due date',
          units: 'Units used',
          currentCharges: 'Current charges',
          lateFee: 'Late fee after due date',
          totalDue: 'Total amount due',
        },
      },
      steps: [
        {
          title: 'Find the consumer number',
          instruction: 'On the sample bill, find the consumer number. It identifies the utility connection; it is not an OTP or password.',
          hint: 'Look for the label “Consumer number”. The number shown is fictional and for this exercise only.',
          prompt: 'Which label helps identify this utility connection?',
          choices: [
            { label: 'Consumer number', correct: true, feedback: 'Correct. A consumer number identifies the utility connection on this fictional bill.' },
            { label: 'Total amount due', correct: false, feedback: 'That is the amount to review, not the identifier for the connection.' },
            { label: 'OTP or password', correct: false, feedback: 'A bill should not ask you to share an OTP or password. Never share those codes.' },
          ],
        },
        {
          title: 'Check the billing period and due date',
          instruction: 'Find the billing period and due date. A due date tells you when the bill should be paid to avoid a late fee.',
          hint: 'This invented sample is for October 2026 and shows a due date of 30 November 2026.',
          prompt: 'What should you check before deciding when to pay?',
          choices: [
            { label: 'The billing period and due date', correct: true, feedback: 'Yes. Make sure the bill is for the right period and note its due date.' },
            { label: 'Only the message that says “pay urgently”', correct: false, feedback: 'A message can be misleading. Check the date printed on the bill through a trusted channel.' },
            { label: 'The sender’s request for an OTP', correct: false, feedback: 'A bill payment does not require sharing an OTP with a person. Keep codes private.' },
          ],
        },
        {
          title: 'Understand the total amount',
          instruction: 'Compare current charges and any late fee with the total amount due. Confirm the amount in the official payment channel before continuing.',
          hint: 'The fictional sample shows PKR 2,400 in current charges plus a PKR 50 late fee, for PKR 2,450 total.',
          prompt: 'Which amount should you carefully verify in a payment app?',
          choices: [
            { label: 'The total amount due: PKR 2,450.00', correct: true, feedback: 'Right. Check the full total, including any fee, against the bill before confirming.' },
            { label: 'A round amount guessed from last month', correct: false, feedback: 'Bills can change. Never guess; compare the exact total shown on the current bill.' },
            { label: 'Any amount a caller tells you to enter', correct: false, feedback: 'Do not rely on an unexpected caller. Verify the amount directly from the bill and official channel.' },
          ],
        },
        {
          title: 'Choose the bill-payment section',
          instruction: 'In a payment app you opened yourself, choose the utility-bill section. This screen is only a practice menu.',
          hint: 'Choose utility bills, not a transfer to a person or a link sent in a message.',
          prompt: 'Which practice menu is appropriate for a utility bill?',
          choices: [
            { label: 'Utility bills', correct: true, feedback: 'Correct. In real life, use a payment channel you opened yourself and check the biller name.' },
            { label: 'Send money to a phone number', correct: false, feedback: 'A utility bill should not be paid by sending money to an unknown personal number.' },
            { label: 'Open a payment link from an unexpected message', correct: false, feedback: 'Do not use unexpected payment links. Open the official app or service yourself.' },
          ],
        },
        {
          title: 'Match the reference and amount',
          instruction: 'Compare the biller, consumer or reference number, due date, and total shown before you confirm anything.',
          hint: 'If even one detail differs, stop. Do not continue; check the bill or contact the utility using an official channel.',
          prompt: 'The practice screen shows the same fictional number and PKR 2,450. What should you do?',
          choices: [
            { label: 'Check that biller, reference, due date, and amount all match', correct: true, feedback: 'Yes. Carefully match every detail. Stop and seek trusted help if anything is different.' },
            { label: 'Ignore a different reference number if the name looks similar', correct: false, feedback: 'A wrong number could pay someone else’s bill. Stop if the reference does not match exactly.' },
            { label: 'Confirm even if the amount is higher', correct: false, feedback: 'Do not confirm an unexpected amount. Stop and verify it through an official channel.' },
          ],
        },
        {
          title: 'Stop before any real payment',
          instruction: 'You have finished the safe checks. In this lesson, stop at the review screen. No money is transferred here.',
          hint: 'In real life, only confirm after every detail matches and you are in the official channel. Never share an OTP with another person.',
          prompt: 'What does finishing this practice lesson do?',
          choices: [
            { label: 'End the practice; no payment is made', correct: true, feedback: 'Exactly. Saathi only teaches with a simulation. It never processes a real payment.' },
            { label: 'Expect the practice bill to be paid automatically', correct: false, feedback: 'There is no payment in this lesson. Do not enter financial details or expect a transaction.' },
            { label: 'Share an OTP with the helper', correct: false, feedback: 'Never share an OTP with anyone. Keep verification codes private.' },
          ],
        },
      ],
    },
  },
  ur: {
    'scam-detective': {
      id: 'scam-detective',
      title: 'دھوکے باز پیغام پہچانیں',
      summary: 'رکیں، خطرے کی نشانیاں دیکھیں، اور فرضی پیغامات میں محفوظ قدم چنیں۔',
      duration: 'تقریباً ۶ منٹ',
      practiceLabel: 'فرضی پیغامات کی مشق',
      practiceNotice: 'یہ صرف مشق ہے۔ پیغامات فرضی ہیں۔ او ٹی پی، پاس ورڈ یا بینک کی معلومات کبھی نہ دیں۔',
      next: 'اگلا پیغام',
      finish: 'سبق مکمل کریں',
      retry: 'اس قدم کی دوبارہ کوشش کریں',
      completedTitle: 'آپ نے خطرے کی نشانیاں پہچان لیں!',
      completedDescription: 'آپ نے رکنا، قابلِ اعتماد ذریعے سے تصدیق کرنا، اور خفیہ کوڈ اور پیسے محفوظ رکھنا سیکھا۔',
      back: 'اسباق پر واپس جائیں',
      start: 'محفوظ مشق شروع کریں',
      continue: 'سبق جاری رکھیں',
      review: 'سبق کا خلاصہ دیکھیں',
      completed: 'سبق مکمل ہو گیا',
      progressLabel: 'پیغامات',
      showHint: 'اشارہ دکھائیں',
      hideHint: 'اشارہ چھپائیں',
      listen: 'سنیں',
      repeat: 'ہدایت دوبارہ سنیں',
      pause: 'آواز روکیں',
      stop: 'آواز بند کریں',
      voiceUnavailable: 'آواز دستیاب نہیں۔ آپ ہدایت پڑھ سکتے ہیں۔',
      voiceLoading: 'آواز تیار ہو رہی ہے…',
      voiceFailed: 'آواز نہیں چل سکی۔ براہِ کرم ہدایت پڑھیں۔',
      safeTitle: 'تصدیق کا محفوظ طریقہ',
      safeDescription: 'رکیں۔ لنک نہ کھولیں اور کوڈ نہ دیں۔ پہلے سے معلوم نمبر یا قابلِ اعتماد ایپ سے رابطہ کر کے تصدیق کریں۔',
      choicePrompt: 'سب سے محفوظ اگلا قدم کیا ہے؟',
      tryAgain: 'دوسرا جواب چنیں',
      steps: [
        {
          title: 'واٹس ایپ پر لنک والا پیغام',
          instruction: 'ایک نیا نمبر خود کو رشتہ دار بتا کر فوری لنک کھولنے کو کہتا ہے۔ کچھ دبانے سے پہلے فیصلہ کریں۔',
          hint: 'نیا نمبر اور جلدی کا دباؤ خطرے کی نشانیاں ہیں۔ پہلے پہلے سے معلوم نمبر پر تصدیق کریں۔',
          prompt: 'واٹس ایپ · نامعلوم نمبر',
          sender: 'نامعلوم نمبر · فرضی نمونہ',
          message: 'میرا نیا فون ہے۔ تصویریں دیکھنے کے لیے یہ لنک ابھی کھولیں: https://photos.example.invalid',
          choices: [
            { label: 'تصویر دیکھنے کے لیے لنک کھولیں', correct: false, feedback: 'نامعلوم نمبر کا لنک خطرناک ہو سکتا ہے۔ اسے کھولنے کی ضرورت نہیں۔' },
            { label: 'رکیں اور محفوظ شدہ نمبر پر رشتہ دار کو فون کریں', correct: true, feedback: 'درست۔ لنک کھولنے یا جواب دینے سے پہلے پہلے سے قابلِ اعتماد ذریعے سے تصدیق کریں۔' },
            { label: 'لنک گھر والوں کو بھیج دیں', correct: false, feedback: 'آگے بھیجنے سے دوسروں کو خطرہ ہو سکتا ہے۔ پہلے بھیجنے والے کی تصدیق کریں۔' },
          ],
        },
        {
          title: 'انعام کا جعلی پیغام فیس مانگے',
          instruction: 'پیغام کہتا ہے کہ آپ نے انعام جیتا ہے، مگر اسے لینے کے لیے فیس یا ذاتی معلومات مانگتا ہے۔',
          hint: 'اچانک انعام کے ساتھ پہلے پیسے یا نجی معلومات مانگنا خطرے کی نشانی ہے۔',
          prompt: 'انعامی مرکز · فرضی پیغام',
          sender: 'انعامی مرکز · غیر تصدیق شدہ',
          message: 'مبارک ہو! آپ نے ۱۰۰،۰۰۰ روپے جیتے۔ انعام لینے کے لیے آج فیس دیں اور بینک کی تفصیل بھیجیں۔',
          choices: [
            { label: 'انعام لینے کے لیے فیس بھیجیں', correct: false, feedback: 'اچانک ملنے والے انعام کے لیے رقم نہ بھیجیں۔ فیس مانگنا خطرے کی بڑی نشانی ہے۔' },
            { label: 'صرف نام اور بینک کی تفصیل بھیجیں', correct: false, feedback: 'غیر تصدیق شدہ انعامی پیغام کو بینک یا شناختی معلومات نہ دیں۔' },
            { label: 'جواب یا رقم نہ بھیجیں؛ خود تصدیق کریں یا پیغام مٹا دیں', correct: true, feedback: 'درست۔ غیر متوقع انعام کے بدلے رقم یا نجی معلومات نہ دیں۔' },
          ],
        },
        {
          title: 'بینک کا جعلی پیغام او ٹی پی مانگے',
          instruction: 'پیغام کہتا ہے کہ اکاؤنٹ بند ہو جائے گا اور ایک وقتی پاس ورڈ (او ٹی پی) جواب میں بھیجنے کو کہتا ہے۔',
          hint: 'او ٹی پی خفیہ کوڈ ہے۔ کوئی بھی اسے پیغام یا فون پر مانگے تو نہ دیں۔',
          prompt: 'بینک کا پیغام · فرضی نمونہ',
          sender: 'BANK-SUPPORT · غیر تصدیق شدہ',
          message: 'آپ کا اکاؤنٹ بند ہو جائے گا۔ اسے چلتا رکھنے کے لیے ابھی موصول ہونے والا او ٹی پی بھیجیں۔',
          choices: [
            { label: 'اکاؤنٹ بچانے کے لیے او ٹی پی بھیجیں', correct: false, feedback: 'او ٹی پی کبھی نہ بتائیں۔ کوئی اسے آپ کی طرف سے کام کی منظوری کے لیے استعمال کر سکتا ہے۔' },
            { label: 'کوڈ نہ دیں؛ بینک کی سرکاری ایپ یا کارڈ پر درج نمبر سے رابطہ کریں', correct: true, feedback: 'بالکل درست۔ کوڈ خفیہ رکھیں اور خود معلوم کیے گئے ذریعے سے بینک سے رابطہ کریں۔' },
            { label: 'بھیجنے والے کو پیغام کا اسکرین شاٹ بھیجیں', correct: false, feedback: 'غیر تصدیق شدہ بھیجنے والے سے بات جاری نہ رکھیں۔ سرکاری ایپ یا کارڈ پر درج نمبر استعمال کریں۔' },
          ],
        },
        {
          title: 'لنک کہتا ہے اکاؤنٹ بند ہو جائے گا',
          instruction: 'پیغام جلدی میں لنک سے سائن اِن کرنے کو کہتا ہے ورنہ اکاؤنٹ آج بند ہو جائے گا۔',
          hint: 'جلدی کا دباؤ، نامعلوم بھیجنے والا، اور انجان ویب پتہ خطرے کی نشانیاں ہیں۔',
          prompt: 'اکاؤنٹ کی اطلاع · فرضی نمونہ',
          sender: 'اکاؤنٹ ٹیم · غیر تصدیق شدہ',
          message: 'آپ کا اکاؤنٹ آج بند ہوگا۔ یہاں سائن اِن کریں: https://secure-bank.example.invalid',
          choices: [
            { label: 'پیغام کا لنک کھول کر پاس ورڈ لکھیں', correct: false, feedback: 'غیر متوقع پیغام کے لنک سے پاس ورڈ نہ لکھیں۔' },
            { label: 'سرکاری ایپ خود کھولیں یا قابلِ اعتماد نمبر پر فون کریں', correct: true, feedback: 'اچھا انتخاب۔ پیغام کا لنک استعمال کرنے کے بجائے ادارے سے خود رابطہ کریں۔' },
            { label: 'حقیقت پوچھنے کے لیے اکاؤنٹ نمبر جواب میں بھیجیں', correct: false, feedback: 'غیر تصدیق شدہ بھیجنے والے کو اکاؤنٹ کی تفصیل نہ دیں۔ قابلِ اعتماد ذریعے سے تصدیق کریں۔' },
          ],
        },
        {
          title: 'کوئی فون پر کوڈ مانگے',
          instruction: 'فون کرنے والا کہتا ہے کہ وہ مدد کر رہا ہے اور آپ کے فون پر آنے والا کوڈ بتانے کو کہتا ہے۔',
          hint: 'تصدیقی کوڈ صرف آپ کے لیے ہے۔ مددگار لگنے والا شخص بھی اسے نہ مانگے۔',
          prompt: 'آنے والی کال · مشق',
          sender: 'فون کرنے والا خود کو مددگار کہتا ہے',
          message: 'میں آپ کا اکاؤنٹ ٹھیک کر رہا ہوں۔ ابھی آنے والا چھ ہندسوں کا کوڈ پڑھ دیں۔',
          choices: [
            { label: 'مدد کے لیے کوڈ پڑھ دیں', correct: false, feedback: 'فون کرنے والے کو تصدیقی کوڈ نہ بتائیں۔ دباؤ ڈالے تو کال بند کر دیں۔' },
            { label: 'کوڈ خفیہ رکھیں اور غیر متوقع کال بند کریں', correct: true, feedback: 'آپ نے اکاؤنٹ محفوظ رکھا۔ ضرورت ہو تو قابلِ اعتماد نمبر سے خود رابطہ کریں۔' },
            { label: 'کہیں کہ وہ اس کے بجائے لنک بھیج دے', correct: false, feedback: 'لنک مانگنے سے غیر متوقع درخواست محفوظ نہیں ہو جاتی۔ کوڈ خفیہ رکھیں اور خود تصدیق کریں۔' },
          ],
        },
      ],
    },
    'utility-bill': {
      id: 'utility-bill',
      title: 'یوٹیلیٹی بل محفوظ طریقے سے ادا کریں',
      summary: 'پاکستانی طرز کا فرضی بل پڑھیں اور ادائیگی سے پہلے تفصیل ملانا سیکھیں۔',
      duration: 'تقریباً ۷ منٹ',
      practiceLabel: 'فرضی بل کی مشق',
      practiceNotice: 'یہ صرف مشق ہے۔ بل فرضی ہے۔ کوئی ادائیگی نہیں ہوگی اور مالی معلومات نہیں لی جائیں گی۔',
      next: 'اگلا قدم',
      finish: 'محفوظ مشق مکمل کریں',
      retry: 'نمونہ دوبارہ دیکھیں',
      completedTitle: 'آپ نے ادائیگی سے پہلے جانچ لیا!',
      completedDescription: 'آپ نے بل پڑھنا اور تفصیل ملانا سیکھا۔ اس سبق میں کوئی ادائیگی نہیں ہوئی۔',
      back: 'اسباق پر واپس جائیں',
      start: 'بل کی مشق شروع کریں',
      continue: 'سبق جاری رکھیں',
      review: 'سبق کا خلاصہ دیکھیں',
      completed: 'سبق مکمل ہو گیا',
      progressLabel: 'قدم',
      showHint: 'اشارہ دکھائیں',
      hideHint: 'اشارہ چھپائیں',
      listen: 'سنیں',
      repeat: 'ہدایت دوبارہ سنیں',
      pause: 'آواز روکیں',
      stop: 'آواز بند کریں',
      voiceUnavailable: 'آواز دستیاب نہیں۔ آپ ہدایت پڑھ سکتے ہیں۔',
      voiceLoading: 'آواز تیار ہو رہی ہے…',
      voiceFailed: 'آواز نہیں چل سکی۔ براہِ کرم ہدایت پڑھیں۔',
      safeTitle: 'آپ کی حفاظت پہلے',
      safeDescription: 'صرف سرکاری ذریعے سے ادائیگی کریں۔ بل دینے والے، صارف یا حوالہ نمبر، آخری تاریخ اور کل رقم کو ملائیں۔ فرق ہو تو رک جائیں۔',
      choicePrompt: 'سب سے محفوظ جواب چنیں:',
      tryAgain: 'دوسرا جواب چنیں',
      bill: {
        provider: 'ساتھی ڈیمو بجلی (فرضی ادارہ)',
        consumerNumber: '0000-0000-0000',
        referenceNumber: 'DEMO-REF-000000',
        billingPeriod: 'اکتوبر ۲۰۲۶',
        issueDate: '۲۰ اکتوبر ۲۰۲۶',
        dueDate: '۳۰ نومبر ۲۰۲۶',
        units: '۰۰۰ کلو واٹ گھنٹے',
        currentCharges: '۲،۴۰۰ روپے',
        lateFee: '۵۰ روپے',
        totalDue: '۲،۴۵۰ روپے',
        labels: {
          sample: 'فرضی نمونہ — اصل بل نہیں',
          consumerNumber: 'صارف نمبر',
          referenceNumber: 'حوالہ نمبر',
          period: 'بل کا مہینہ',
          issueDate: 'جاری ہونے کی تاریخ',
          dueDate: 'آخری تاریخ',
          units: 'استعمال شدہ یونٹ',
          currentCharges: 'موجودہ چارجز',
          lateFee: 'تاخیر کا جرمانہ',
          totalDue: 'کل واجب الادا رقم',
        },
      },
      steps: [
        {
          title: 'صارف نمبر تلاش کریں',
          instruction: 'نمونہ بل پر صارف نمبر تلاش کریں۔ یہ بجلی یا گیس کے کنکشن کی شناخت ہے، او ٹی پی یا پاس ورڈ نہیں۔',
          hint: '”صارف نمبر“ کا لیبل دیکھیں۔ یہاں دکھایا گیا نمبر صرف فرضی مشق کے لیے ہے۔',
          prompt: 'کنکشن کی شناخت کے لیے کون سا لیبل دیکھیں گے؟',
          choices: [
            { label: 'صارف نمبر', correct: true, feedback: 'درست۔ فرضی بل پر صارف نمبر کنکشن کی شناخت بتاتا ہے۔' },
            { label: 'کل واجب الادا رقم', correct: false, feedback: 'یہ ادا کرنے کی رقم ہے، کنکشن کی شناخت نہیں۔' },
            { label: 'او ٹی پی یا پاس ورڈ', correct: false, feedback: 'بل میں او ٹی پی یا پاس ورڈ کسی کے ساتھ بانٹنے کو نہیں کہنا چاہیے۔' },
          ],
        },
        {
          title: 'بل کا مہینہ اور آخری تاریخ دیکھیں',
          instruction: 'بل کا مہینہ اور آخری تاریخ دیکھیں۔ آخری تاریخ کے بعد تاخیر کا جرمانہ لگ سکتا ہے۔',
          hint: 'اس فرضی نمونے کا مہینہ اکتوبر ۲۰۲۶ اور آخری تاریخ ۳۰ نومبر ۲۰۲۶ ہے۔',
          prompt: 'ادائیگی کا وقت طے کرنے سے پہلے کیا دیکھیں گے؟',
          choices: [
            { label: 'بل کا مہینہ اور آخری تاریخ', correct: true, feedback: 'جی ہاں۔ تصدیق کریں کہ بل درست مہینے کا ہے اور آخری تاریخ نوٹ کریں۔' },
            { label: 'صرف پیغام میں ”فوری ادائیگی“ کی بات', correct: false, feedback: 'پیغام غلط ہو سکتا ہے۔ قابلِ اعتماد ذریعے سے بل پر لکھی تاریخ دیکھیں۔' },
            { label: 'بھیجنے والے کی او ٹی پی مانگنے کی بات', correct: false, feedback: 'کسی شخص کو او ٹی پی نہ بتائیں۔ کوڈ ہمیشہ خفیہ رکھیں۔' },
          ],
        },
        {
          title: 'کل رقم سمجھیں',
          instruction: 'موجودہ چارجز اور تاخیر کا جرمانہ دیکھ کر کل رقم ملائیں۔ ادائیگی کے سرکاری ذریعے میں رقم پھر سے دیکھیں۔',
          hint: 'فرضی بل میں ۲،۴۰۰ روپے کے چارجز اور ۵۰ روپے جرمانہ، کل ۲،۴۵۰ روپے ہیں۔',
          prompt: 'ادائیگی سے پہلے کس رقم کی تصدیق ضروری ہے؟',
          choices: [
            { label: 'کل رقم: ۲،۴۵۰ روپے', correct: true, feedback: 'درست۔ تصدیق سے پہلے جرمانے سمیت پوری رقم بل سے ملائیں۔' },
            { label: 'پچھلے مہینے کے اندازے کے مطابق گول رقم', correct: false, feedback: 'ہر مہینے کا بل مختلف ہو سکتا ہے۔ اندازہ نہ لگائیں، موجودہ بل دیکھیں۔' },
            { label: 'فون کرنے والا جو رقم بتائے', correct: false, feedback: 'غیر متوقع فون کرنے والے پر بھروسا نہ کریں۔ بل اور سرکاری ذریعے سے خود رقم دیکھیں۔' },
          ],
        },
        {
          title: 'بلوں کی ادائیگی والا حصہ چنیں',
          instruction: 'اپنی طرف سے کھولی گئی ادائیگی ایپ میں یوٹیلیٹی بلوں کا حصہ چنیں۔ یہ اسکرین صرف مشق ہے۔',
          hint: 'یوٹیلیٹی بل چنیں، کسی شخص کو رقم بھیجنے یا پیغام کے لنک سے بچیں۔',
          prompt: 'یوٹیلیٹی بل کے لیے کون سا مشق والا حصہ درست ہے؟',
          choices: [
            { label: 'یوٹیلیٹی بل', correct: true, feedback: 'درست۔ حقیقت میں بھی خود کھولے گئے سرکاری ذریعے اور بل دینے والے کا نام جانچیں۔' },
            { label: 'فون نمبر پر رقم بھیجیں', correct: false, feedback: 'یوٹیلیٹی بل کے لیے کسی نامعلوم شخص کے ذاتی نمبر پر رقم نہ بھیجیں۔' },
            { label: 'نامعلوم پیغام کا ادائیگی لنک کھولیں', correct: false, feedback: 'غیر متوقع لنک استعمال نہ کریں۔ سرکاری ایپ یا سروس خود کھولیں۔' },
          ],
        },
        {
          title: 'حوالہ نمبر اور رقم ملائیں',
          instruction: 'تصدیق سے پہلے بل دینے والے، صارف یا حوالہ نمبر، آخری تاریخ اور کل رقم کا موازنہ کریں۔',
          hint: 'ایک بات بھی مختلف ہو تو رک جائیں۔ ادائیگی نہ کریں، پہلے بل یا سرکاری ذریعے سے تصدیق کریں۔',
          prompt: 'مشق کی اسکرین پر وہی فرضی نمبر اور ۲،۴۵۰ روپے ہیں۔ کیا کریں گے؟',
          choices: [
            { label: 'بل دینے والے، نمبر، تاریخ اور رقم سب ملائیں', correct: true, feedback: 'جی ہاں۔ ہر تفصیل احتیاط سے ملائیں۔ فرق ہو تو رک کر قابلِ اعتماد مدد لیں۔' },
            { label: 'نام ملتا ہو تو مختلف حوالہ نمبر نظرانداز کریں', correct: false, feedback: 'غلط نمبر سے کسی اور کا بل ادا ہو سکتا ہے۔ نمبر مختلف ہو تو رک جائیں۔' },
            { label: 'رقم زیادہ ہو تب بھی تصدیق کر دیں', correct: false, feedback: 'غیر متوقع رقم پر تصدیق نہ کریں۔ سرکاری ذریعے سے پہلے جانچیں۔' },
          ],
        },
        {
          title: 'اصل ادائیگی سے پہلے رکیں',
          instruction: 'محفوظ جانچ مکمل ہو گئی۔ اس سبق میں جائزے کی اسکرین پر رک جائیں؛ یہاں رقم منتقل نہیں ہوتی۔',
          hint: 'حقیقت میں ہر بات ملنے اور سرکاری ذریعے کی تصدیق کے بعد ہی فیصلہ کریں۔ او ٹی پی کسی شخص کو نہ بتائیں۔',
          prompt: 'اس مشق کو ختم کرنے سے کیا ہوگا؟',
          choices: [
            { label: 'مشق ختم ہوگی؛ کوئی ادائیگی نہیں ہوگی', correct: true, feedback: 'بالکل درست۔ ساتھی صرف مشق کراتا ہے، حقیقی ادائیگی نہیں کرتا۔' },
            { label: 'توقع کریں کہ مشق کا بل خود ادا ہو جائے گا', correct: false, feedback: 'یہاں کوئی ادائیگی نہیں ہے۔ مالی تفصیل نہ لکھیں اور رقم منتقل ہونے کی توقع نہ رکھیں۔' },
            { label: 'مددگار کو او ٹی پی بتائیں', correct: false, feedback: 'او ٹی پی کسی کو نہ بتائیں۔ تصدیقی کوڈ خفیہ رکھیں۔' },
          ],
        },
      ],
    },
  },
}
