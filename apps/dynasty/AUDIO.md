# GWB audio slots

Published under `/gwb-fe006a16/audio/` after `npm run publish-static`. Replace files in `public/audio/` and republish; use new filenames if you change bytes (immutable cache).

| File | Slot | Source (swap later) |
| --- | --- | --- |
| `impact-loop.mp3` | Site bed + Standings + Results decks | Kevin MacLeod — Impact Moderato (CC BY 4.0) |
| `volatile-loop.mp3` | Final Report / receipts lightbox, Waiver Wire Champion tab | Kevin MacLeod — Volatile Reaction (CC BY 4.0) |
| `sneaky-loop.mp3` | Graphics Matchups deck | Kevin MacLeod — Sneaky Snitch (CC BY 4.0) |
| `monkeys-loop.mp3` | Mulligans tab | Kevin MacLeod — Monkeys Spinning Monkeys (CC BY 4.0) |
| `click.mp3` | Tab / week change (sound on) | Generated UI tick (Freesound Breviceps substitute) |
| `buzzer.mp3` | Negative mulligan stinger | Generated buzz (Freesound KevinVG207 substitute) |

The 12 original-cue prompts in the GWB review are for a future AI music pass — do not ship placeholders for those slots until real masters exist.

## Behavior

- Sound defaults **on** (toggle shows on). Only `localStorage` key `gwb-sound=off` remembers mute.
- On load the app tries to play the current tab bed (Standings uses `impact-loop.mp3`; Waiver Wire Champion uses `volatile-loop.mp3`); autoplay failures are ignored. The same default-on, first-tap unlock, and remembered mute apply on every tab.
- If the browser blocks audio, the first `pointerdown`, `keydown`, `touchstart`, or `click` anywhere on the page starts the bed (lazy `src` for non-initial tracks until then). A small “Tap anywhere for sound” hint appears until playback starts.
- Only the active loop/stinger is fetched; other tab/deck loops load when that tab or deck is selected.
