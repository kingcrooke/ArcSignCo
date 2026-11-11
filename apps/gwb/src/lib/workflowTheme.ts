import type { AppTab } from '../hooks/useUrlState'

/** Accent hues per section — on-brand dark UI, gold stays global brand accent. */
export const GWB_WORKFLOW: Record<
  AppTab,
  { id: AppTab; label: string; cssVar: string }
> = {
  standings: { id: 'standings', label: 'Standings', cssVar: '--gwb-flow-standings' },
  powerrankings: {
    id: 'powerrankings',
    label: 'Power',
    cssVar: '--gwb-flow-powerrankings',
  },
  live: { id: 'live', label: 'Live', cssVar: '--gwb-flow-live' },
  gallery: { id: 'gallery', label: 'Graphics', cssVar: '--gwb-flow-gallery' },
  recaps: { id: 'recaps', label: 'Recaps', cssVar: '--gwb-flow-recaps' },
  mulligans: { id: 'mulligans', label: 'Mulligans', cssVar: '--gwb-flow-mulligans' },
  frankie: { id: 'frankie', label: 'Frankie Zone', cssVar: '--gwb-flow-frankie' },
  waiver: { id: 'waiver', label: 'Waiver', cssVar: '--gwb-flow-waiver' },
  bestgames: { id: 'bestgames', label: 'Best Games', cssVar: '--gwb-flow-bestgames' },
  trades: { id: 'trades', label: 'Trades', cssVar: '--gwb-flow-trades' },
  awards: { id: 'awards', label: 'Awards', cssVar: '--gwb-flow-awards' },
  managers: { id: 'managers', label: 'Managers', cssVar: '--gwb-flow-managers' },
}

export function workflowForTab(tab: AppTab) {
  return GWB_WORKFLOW[tab]
}
