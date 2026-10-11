import type { AppTab } from '../hooks/useUrlState'

declare global {
  interface Window {
    goatcounter?: {
      count: (args: { path: string; event?: boolean }) => void
    }
  }
}

export function trackDynastyTab(tab: AppTab): void {
  window.goatcounter?.count({ path: `/dynasty/${tab}` })
}
