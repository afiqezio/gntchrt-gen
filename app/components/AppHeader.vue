<template>
  <header class="sticky top-0 border-b border-zinc-800/80 backdrop-blur bg-zinc-950/70">
    <div class="container-px py-3 flex items-center justify-between">
      <div class="inline-flex items-center gap-2 font-semibold tracking-tight">
        <span class="size-2 rounded-full bg-indigo-500 shadow-[0_0_16px_#6366f1]" aria-hidden="true"></span>
        <span>Gantt Generator</span>
      </div>
      <nav class="inline-flex gap-2">
        <NuxtLink to="/" class="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 transition-colors" active-class="text-zinc-100 bg-zinc-900/60">Create</NuxtLink>
        <NuxtLink to="/about" class="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 transition-colors" active-class="text-zinc-100 bg-zinc-900/60">About</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

