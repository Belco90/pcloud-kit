import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import { worker } from './worker'

await worker.start({ onUnhandledRequest: 'bypass', quiet: true })

createRoot(document.querySelector<HTMLElement>('#root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
