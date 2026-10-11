# Dynasty tab audio credits

Regenerate shipped loops (downloads CC0 sources to a temp dir — nothing raw is committed):

```bash
cd apps/dynasty
npm run generate-audio
```

Published under `/dynasty-1581d86a/audio/` after `npm run publish-static`. Loudness targets: **~−16 LUFS** integrated, **true peak ≤ −1 dBTP** (`ffmpeg loudnorm` two-pass). Post-build measurements: `public/audio/loop-loudness.json`.

## Tab background loops (CC0 — OpenGameArt.org)

| Shipped file | App tab | Track | Author | License | Source page |
| --- | --- | --- | --- | --- | --- |
| `loop-standings.mp3` | Standings | Just a Minute | iamoneabe | CC0 1.0 | https://opengameart.org/content/just-a-minute |
| `loop-live.mp3` | Live | StarShooter v2.1 | Centurion_of_war | CC0 1.0 | https://opengameart.org/content/starshooter |
| `loop-drafts.mp3` | Drafts | Fast fun action techno loop 1 | annandistance | CC0 1.0 | https://opengameart.org/content/fast-fun-action-techno-loop-1 |
| `loop-gallery.mp3` | Graphics | Ocean Trance | MintoDog | CC0 1.0 | https://opengameart.org/content/ocean-trance |
| `loop-waiver.mp3` | Waiver Wire Champion | Cynic Battle Loop | Ferk (loop); Alex Smith / cynicmusic | CC0 1.0 | https://opengameart.org/content/cynic-battle-loop |
| `loop-bestgames.mp3` | Best Games | Jamsi Race 8 | Tozan | CC0 1.0 | https://opengameart.org/content/jamsi-race-8 |
| `loop-trades.mp3` | Trades | Parasite (looped) | Kistol | CC0 1.0 | https://opengameart.org/content/parasite |
| `loop-awards.mp3` | Awards | Invincible (Loop) | MintoDog | CC0 1.0 | https://opengameart.org/content/8bit-action-jingle-mini-loop |
| `loop-managers.mp3` | Managers | Chill lofi inspired (loop edit) | qubodup; omfgdude (original) | CC0 1.0 | https://opengameart.org/content/chill-lofi-inspired-loop-edit |

Direct download URLs used by `scripts/build-tab-loops.mjs` are listed in that script’s `TAB_SOURCES` array (OpenGameArt `sites/default/files/…` paths). Awards track is extracted from the CC0 zip on the 8bit Action page.

## Measured loudness (last build)

| File | Integrated LUFS | True peak (dBTP) |
| --- | ---: | ---: |
| `loop-standings.mp3` | −15.20 | −1.01 |
| `loop-live.mp3` | −16.32 | −1.00 |
| `loop-drafts.mp3` | −15.73 | −2.76 |
| `loop-gallery.mp3` | −15.95 | −6.60 |
| `loop-waiver.mp3` | −15.32 | −3.92 |
| `loop-bestgames.mp3` | −15.76 | −1.00 |
| `loop-trades.mp3` | −15.99 | −2.97 |
| `loop-awards.mp3` | −15.96 | −5.20 |
| `loop-managers.mp3` | −15.70 | −1.00 |

## UI click

| File | Use | License |
| --- | --- | --- |
| `click.mp3` | Tab / control click | CC0 1.0 — original FFmpeg sine burst (`scripts/generate-ui-sounds.mjs`) |

## Player behavior

- Default **sound on**; first pointer/keyboard tap unlocks autoplay (`useSound`).
- Bed volume **0.55**; tab change swaps `HTMLAudioElement.src` to that tab’s `loop-*.mp3`.
