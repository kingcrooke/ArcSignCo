import {
  fetchTradeHistoryChain,
  type LeagueTradeBundle,
} from './sleeperApi'

interface CachedChain {
  bundles: LeagueTradeBundle[]
  priorSeasonsFailed: boolean
}

let memory: CachedChain | null = null
let inflight: Promise<CachedChain> | null = null

/** In-memory cache for prior-season Sleeper chain (Trades / Managers tabs). */
export async function loadTradeHistoryChain(
  leagueId: string,
): Promise<CachedChain> {
  if (memory?.bundles.length) return memory
  if (inflight) return inflight
  inflight = fetchTradeHistoryChain(leagueId).then((result) => {
    memory = {
      bundles: result.bundles,
      priorSeasonsFailed: result.priorSeasonsFailed,
    }
    inflight = null
    return memory
  })
  return inflight
}
