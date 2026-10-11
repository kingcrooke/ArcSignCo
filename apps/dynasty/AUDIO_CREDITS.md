# Dynasty tab audio credits

Regenerate assets:

```bash
cd apps/dynasty
npm run generate-audio
```

Published under `/dynasty-1581d86a/audio/` after `npm run publish-static`.

## Tab background loops

Each file is **original audio** synthesized in-repo by `scripts/generate-tab-loops.mjs` (FFmpeg `lavfi` sine layers, optional pink noise, tremolo). No third-party samples.

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

## Verification

- **PASS** — Every shipped loop and `click.mp3` has documented CC0 original-work provenance above.
- **FAIL** — Any track without a verified license must not be added; document as FAIL here until replaced.
