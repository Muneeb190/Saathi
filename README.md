# Saathi

Saathi is a bilingual, mobile-first learning companion. Its first lesson teaches people to join and safely end a family video call in a clearly labelled simulation. The lesson never places a real call or accesses real contacts, a camera, or a microphone.

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

English guidance uses the browser's installed English speech voice. Urdu Listen and Repeat controls use Microsoft Edge's online Read Aloud service with its `ur-IN-GulNeural` voice. It does not require an Azure Speech resource, account, or key, and does not depend on an Urdu voice being installed on the learner's device.

Urdu playback requires an internet connection. The app sends only the selected, fixed Urdu lesson instruction to Microsoft's online speech service; learner progress and personal data are not included. This uses the Edge Read Aloud service through the community `node-edge-tts` client, not a supported Azure Speech API, so availability and terms may change. No speech-service credentials or payment setup are required.

## Progress storage

The API stores the single prototype learner's language, lesson step, completion, confidence rating, and accessibility settings in `data/saathi.sqlite`. The browser also caches the learner state for quick display. Set `SAATHI_DATA_DIR` to use another data directory or `PORT` to change the API port.

This prototype has no accounts. Do not put real contact details or other private information into it.
