import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const here = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
	root: here,
	publicDir: 'public',
	server: {
		port: 5173,
	},
})
