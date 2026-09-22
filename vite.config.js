import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/ai_product_governance/",
  plugins: [react()],
})
