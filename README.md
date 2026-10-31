# Saathi

Saathi is a bilingual, mobile-first learning companion. Its lessons teach people to join a family video call safely, recognize suspicious messages, and review a utility bill before payment. Every interactive exercise is a clearly labelled simulation.

## Lessons

- **Video call:** practise with sample contacts and simulated call controls. No real call, contacts, camera, or microphone are used.
- **Scam Detective:** review fictional WhatsApp-style messages, prize notices, bank alerts, suspicious links, and OTP requests. Choose a safe response and try again after a mistake.
- **Pay Your Utility Bill Safely:** read an invented Pakistan-style sample bill and practise checking the consumer/reference number, due date, and total amount. Sample values are fictional; Saathi never collects financial details or processes a payment.

Progress for each lesson is saved separately. Older saved learner progress is migrated when the app loads.

## Run locally

```sh
npm install
npm run dev
```

The development command starts the Vite app and the Express API together. Open the local URL printed by Vite.

```sh
npm test
npm run build
npm start
```

`npm start` serves the production build and the API from Express after `npm run build`.

## Voice guidance

English guidance uses the browser's installed English speech voice. Urdu lesson instructions and spoken assistant replies use Microsoft Edge's online Read Aloud service with its `ur-IN-GulNeural` voice. This does not require an Azure Speech resource, account, or key, and does not depend on an Urdu voice being installed on the learner's device.

Urdu playback requires an internet connection. The selected fixed lesson instruction, or an assistant reply only when you choose to read it aloud, is sent to Microsoft's online speech service. This uses the Edge Read Aloud service through the community `node-edge-tts` client, not a supported Azure Speech API, so availability and terms may change. No speech-service credentials or payment setup are required.

## Saathi assistant

The assistant is available throughout the app. It receives the question, selected language, current page and lesson step, plus up to eight recent turns in the current tab. The chat is not saved with learner progress. Do not enter passwords, phone numbers, or private contact details. If you use microphone dictation, speech recognition is provided by the browser and may process audio under that browser's own terms; review the transcript before sending.

The chat uses GroqCloud. Create a key in [Groq Console](https://console.groq.com/keys) and configure it on the server; never add it to frontend code or commit it:

```powershell
$env:GROQ_API_KEY = "<your Groq API key>"
# Optional: the default model is openai/gpt-oss-20b.
$env:GROQ_MODEL = "openai/gpt-oss-20b"
npm run dev
```

In deployment, set `GROQ_API_KEY` as a server-side secret. Groq account limits, plan eligibility, billing, and data terms depend on your account and may change; verify them before deployment. Without the key, the assistant stays visible but explains that it is not configured.

## Progress storage

The API stores the single prototype learner's language, lesson step, completion, confidence rating, and accessibility settings in `data/saathi.sqlite`. The browser also caches the learner state for quick display. Set `SAATHI_DATA_DIR` to use another data directory or `PORT` to change the API port.

This prototype has no accounts. Do not put real contact details or other private information into it.
