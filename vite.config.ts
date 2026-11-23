import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base =
    process.env.GITHUB_PAGES_BASE ||
    env.GITHUB_PAGES_BASE ||
    env.VITE_BASE_PATH ||
    '/'

  return {
    base,
    plugins: [react(), tailwindcss()],
    envPrefix: ['VITE_'],
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  }
})