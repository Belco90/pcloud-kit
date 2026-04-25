import { createClient } from 'pcloud-sdk'
import { initOauthPollToken } from 'pcloud-sdk/oauth-browser'

import { errorHandlers } from '../shared/handlers'
import { worker } from './worker'

const out = document.querySelector<HTMLPreElement>('#output')!

function log(label: string, payload: unknown): void {
	const body = payload instanceof Error ? `${payload.name}: ${payload.message}` : payload
	const text = typeof body === 'string' ? body : JSON.stringify(body, null, 2)
	out.textContent = `${label}\n\n${text}`
}

function getInput(id: string): string {
	return document.querySelector<HTMLInputElement>(`#${id}`)!.value
}

async function start(): Promise<void> {
	await worker.start({
		onUnhandledRequest: 'bypass',
		quiet: true,
	})
	out.textContent = 'MSW worker started. Click a button above.'
}

function bind(id: string, fn: () => Promise<void>): void {
	document.querySelector<HTMLButtonElement>(`#${id}`)!.addEventListener('click', () => {
		void fn().catch((err: unknown) => {
			log('Error', err instanceof Error ? err : new Error(String(err)))
		})
	})
}

bind('btn-list-oauth', async () => {
	const client = createClient({ token: getInput('oauth-token'), type: 'oauth' })
	const root = await client.listfolder(0)
	log('listfolder via oauth-mode client', root)
})

bind('btn-list-pcloud', async () => {
	const client = createClient({ token: getInput('pcloud-token'), type: 'pcloud' })
	const root = await client.listfolder(0)
	log('listfolder via pcloud-mode client', root)
})

bind('btn-oauth-poll', async () => {
	// Suppress the popup: initOauthPollToken would otherwise call window.open
	// to navigate to the real my.pcloud.com authorize page. We only care about
	// the polled fetch, which MSW intercepts.
	const realOpen = window.open
	window.open = () => null
	try {
		const token = await new Promise<string>((resolve, reject) => {
			initOauthPollToken({
				clientId: 'test-client-id',
				receiveToken: (t) => resolve(t),
				onError: reject,
			})
		})
		const client = createClient({ token, type: 'oauth' })
		const root = await client.listfolder(0)
		log(`OAuth poll → received token, listed folder`, { token, root })
	} finally {
		window.open = realOpen
	}
})

bind('btn-error', async () => {
	worker.use(...errorHandlers())
	try {
		const client = createClient({ token: getInput('oauth-token'), type: 'oauth' })
		await client.listfolder(0)
		log('error path', 'unexpected success')
	} catch (err) {
		log('error path (caught)', err)
	} finally {
		worker.resetHandlers()
	}
})

void start()
