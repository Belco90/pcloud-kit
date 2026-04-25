import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const here = fileURLToPath(new URL('.', import.meta.url))
const repoRoot = fileURLToPath(new URL('../..', import.meta.url))

export default defineConfig({
	root: here,
	publicDir: 'public',
	resolve: {
		alias: {
			'pcloud-sdk/oauth-browser': `${repoRoot}/src/oauth-browser.ts`,
			'pcloud-sdk/oauth': `${repoRoot}/src/oauth.ts`,
			'pcloud-sdk/errors': `${repoRoot}/src/errors.ts`,
			'pcloud-sdk': `${repoRoot}/src/index.ts`,
		},
	},
	server: {
		port: 5173,
	},
})
