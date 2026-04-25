import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['examples/browser/**/*.scenario.test.ts'],
		setupFiles: ['examples/browser/vitest.setup.ts'],
		browser: {
			enabled: true,
			provider: 'playwright',
			instances: [{ browser: 'chromium' }],
			headless: true,
		},
	},
})
