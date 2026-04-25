const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

// Rejection-sample random bytes to remove modulo bias: 256 isn't a multiple
// of 62, so a naive `b % 62` would over-represent the first 8 chars (~25%
// relative weight bonus). Bytes >= maxUnbiased are discarded.
const MAX_UNBIASED = Math.floor(256 / ALPHABET.length) * ALPHABET.length

export function randomString(length: number): string {
	const result: string[] = []
	while (result.length < length) {
		const buf = new Uint8Array(length - result.length)
		crypto.getRandomValues(buf)
		for (const b of buf) {
			if (b < MAX_UNBIASED) result.push(ALPHABET[b % ALPHABET.length]!)
			if (result.length === length) break
		}
	}
	return result.join('')
}
