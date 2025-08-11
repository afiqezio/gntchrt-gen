import type { GanttTask } from '../types/gantt'
import { parseDurationToDays, addDays } from '../utils/date'

export function parseTasksFromText(text: string): GanttTask[] {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)

  const tasks: GanttTask[] = []
  lines.forEach((line, idx) => {
    const parts = line.split(',').map(p => p.trim())
    if (parts.length < 3) return
    const name = parts[0]
    const start = new Date(parts[1] || '2025-01-01')
    if (Number.isNaN(start.getTime())) return
    const durationDays = parseDurationToDays(parts[2] || '0d')
    const owner = parts[3] || undefined
    const dependsOn = parts[4] ? Number(parts[4]) : undefined
    const end = addDays(start, durationDays - 1)
    tasks.push({ id: idx + 1, name: name || '', owner: owner || '', start, end, dependsOn })
  })
  return tasks
}


