<template>
  <div class="min-h-dvh grid grid-cols-1 md:grid-cols-[240px_1fr]">
    <Sidebar />

    <div class="grid grid-rows-[auto_1fr_auto]">
      <NuxtRouteAnnouncer />
      <AppHeader />
      <main class="container-px py-6">
        <NuxtPage />
      </main>
      <AppFooter />
    </div>

    <!-- Add Task Dialog lives at root so it can overlay -->
    <AddTaskDialog />
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import AddTaskDialog from './components/AddTaskDialog.vue'
</script>
