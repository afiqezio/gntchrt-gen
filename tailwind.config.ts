export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6366f1',
          700: '#4f46e5',
        },
      },
      boxShadow: {
        subtle: '0 1px 0 rgba(0,0,0,0.1) inset, 0 1px 2px rgba(0,0,0,0.06)'
      }
    },
  },
} satisfies Record<string, any>


