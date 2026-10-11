# Dynasty audio credits

Published under `/dynasty-1581d86a/audio/` after `npm run publish-static`. Tab loop files are the same Kevin MacLeod masters shipped in `apps/gwb/public/audio/` (copy from GWB when updating).

## Tab beds (Kevin MacLeod — CC BY 4.0)

| File | Kevin MacLeod track |
| --- | --- |
| `impact-loop.mp3` | Impact Moderato |
| `volatile-loop.mp3` | Volatile Reaction |
| `sneaky-loop.mp3` | Sneaky Snitch |
| `monkeys-loop.mp3` | Monkeys Spinning Monkeys |

License: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). Credit: incompetech.com.

### Dynasty tab → loop (shuffled vs GWB)

Dynasty reuses the four loops across nine tabs. No Dynasty tab uses the same loop as the **matching GWB tab name** (e.g. Dynasty Standings does not use Impact, which GWB uses for Standings).

| Dynasty tab | Loop file | GWB same tab name (reference) |
| --- | --- | --- |
| Standings | `volatile-loop.mp3` | GWB Standings → `impact-loop.mp3` |
| Live | `sneaky-loop.mp3` | GWB Live → `impact-loop.mp3` |
| Drafts | `monkeys-loop.mp3` | *(no GWB tab)* |
| Graphics | `volatile-loop.mp3` | GWB Gallery → `impact-loop.mp3` |
| Waiver Wire Champion | `impact-loop.mp3` | GWB Waiver → `volatile-loop.mp3` |
| Best Games | `sneaky-loop.mp3` | GWB Best Games → `impact-loop.mp3` |
| Trades | `monkeys-loop.mp3` | GWB Trades → `impact-loop.mp3` |
| Awards | `volatile-loop.mp3` | GWB Awards → `impact-loop.mp3` |
| Managers | `sneaky-loop.mp3` | GWB Managers → `impact-loop.mp3` |

GWB-only tabs for reference: Recaps / Frankie / Mulligans use impact, sneaky, or monkeys as documented in `apps/gwb/AUDIO.md`.

## UI sounds

| File | Use | Source |
| --- | --- | --- |
| `click.mp3` | Tab / control click | Same file as GWB (`apps/gwb/public/audio/click.mp3`) |
| `buzzer.mp3` | *(shipped for parity; unused in Dynasty)* | Same file as GWB |

## Behavior (matches GWB)

- Sound defaults **on** (`localStorage` key `dynasty-sound=off` remembers mute).
- Bed volume **0.35**; stinger volume **0.5**.
- First user gesture unlocks autoplay; tab change swaps `HTMLAudioElement.src` to that tab’s loop file.
