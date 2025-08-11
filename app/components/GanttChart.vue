<template>
  <div id="gantt-canvas" ref="containerRef" class="w-full rounded-2xl overflow-auto border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40" :style="{ '--row-height': rowHeight + 'px' }">
    <div class="grid grid-flow-col auto-cols-[minmax(64px,auto)] gap-0 px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs min-w-max">
      <div class="text-center" v-for="tick in timelineTicks" :key="tick.key">
        {{ tick.label }}
      </div>
    </div>
    <div class="grid min-w-max">
      <div v-for="task in tasks" :key="task.id" class="grid grid-cols-[240px_1fr] min-h-[var(--row-height)] border-b border-dashed border-zinc-200 dark:border-zinc-800">
        <div class="px-3 py-2 flex items-center text-sm">{{ task.name }}</div>
        <div class="relative px-3 py-2">
          <div
            class="absolute top-0 text-white rounded-lg shadow-subtle flex items-center justify-center text-[12px] bg-gradient-to-b from-indigo-500 to-indigo-600"
            :style="barStyle(task)"
            :title="task.name + ' (' + formatDate(task.start) + ' → ' + formatDate(task.end) + ')'"
          >
            <span class="opacity-90 px-2 truncate">{{ task.owner }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GanttTask, ViewMode } from '../../types/gantt'
import { daysBetween, startOfUnit, endOfUnit, formatDate } from '../../utils/date'

const props = defineProps<{ tasks: GanttTask[]; viewMode: ViewMode }>()

const containerRef = ref<HTMLElement | null>(null)
const rowHeight = 56
const pxPerDay = computed(() => {
  if (props.viewMode === 'day') return 32
  if (props.viewMode === 'week') return 12
  return 4 // month
})

const minDate = computed(() => startOfUnit(Math.min(...props.tasks.map(t => t.start.getTime())), props.viewMode))
const maxDate = computed(() => endOfUnit(Math.max(...props.tasks.map(t => t.end.getTime())), props.viewMode))
const totalDays = computed(() => daysBetween(minDate.value, maxDate.value) + 1)

const timelineTicks = computed(() => {
  const ticks: { key: string; label: string }[] = []
  const start = new Date(minDate.value)
  for (let i = 0; i < totalDays.value; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    const label = props.viewMode === 'month' ? d.toLocaleString(undefined, { month: 'short' }) : d.getDate().toString()
    if (props.viewMode === 'week') {
      if (d.getDay() === 1 || i === 0) ticks.push({ key, label: 'W' + getWeekNumber(d) })
    } else if (props.viewMode === 'month') {
      if (d.getDate() === 1 || i === 0) ticks.push({ key, label })
    } else {
      ticks.push({ key, label })
    }
  }
  return ticks
})

function barStyle(task: GanttTask) {
  const offsetDays = daysBetween(minDate.value, task.start)
  const durationDays = Math.max(1, daysBetween(task.start, task.end) + 1)
  return {
    left: offsetDays * pxPerDay.value + 'px',
    width: durationDays * pxPerDay.value + 'px',
    height: rowHeight * 0.6 + 'px',
    marginTop: (rowHeight * 0.2) + 'px',
  }
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil((((date as any) - (yearStart as any)) / 86400000 + 1) / 7)
}

defineExpose({ formatDate })
</script>

<style scoped></style>

