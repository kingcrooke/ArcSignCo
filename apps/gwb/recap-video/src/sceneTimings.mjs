/** Scene timeline for recap (seconds). Kept in sync with public/recap.js */
export const SCENE_TIMINGS = {
  fps: 30,
  width: 1920,
  height: 1080,
  durationSec: 54,
  titleSafe: {
    topPct: 0.1,
    bottomPct: 0.15,
    leftPct: 0.08,
    rightPct: 0.08,
  },
  scenes: [
    { id: 'intro', label: 'GWB intro', startSec: 0, endSec: 5 },
    { id: 'faceoff', label: 'Buffalo face-off', startSec: 5, endSec: 12 },
    { id: 'scorebar', label: 'Running score bar', startSec: 12, endSec: 30 },
    { id: 'performers', label: 'Top performers', startSec: 30, endSec: 38 },
    { id: 'swings', label: 'Swing moments', startSec: 38, endSec: 46 },
    { id: 'final', label: 'Final results card', startSec: 46, endSec: 54 },
  ],
  audio: {
    musicTrack: 'silent',
    voiceoverTrack: 'silent',
    note: 'Replace silent stereo bed in post; scene boundaries align to this file.',
  },
}
