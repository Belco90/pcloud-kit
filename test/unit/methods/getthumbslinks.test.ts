import { describe, it, expect, vi } from 'vitest'

import { createClient } from '../../../src/client'
import { apiOk, mockFetch } from '../../fixtures/responses'

const TWO_OK = {
	thumbs: [
		{ result: 0, fileid: 42, hosts: ['p-host.pcloud.com'], path: '/cBL42/thumb.jpg' },
		{ result: 0, fileid: 43, hosts: ['p-host.pcloud.com'], path: '/cBL43/thumb.jpg' },
	],
}

describe('getthumbslinks', () => {
	it('returns assembled https URLs for all successful entries', async () => {
		vi.stubGlobal('fetch', mockFetch(apiOk(TWO_OK)))
		const client = createClient({ token: 'test-token' })
		const thumbs = await client.getthumbslinks([42, 43])
		expect(thumbs).toEqual([
			{ fileid: 42, url: 'https://p-host.pcloud.com/cBL42/thumb.jpg' },
			{ fileid: 43, url: 'https://p-host.pcloud.com/cBL43/thumb.jpg' },
		])
	})

	it('sends fileids, type=auto, size=120x120, crop=1 by default', async () => {
		let capturedUrl = ''
		vi.stubGlobal('fetch', (url: string) => {
			capturedUrl = url
			return Promise.resolve(new Response(JSON.stringify(apiOk(TWO_OK)), { status: 200 }))
		})

		const client = createClient({ token: 'test-token' })
		await client.getthumbslinks([42, 43])
		expect(capturedUrl).toContain('fileids=42%2C43')
		expect(capturedUrl).toContain('type=auto')
		expect(capturedUrl).toContain('size=120x120')
		expect(capturedUrl).toContain('crop=1')
	})

	it('honors custom thumbType, size, and crop=false', async () => {
		let capturedUrl = ''
		vi.stubGlobal('fetch', (url: string) => {
			capturedUrl = url
			return Promise.resolve(new Response(JSON.stringify(apiOk(TWO_OK)), { status: 200 }))
		})

		const client = createClient({ token: 'test-token' })
		await client.getthumbslinks([42], { thumbType: 'png', size: '32x32', crop: false })
		expect(capturedUrl).toContain('type=png')
		expect(capturedUrl).toContain('size=32x32')
		expect(capturedUrl).toContain('crop=0')
	})

	it('drops entries whose per-file result is non-zero', async () => {
		vi.stubGlobal(
			'fetch',
			mockFetch(
				apiOk({
					thumbs: [
						{ result: 0, fileid: 42, hosts: ['p-host.pcloud.com'], path: '/cBL42/thumb.jpg' },
						{ result: 2009, fileid: 99 },
					],
				}),
			),
		)
		const client = createClient({ token: 'test-token' })
		const thumbs = await client.getthumbslinks([42, 99])
		expect(thumbs).toEqual([{ fileid: 42, url: 'https://p-host.pcloud.com/cBL42/thumb.jpg' }])
	})

	it('drops entries with empty hosts array', async () => {
		vi.stubGlobal(
			'fetch',
			mockFetch(
				apiOk({
					thumbs: [
						{ result: 0, fileid: 42, hosts: [], path: '/cBL42/thumb.jpg' },
						{ result: 0, fileid: 43, hosts: ['p-host.pcloud.com'], path: '/cBL43/thumb.jpg' },
					],
				}),
			),
		)
		const client = createClient({ token: 'test-token' })
		const thumbs = await client.getthumbslinks([42, 43])
		expect(thumbs).toEqual([{ fileid: 43, url: 'https://p-host.pcloud.com/cBL43/thumb.jpg' }])
	})

	it('throws TypeError when fileids is empty', async () => {
		const client = createClient({ token: 'test-token' })
		await expect(client.getthumbslinks([])).rejects.toThrow(TypeError)
		await expect(client.getthumbslinks([])).rejects.toThrow('`fileids` must be a non-empty array')
	})
})
