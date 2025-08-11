<template>
  <section class="grid gap-7">
    <div class="card min-h-[70vh]">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold">Timeline</h2>
        <div class="flex items-center gap-2">
          <label class="text-sm text-zinc-500 dark:text-zinc-400">View</label>
          <select v-model="viewMode" class="rounded-xl bg-white border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-zinc-900/40 dark:border-zinc-800/80">
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          <button class="px-4 py-2 rounded-xl border border-zinc-200 hover:border-indigo-500 text-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 disabled:opacity-50" @click="downloadPng" :disabled="!tasks.length">Download PNG</button>
        </div>
      </div>

      <GanttChart
        v-if="tasks.length"
        :tasks="tasks"
        :viewMode="viewMode"
      />

      <div v-else class="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800/80 p-6 text-center text-zinc-500 dark:text-zinc-400">
        No tasks yet. Use “+ Add Task” to create your first task.
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useGantt } from '../../composables/useGantt'
import GanttChart from '../components/GanttChart.vue'
const {
  tasks, viewMode, downloadPng
} = useGantt()
</script>

