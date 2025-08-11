<template>
  <teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/50" @click="close"></div>

      <div class="absolute inset-0 grid place-items-center p-4">
        <div class="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/90">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Add Task</h3>
            <button class="px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" @click="close">✕</button>
          </div>

          <div class="grid gap-3">
            <div>
              <label class="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">Task name</label>
              <input v-model="form.name" class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800/80 dark:bg-zinc-900/40" placeholder="Design" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">Start date</label>
                <input type="date" v-model="form.start" class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800/80 dark:bg-zinc-900/40" />
              </div>
              <div>
                <label class="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">End date</label>
                <input
                  type="date"
                  v-model="form.end"
                  :min="form.start || undefined"
                  class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800/80 dark:bg-zinc-900/40"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">Assignee (optional)</label>
                <input v-model="form.owner" class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800/80 dark:bg-zinc-900/40" placeholder="Alice" />
              </div>
              <div>
                <label class="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">Depends on ID (optional)</label>
                <input v-model.number="form.dependsOn" type="number" min="1" class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800/80 dark:bg-zinc-900/40" placeholder="2" />
              </div>
            </div>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <button class="px-4 py-2 rounded-xl border border-zinc-200 hover:border-indigo-500 text-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100" @click="close">Cancel</button>
            <button class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50" :disabled="!canSave" @click="save">Save</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { useGantt } from '../../composables/useGantt'
import { daysBetween } from '../../utils/date'

const { isAddOpen: isOpen, closeAdd: close, addTask } = useGantt()

const empty = () => ({ name: '', start: '', end: '', owner: '', dependsOn: undefined as number | undefined })
const form = reactive(empty())

watch(isOpen, (v) => { if (v) Object.assign(form, empty()) })

watch(() => form.start, (s) => {
  if (!s) return
  if (!form.end || new Date(form.end) < new Date(s)) form.end = s
})

const canSave = computed(() => {
  if (!form.name || !form.start || !form.end) return false
  const s = new Date(form.start)
  const e = new Date(form.end)
  return !Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime()) && e >= s
})

function save() {
  if (!canSave.value) return
  const s = new Date(form.start)
  const e = new Date(form.end)
  const durationDays = Math.max(1, daysBetween(s, e) + 1)
  addTask({
    name: form.name.trim(),
    start: form.start,
    duration: `${durationDays}d`,
    owner: form.owner?.trim() || undefined,
    dependsOn: form.dependsOn || undefined,
  })
  close()
}
</script>