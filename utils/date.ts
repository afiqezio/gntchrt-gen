export function parseDurationToDays(input: string): number {
  const trimmed = input.trim().toLowerCase()
  const match = trimmed.match(/^(\d+)(d|w|m)?$/)
  if (!match) return 1
  const value = parseInt(match[1], 10)
  const unit = match[2] || 'd'
  if (unit === 'd') return value
  if (unit === 'w') return value * 5
  if (unit === 'm') return value * 22
  return value
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function daysBetween(a: Date, b: Date): number {
  const ms = normalize(a).getTime()
  const ms2 = normalize(b).getTime()
  return Math.round((ms2 - ms) / 86400000)
}

export function normalize(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function startOfUnit(msOrDate: number | Date, mode: 'day' | 'week' | 'month'): Date {
  const d = new Date(typeof msOrDate === 'number' ? msOrDate : msOrDate.getTime())
  if (mode === 'month') {
    return new Date(d.getFullYear(), d.getMonth(), 1)
  }
  if (mode === 'week') {
    const dd = new Date(d)
    const day = dd.getDay() || 7
    dd.setDate(dd.getDate() - (day - 1))
    dd.setHours(0, 0, 0, 0)
    return dd
  }
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfUnit(msOrDate: number | Date, mode: 'day' | 'week' | 'month'): Date {
  const d = new Date(typeof msOrDate === 'number' ? msOrDate : msOrDate.getTime())
  if (mode === 'month') {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0)
  }
  if (mode === 'week') {
    const dd = startOfUnit(d, 'week')
    dd.setDate(dd.getDate() + 6)
    return dd
  }
  d.setHours(0, 0, 0, 0)
  return d
}


