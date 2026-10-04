import type { WeekReceipt } from '../lib/receiptOfWeek'

export function ReceiptOfWeek({ receipt }: { receipt: WeekReceipt }) {
  return (
    <div className="rounded-xl border border-[var(--gwb-accent)]/40 bg-[#1a1608] px-4 py-3 text-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-accent)]">
        Receipt of the week
      </p>
      <ul className="space-y-1 text-[var(--gwb-text)]">
        <li>
          Biggest win: {receipt.biggestWin.label} ({receipt.biggestWin.margin.toFixed(1)} pts)
        </li>
        <li>
          Closest game: {receipt.closestGame.label} ({receipt.closestGame.margin.toFixed(1)} pts)
        </li>
        <li>
          High score: {receipt.highestScore.label} ({receipt.highestScore.points.toFixed(1)} pts)
        </li>
      </ul>
    </div>
  )
}
