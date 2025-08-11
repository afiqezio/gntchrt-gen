import { ref } from 'vue'
import { parseTasksFromText } from '../utils/parse'
import { downloadElementAsPng } from '../utils/png'
import type { GanttTask, ViewMode } from '../types/gantt'
import { formatDate, addDays, parseDurationToDays } from '../utils/date'

type NewTaskInput = {
  name: string
  start: string // YYYY-MM-DD
  duration: string // e.g. 10d, 2w, 1m
  owner?: string
  dependsOn?: number
}

// Singleton state (shared across all components)
const rawInput = ref('')
const tasks = ref<GanttTask[]>([])
const viewMode = ref<ViewMode>('week')

// Add Task dialog state
const isAddOpen = ref(false)
function openAdd() { isAddOpen.value = true }
function closeAdd() { isAddOpen.value = false }

function nextId(): number {
  return tasks.value.length ? Math.max(...tasks.value.map(t => t.id)) + 1 : 1
}

function addTask(input: NewTaskInput) {
  const start = new Date(input.start)
  if (Number.isNaN(start.getTime())) return
  const durationDays = parseDurationToDays(input.duration)
  const end = addDays(start, Math.max(1, durationDays) - 1)
  tasks.value = [
    ...tasks.value,
    {
      id: nextId(),
      name: input.name,
      owner: input.owner,
      start,
      end,
      dependsOn: input.dependsOn,
    }
  ]
}

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
  const el = document.getElementById('gantt-canvas') as HTMLElement | null
  if (el) await downloadElementAsPng(el, 'gantt.png')
}

export function useGantt() {
  return {
    rawInput,
    tasks,
    viewMode,
    parseAndApply,
    loadExample,
    clearAll,
    isAddOpen,
    openAdd,
    closeAdd,
    addTask,
    downloadPng,
    formatDate,
  }
}


