<template>
    <aside class="hidden md:flex md:flex-col border-r border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur">
      <div class="px-4 py-4 flex items-center gap-2 font-semibold tracking-tight">
        <span class="size-2 rounded-full bg-brand shadow-[0_0_16px_#6366f1]" aria-hidden="true"></span>
        <span>ProjectFlow</span>
      </div>
  
      <nav class="px-2 py-2 grid gap-1">
        <NuxtLink to="/" class="sidebar-link" active-class="active-link">
          Projects
        </NuxtLink>
        <a class="sidebar-link" href="javascript:void(0)">Dashboard</a>
        <a class="sidebar-link" href="javascript:void(0)">Teams</a>
        <a class="sidebar-link" href="javascript:void(0)">Reports</a>
      </nav>
  
      <div class="mt-auto p-4 text-sm text-zinc-500 dark:text-zinc-400">
        <NuxtLink to="/about" class="sidebar-link">About</NuxtLink>
      </div>
    </aside>
  </template>
  
  <script setup lang="ts"></script>