export type ViewMode = 'day' | 'week' | 'month'

export interface GanttTask {
  id: number
  name: string
  owner?: string
  start: Date
  end: Date
  dependsOn?: number
}


