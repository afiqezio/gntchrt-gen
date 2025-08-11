<template>
  <header class="border-b border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur">
    <div class="container-px py-3 flex items-center justify-between gap-3">
      <div class="inline-flex items-center gap-3">
        <!-- <h1 class="text-lg md:text-xl font-semibold">Website Redesign Project</h1>
        <span class="pill">In Progress</span> -->
      </div>

      <div class="inline-flex items-center gap-2">
        <button class="px-3 py-1.5 rounded-lg text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900/60">
          Share
        </button>
        <button class="px-3 py-1.5 rounded-lg bg-brand hover:bg-brand-700 text-white" @click="openAdd">
          + Add Task
        </button>

        <button
          class="ml-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:text-zinc-100"
          @click="toggleTheme"
          :title="isDark ? 'Switch to Light' : 'Switch to Dark'"
        >
          {{ isDark ? '🌙' : '☀️' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useGantt } from '../../composables/useGantt'
const { isDark, toggleTheme } = useTheme()
const { openAdd } = useGantt()
</script>

