import { ref, watchEffect, onMounted } from 'vue'

const STORAGE_KEY = 'theme' // 'dark' | 'light'

export function useTheme() {
  const isDark = ref(false)

  const apply = () => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (isDark.value) root.classList.add('dark')
    else root.classList.remove('dark')

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    }
  }

  onMounted(() => {
    if (typeof localStorage !== 'undefined' && typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true
      }
    }
    apply()
  })

  // Safe to keep; guarded apply is no-op during SSR
  watchEffect(apply)

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
}
