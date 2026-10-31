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

English guidance uses the browser's installed English speech voice. Urdu Listen and Repeat controls use Azure Speech's `ur-IN-GulNeural` voice, so Urdu playback does not depend on an Urdu voice being installed on the learner's device.

Set the Azure Speech resource key and region in the server environment before starting the app; do not put credentials in client code or commit them:

```powershell
$env:AZURE_SPEECH_KEY = "<your Azure Speech resource key>"
$env:AZURE_SPEECH_REGION = "<your resource region>"
npm run dev
```

In deployment, configure those as server-side secrets. The service receives only the selected, fixed Urdu lesson instruction; learner progress and personal data are not sent to Azure. Azure's current [pricing page](https://azure.microsoft.com/en-us/pricing/details/speech/) lists 500,000 neural TTS characters/month for the free F0 tier; check Microsoft's current terms and your resource tier before use.

## Progress storage

The API stores the single prototype learner's language, lesson step, completion, confidence rating, and accessibility settings in `data/saathi.sqlite`. The browser also caches the learner state for quick display. Set `SAATHI_DATA_DIR` to use another data directory or `PORT` to change the API port.

This prototype has no accounts. Do not put real contact details or other private information into it.
