import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: CI에서 VITE_BASE=/저장소이름/ 설정 (워크플로 참고)
const raw = (process.env.VITE_BASE || '/').trim()
const base = raw === '' || raw === '/' ? '/' : raw.endsWith('/') ? raw : `${raw}/`

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
})
