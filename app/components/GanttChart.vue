<template>
  <div
    id="gantt-canvas"
    ref="containerRef"
    class="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40"
    :style="{ '--row-height': rowHeight + 'px' }"
  >
    <div class="grid grid-cols-[240px_1fr]">
      <!-- Header -->
      <div class="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs">
        Task
      </div>
      <div class="min-w-0 overflow-hidden">
        <div
          class="flex gap-0 px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs min-w-max"
          :style="{ width: timelineWidth + 'px', transform: 'translateX(' + (-scrollLeft) + 'px)' }"
        >
          <div
            v-for="tick in timelineTicks"
            :key="tick.key"
            class="text-center shrink-0"
            :style="{ width: (tick.spanDays * pxPerDay) + 'px' }"
          >
            {{ tick.label }}
          </div>
        </div>
      </div>

      <!-- Left names -->
      <div>
        <div
          v-for="task in tasks"
          :key="task.id"
          class="px-3 py-2 flex items-center text-sm min-h-[var(--row-height)] border-b border-dashed border-zinc-200 dark:border-zinc-800"
        >
          {{ task.name }}
        </div>
      </div>

      <!-- Right timeline -->
      <div class="overflow-x-auto min-w-0" ref="bodyScroller" @scroll="onBodyScroll">
        <div class="relative" :style="{ width: timelineWidth + 'px' }">
          <!-- Background (weekends) + Today marker -->
          <div class="absolute inset-0 pointer-events-none">
            <div
              v-for="i in totalDays"
              :key="i"
              class="absolute top-0 bottom-0"
              :style="{
                left: (i - 1) * pxPerDay + 'px',
                width: pxPerDay + 'px'
              }"
              :class="showWeekends && isWeekend(i - 1) ? 'bg-zinc-100 dark:bg-zinc-800/40' : ''"
            />
            <div
              v-if="showToday && todayInRange"
              class="absolute top-0 bottom-0 border-l-2 border-rose-500/80"
              :style="{ left: todayOffsetPx + 'px' }"
            />
          </div>

          <!-- Rows + Bars -->
          <div
            v-for="(task, idx) in tasks"
            :key="task.id"
            class="relative min-h-[var(--row-height)] border-b border-dashed border-zinc-200 dark:border-zinc-800 px-3 py-2"
          >
            <div
              class="absolute top-0 text-white rounded-lg shadow-subtle flex items-center justify-center text-[12px] bg-gradient-to-b from-indigo-500 to-indigo-600"
              :style="barStyle(task)"
              :aria-label="taskAria(task)"
              @mouseenter="onBarEnter(task, $event)"
              @mousemove="onBarMove(task, $event)"
              @mouseleave="onBarLeave"
              @click="emit('select', task)"
            >
              <span class="opacity-90 px-2 truncate">{{ task.owner || task.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hover tooltip -->
    <div
      v-if="tooltip.show"
      class="fixed z-50 pointer-events-none px-2 py-1 rounded bg-zinc-800 text-white text-xs shadow-lg"
      :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
    >
      <div class="font-medium">{{ tooltip.title }}</div>
      <div class="opacity-80">{{ tooltip.subtitle }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { GanttTask, ViewMode } from '../../types/gantt'
import { daysBetween, startOfUnit, endOfUnit, formatDate, normalize } from '../../utils/date'

const emit = defineEmits<{ (e: 'select', task: GanttTask): void }>()

const props = withDefaults(defineProps<{
  tasks: GanttTask[]
  viewMode: ViewMode
  rowHeight?: number
  showToday?: boolean
  showWeekends?: boolean
}>(), {
  rowHeight: 56,
  showToday: true,
  showWeekends: true,
})

const bodyScroller = ref<HTMLElement | null>(null)
const scrollLeft = ref(0)
function onBodyScroll(ev: Event) {
  const el = ev.target as HTMLElement
  scrollLeft.value = el.scrollLeft
}

const containerRef = ref<HTMLElement | null>(null)
const rowHeight = computed(() => props.rowHeight)

const pxPerDay = computed(() => {
  if (props.viewMode === 'day') return 32
  if (props.viewMode === 'week') return 12
  return 4 // month
})

const minDate = computed(() => startOfUnit(Math.min(...props.tasks.map(t => t.start.getTime())), props.viewMode))
const maxDate = computed(() => endOfUnit(Math.max(...props.tasks.map(t => t.end.getTime())), props.viewMode))
const totalDays = computed(() => daysBetween(minDate.value, maxDate.value) + 1)

const timelineTicks = computed(() => {
  const ticks: { key: string; label: string; spanDays: number }[] = []
  const start = new Date(minDate.value)
  const total = totalDays.value

  if (props.viewMode === 'day') {
    for (let i = 0; i < total; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      ticks.push({
        key: d.toISOString().slice(0, 10),
        label: d.getDate().toString(),
        spanDays: 1,
      })
    }
    return ticks
  }

  if (props.viewMode === 'week') {
    let i = 0
    while (i < total) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const dayOfWeekMon = ((d.getDay() + 6) % 7) + 1 // 1..7 (Mon..Sun)
      const span = Math.min(8 - dayOfWeekMon, total - i)
      ticks.push({
        key: d.toISOString().slice(0, 10),
        label: 'W' + getWeekNumber(d),
        spanDays: span,
      })
      i += span
    }
    return ticks
  }

  // month
  let i = 0
  while (i < total) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0)
    const span = Math.min(daysBetween(d, monthEnd) + 1, total - i)
    ticks.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleString(undefined, { month: 'short' }),
      spanDays: span,
    })
    i += span
  }
  return ticks
})

