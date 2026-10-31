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

## Progress storage

The API stores the single prototype learner's language, lesson step, completion, confidence rating, and accessibility settings in `data/saathi.sqlite`. The browser also caches the learner state for quick display. Set `SAATHI_DATA_DIR` to use another data directory or `PORT` to change the API port.

This prototype has no accounts. Do not put real contact details or other private information into it.
