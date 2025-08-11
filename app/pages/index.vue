<template>
  <section class="grid md:grid-cols-2 gap-7">
    <div class="card">
      <h1 class="text-2xl font-semibold mb-2">Create Gantt</h1>
      <p class="text-zinc-400 mb-4">Paste tasks or fill the form. Example: "Design, 2025-09-01, 10d, Alice"</p>

      <div class="grid gap-3">
        <textarea
          v-model="rawInput"
          class="w-full min-h-32 resize-y rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40"
          rows="6"
          placeholder="Task, YYYY-MM-DD, duration (e.g. 10d or 2w), assignee (optional), dependency id (optional)"
        ></textarea>

        <div class="flex gap-2">
          <button class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white" @click="parseAndApply">Parse</button>
          <button class="px-4 py-2 rounded-xl border border-zinc-800/80 hover:border-indigo-500 text-zinc-100" @click="loadExample">Load Example</button>
          <button class="px-4 py-2 rounded-xl border border-zinc-800/80 hover:border-indigo-500 text-zinc-100" @click="clearAll">Clear</button>
        </div>
      </div>

      <div class="grid gap-3 mt-5" v-if="tasks.length">
        <h2 class="text-lg font-semibold">Tasks</h2>
        <div class="overflow-hidden rounded-xl border border-zinc-800/80">
          <div class="grid grid-cols-[40px_1fr_120px_120px_120px] text-xs uppercase tracking-wide text-zinc-400 bg-zinc-900/40">
            <div class="px-3 py-2 border-b border-zinc-800">ID</div>
            <div class="px-3 py-2 border-b border-zinc-800">Task</div>
            <div class="px-3 py-2 border-b border-zinc-800">Start</div>
            <div class="px-3 py-2 border-b border-zinc-800">End</div>
            <div class="px-3 py-2 border-b border-zinc-800">Assignee</div>
          </div>
          <div v-for="t in tasks" :key="t.id" class="grid grid-cols-[40px_1fr_120px_120px_120px]">
            <div class="px-3 py-2 border-b border-zinc-800">{{ t.id }}</div>
            <div class="px-3 py-2 border-b border-zinc-800">{{ t.name }}</div>
            <div class="px-3 py-2 border-b border-zinc-800">{{ formatDate(t.start) }}</div>
            <div class="px-3 py-2 border-b border-zinc-800">{{ formatDate(t.end) }}</div>
            <div class="px-3 py-2 border-b border-zinc-800">{{ t.owner || '—' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="text-lg font-semibold mb-3">Gantt</h2>
      <GanttChart
        v-if="tasks.length"
        :tasks="tasks"
        :viewMode="viewMode"
        class="overflow-auto"
      />
      <div class="flex items-center gap-2 mt-3">
        <label class="text-sm text-zinc-400">View</label>
        <select v-model="viewMode" class="rounded-xl bg-zinc-900/40 border border-zinc-800/80 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
        <button class="px-4 py-2 rounded-xl border border-zinc-800/80 hover:border-indigo-500 text-zinc-100 disabled:opacity-50" @click="downloadPng" :disabled="!tasks.length">Download PNG</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useGantt } from '../../composables/useGantt'
import GanttChart from '../components/GanttChart.vue'
const {
  rawInput, tasks, viewMode,
  parseAndApply, loadExample, clearAll, formatDate, downloadPng
} = useGantt()
</script>