const timelineWidth = computed(() => totalDays.value * pxPerDay.value)
const contentHeight = computed(() => props.tasks.length * rowHeight.value)

function barStyle(task: GanttTask) {
  const offsetDays = daysBetween(minDate.value, task.start)
  const durationDays = Math.max(1, daysBetween(task.start, task.end) + 1)
  return {
    left: offsetDays * pxPerDay.value + 'px',
    width: durationDays * pxPerDay.value + 'px',
    height: rowHeight.value * 0.6 + 'px',
    marginTop: (rowHeight.value * 0.2) + 'px',
  }
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil((((date as any) - (yearStart as any)) / 86400000 + 1) / 7)
}

function isWeekend(idx: number) {
  const d = new Date(minDate.value)
  d.setDate(d.getDate() + idx)
  const day = d.getDay()
  return day === 0 || day === 6
}

// Today marker
const today = computed(() => normalize(new Date()))
const todayOffsetDays = computed(() => daysBetween(minDate.value, today.value))
const todayInRange = computed(() => todayOffsetDays.value >= 0 && todayOffsetDays.value <= totalDays.value - 1)
const todayOffsetPx = computed(() => Math.max(0, Math.min(totalDays.value - 1, todayOffsetDays.value)) * pxPerDay.value)

// Tooltip state
const tooltip = reactive({
  show: false,
  x: 0,
  y: 0,
  title: '',
  subtitle: '',
})

function onBarEnter(task: GanttTask, ev: MouseEvent) {
  tooltip.show = true
  tooltip.title = task.name + (task.owner ? ` — ${task.owner}` : '')
  const durationDays = Math.max(1, daysBetween(task.start, task.end) + 1)
  tooltip.subtitle = `${formatDate(task.start)} → ${formatDate(task.end)} · ${durationDays}d`
  onBarMove(task, ev)
}

function onBarMove(_task: GanttTask, ev: MouseEvent) {
  tooltip.x = ev.clientX + 12
  tooltip.y = ev.clientY + 12
}

function onBarLeave() {
  tooltip.show = false
}

function taskAria(task: GanttTask) {
  return `${task.name} from ${formatDate(task.start)} to ${formatDate(task.end)}`
}

defineExpose({ formatDate })
</script>

<style scoped></style>

