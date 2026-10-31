# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React, TypeScript, Tailwind CSS, Lucide, and a small Node/Express API with SQLite, as specified in the brief and confirmed by the user. No account system or paid services.

## Users

Adults who are new to modern smartphone features, especially parents and grandparents around ages 55–70. The primary learner uses an Android smartphone, can make calls and use WhatsApp, prefers Urdu, and benefits from visual, spoken, simple, repeatable guidance. Abilities and experience vary.

## Product Purpose

Saathi helps people learn everyday digital tasks safely and independently, at their own pace and in their own language. Success means a learner leaves with the confidence to repeat a real task on their own device.

## Positioning

Saathi teaches rather than taking over. Its Confidence Loop moves through understanding, demonstration, safe practice, mistake recovery, and independent real-world action.

## Operating Context

The MVP is a mobile-first learning experience for someone practising on a smartphone, with an optional family member helping them learn. The first complete lesson teaches joining and safely ending a family video call.

## Capabilities and Constraints

- The video-call lesson simulates opening a calling app, selecting a sample family contact, recognizing the call control, responding to camera and microphone permission prompts, joining, and ending a practice call.
- Simulation is clearly identified as practice. It must not place calls, connect to WhatsApp, use real contacts, or access a real camera or microphone. Optional assistant dictation may use browser speech recognition only after an explicit user action; Saathi must not store audio.
- Instructions support English and Urdu, with proper right-to-left layout in Urdu. Voice guidance uses browser speech synthesis when available and is never required.
- A global bilingual help assistant can use the current app page and lesson step to offer guidance. Groq access is optional and requires a server-side key; provider usage is subject to account limits, billing, and data terms. Chat must not control the learner's device or request private details.
- Persist selected language, lesson progress/completion, confidence ratings, and accessibility preferences. The confirmed backend is Node/Express with SQLite.
- No registration or real-world messaging. Keep hosted AI optional, disclose provider data handling, and avoid unnecessary infrastructure.
- Every visible control must work; the application must remain usable on mobile, keyboard, and assistive technology.

## Brand Commitments

The product is named “Saathi — Your Digital Confidence Companion.” Its voice is friendly, simple, patient, reassuring, and never shaming. The supplied palette is warm ivory (#FFF9F0), deep teal (#174F4B), soft sage (#DCEBE1), warm orange (#F2A65A), dark charcoal (#263238), and white (#FFFFFF). Use readable English typography and Noto Nastaliq Urdu with suitable fallbacks.

## Evidence on Hand

The product and lesson requirements come from the user-provided Saathi brief. No external customer evidence, brand assets, or approved illustrations were supplied; do not fabricate testimonials, impact claims, or endorsements.

## Product Principles

- Teach people to do tasks themselves instead of doing tasks for them.
- Make practice safe and clearly distinguish it from real-world actions.
- Treat mistakes as expected, recoverable parts of learning.
- Use plain language, visual guidance, and repetition.
- Respect each learner’s pace, language, and differing abilities.

## Accessibility & Inclusion

Use large readable text and touch targets, generous spacing, strong contrast, clear text labels with icons, visible keyboard focus, screen-reader-friendly controls, and text alternatives for audio. Support English and Urdu, with proper RTL behavior and readable Urdu typography. Do not rely on colour alone to communicate meaning.
