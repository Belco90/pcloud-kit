import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: {
			'pcloud-sdk/oauth-browser': new URL('./src/oauth-browser.ts', import.meta.url).pathname,
			'pcloud-sdk/oauth': new URL('./src/oauth.ts', import.meta.url).pathname,
			'pcloud-sdk/errors': new URL('./src/errors.ts', import.meta.url).pathname,
			'pcloud-sdk': new URL('./src/index.ts', import.meta.url).pathname,
		},
	},
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
