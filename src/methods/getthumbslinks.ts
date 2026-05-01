import type { ClientContext } from '../client'
import type { ThumbResult } from '../types/api'
import type { ThumbOptions } from '../types/options'

import { assert } from '../util/assert'

interface ThumbsLinksEntry {
	result: number
	fileid: number
	hosts?: string[]
	path?: string
}

export function getthumbslinks(ctx: ClientContext) {
	return async (fileids: number[], options: ThumbOptions = {}): Promise<ThumbResult[]> => {
		assert(Array.isArray(fileids) && fileids.length > 0, '`fileids` must be a non-empty array')

		const thumbType = options.thumbType ?? 'auto'
		const size = options.size ?? '120x120'
		const crop = options.crop ?? true

		const res = await ctx.call<{ thumbs: ThumbsLinksEntry[] }>('getthumbslinks', {
			fileids: fileids.join(','),
			type: thumbType,
			size,
			crop: crop ? 1 : 0,
		})

		const thumbs: ThumbResult[] = []
		for (const entry of res.thumbs) {
			if (entry.result !== 0) continue
			const host = entry.hosts?.[0]
			if (!host || !entry.path) continue
			thumbs.push({ fileid: entry.fileid, url: `https://${host}${entry.path}` })
		}
		return thumbs
	}
}
