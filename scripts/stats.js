const roundCents = value => Math.round(value * 100) / 100

export const totalAmount = records =>
  roundCents(records.reduce((sum, record) => sum + record.amount, 0))

export function topCategory(records) {
  const tally = {}
  for (const { category, amount } of records) {
    tally[category] ??= { count: 0, amount: 0 }
    tally[category].count += 1
    tally[category].amount += amount
  }
  const ranked = Object.entries(tally).sort(
    ([, a], [, b]) => b.count - a.count || b.amount - a.amount
  )
  return ranked.length ? ranked[0][0] : null
}

export function lastSevenDays(records, today) {
  const [year, month, day] = today.split('-').map(Number)
  const days = []
  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(Date.UTC(year, month - 1, day - offset)).toISOString().slice(0, 10)
    const total = records.filter(record => record.date === date)
    days.push({ date, total: totalAmount(total) })
  }
  return days
}

export function capStatus(total, cap) {
  if (!cap) return { state: 'none', remaining: 0, overage: 0 }
  if (total > cap) return { state: 'over', remaining: 0, overage: roundCents(total - cap) }
  return { state: 'under', remaining: roundCents(cap - total), overage: 0 }
}
