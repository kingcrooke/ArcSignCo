import { useCallback, useEffect, useState } from 'react'

export type AppTab = 'standings' | 'gallery' | 'recaps' | 'mulligans'

const TAB_SET = new Set<AppTab>(['standings', 'gallery', 'recaps', 'mulligans'])

function readParams(): { week: number | null; tab: AppTab | null; slide: string | null } {
  const params = new URLSearchParams(window.location.search)
  const weekRaw = params.get('week')
  const tabRaw = params.get('tab')
  const slide = params.get('slide')
  const week = weekRaw ? Number.parseInt(weekRaw, 10) : null
  const tab = tabRaw && TAB_SET.has(tabRaw as AppTab) ? (tabRaw as AppTab) : null
  return {
    week: week && !Number.isNaN(week) ? week : null,
    tab,
    slide,
  }
}

function writeParams(week: number, tab: AppTab, slide?: string | null) {
  const params = new URLSearchParams()
  params.set('week', String(week))
  params.set('tab', tab)
  if (slide) params.set('slide', slide)
  const qs = params.toString()
  const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`
  window.history.replaceState(null, '', url)
}

export function useUrlState(
  week: number,
  setWeek: (w: number) => void,
  tab: AppTab,
  setTab: (t: AppTab) => void,
) {
  const [initialSlide, setInitialSlide] = useState<string | null>(() => readParams().slide)

  useEffect(() => {
    const { week: w, tab: t, slide } = readParams()
    if (w) setWeek(w)
    if (t) setTab(t)
    if (slide) setInitialSlide(slide)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once from URL
  }, [])

  useEffect(() => {
    writeParams(week, tab, initialSlide)
  }, [week, tab, initialSlide])

  const setSlideInUrl = useCallback((slideId: string | null) => {
    setInitialSlide(slideId)
    writeParams(week, tab, slideId)
  }, [week, tab])

  return { initialSlide, setSlideInUrl }
}
