# Dynasty tab audio credits

All background loops and UI ticks for `apps/dynasty` are **distinct from the GWB app** (`impact-loop`, `volatile-loop`, `sneaky-loop`, `monkeys-loop`, etc.).

Regenerate assets:

```bash
cd apps/dynasty
npm run generate-audio
```

Published under `/dynasty-1581d86a/audio/` after `npm run publish-static`. If you change bytes, use new filenames so CDN immutable cache stays correct.

## Tab background loops (per `useSound` / `TAB_LOOPS`)

Each file is **original audio** synthesized in-repo by `scripts/generate-tab-loops.mjs` (FFmpeg `lavfi` sine layers, optional pink noise, `apulsator` tremolo). No third-party samples.

| File | Tab | License |
| --- | --- | --- |
| `loop-standings.mp3` | Standings | **CC0 1.0** — original work, generated in this repository |
| `loop-live.mp3` | Live | **CC0 1.0** — original work, generated in this repository |
| `loop-drafts.mp3` | Drafts | **CC0 1.0** — original work, generated in this repository |
| `loop-gallery.mp3` | Graphics | **CC0 1.0** — original work, generated in this repository |
| `loop-waiver.mp3` | Waiver Wire Champion | **CC0 1.0** — original work, generated in this repository |
| `loop-bestgames.mp3` | Best Games | **CC0 1.0** — original work, generated in this repository |
| `loop-trades.mp3` | Trades | **CC0 1.0** — original work, generated in this repository |
| `loop-awards.mp3` | Awards | **CC0 1.0** — original work, generated in this repository |
| `loop-managers.mp3` | Managers | **CC0 1.0** — original work, generated in this repository |

## UI stingers

| File | Use | License |
| --- | --- | --- |
| `click.mp3` | Tab / control click (sound on) | **CC0 1.0** — original work via `scripts/generate-ui-sounds.mjs` (FFmpeg sine burst) |

## Removed / not used

| Item | Status |
| --- | --- |
| GWB Kevin MacLeod loops (`impact-loop`, `volatile-loop`, `sneaky-loop`, `monkeys-loop`) | **Not shipped** in Dynasty |
| `buzzer.mp3` (GWB mulligan stinger) | **Not used** in Dynasty |

## Verification

- **PASS** — Every shipped loop and `click.mp3` has a documented CC0 original-work provenance above.
- **FAIL** — Any track without a verified license must not be added; document as FAIL here until replaced.
