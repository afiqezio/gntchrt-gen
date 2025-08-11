import { ref } from 'vue'
import { parseTasksFromText } from '../utils/parse'
import { downloadElementAsPng } from '../utils/png'
import type { GanttTask, ViewMode } from '../types/gantt'
import { formatDate } from '../utils/date'

export function useGantt() {
  const rawInput = ref('')
  const tasks = ref<GanttTask[]>([])
  const viewMode = ref<ViewMode>('week')

  function parseAndApply() {
    tasks.value = parseTasksFromText(rawInput.value)
  }

  function loadExample() {
    rawInput.value = [
      'Discovery, 2025-09-01, 5d, Alice',
      'Design, 2025-09-08, 10d, Bob, 1',
      'Development, 2025-09-22, 3w, Team, 2',
      'QA, 2025-10-13, 8d, Carol, 3',
      'Launch, 2025-10-27, 2d, Exec, 4'
    ].join('\n')
    parseAndApply()
  }

  function clearAll() {
    rawInput.value = ''
    tasks.value = []
  }

  async function downloadPng() {
    const el = document.querySelector('.grid.rounded-2xl') as HTMLElement | null
    if (el) await downloadElementAsPng(el, 'gantt.png')
  }

  return {
    rawInput,
    tasks,
    viewMode,
    parseAndApply,
    loadExample,
    clearAll,
    downloadPng,
    formatDate,
  }
}


