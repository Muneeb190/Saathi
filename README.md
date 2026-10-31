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

The development command starts the Vite app and the Express API together. Open the local URL printed by Vite. The browser app is in `frontend/`, the API service is in `backend/`, and their shared lesson data and types are in `shared/`.

```sh
npm test
npm run build
```

## Deploy frontend and backend separately

Deploy the repository as two projects/services. Each app folder has its own `package.json`; keep the repository root as the build context so both projects can access `shared/`.

For Vercel, import the repository with its root directory set to the repository root. The root `vercel.json` installs and builds `frontend/` and publishes `frontend/dist`. Set `VITE_API_BASE_URL` in Vercel to the public backend URL (without a trailing slash); see `frontend/.env.example`.

For the backend service, use the repository root as its build context and set install, build, and start commands to `npm --prefix backend install`, `npm --prefix backend run build`, and `npm --prefix backend start`. Add the variables from `backend/.env.example` to the hosting provider's environment settings. Set `FRONTEND_ORIGIN` to the exact deployed frontend origin so browsers can call the API. Keep `GROQ_API_KEY` only in the backend environment, never in frontend variables.

The backend listens on the host-provided `PORT` and `0.0.0.0`, and serves API routes only. Vite proxies `/api` to the local backend during development.

The current SQLite file is local to the backend and may be erased by hosts with ephemeral filesystems. Configure persistent storage or replace it with a hosted database before relying on saved progress in production. This prototype also has no accounts and stores one shared learner state; it is not suitable for multiple public users as-is.

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

In deployment, set `GROQ_API_KEY` as a backend-only secret. Groq account limits, plan eligibility, billing, and data terms depend on your account and may change; verify them before deployment. Without the key, the assistant stays visible but explains that it is not configured.

## Progress storage

The API stores the single prototype learner's language, lesson step, completion, confidence rating, and accessibility settings in `data/saathi.sqlite` relative to the backend process's working directory. The browser also caches the learner state for quick display. Set `SAATHI_DATA_DIR` to use another data directory or `PORT` to change the API port.

This prototype has no accounts. Do not put real contact details or other private information into it.
