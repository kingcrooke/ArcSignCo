import type { AppTab } from '../hooks/useUrlState'

declare global {
  interface Window {
    goatcounter?: {
      count: (args: { path: string; event?: boolean }) => void
    }
  }
}

export function trackGwbTab(tab: AppTab): void {
  window.goatcounter?.count({ path: `/gwb/${tab}` })
}
