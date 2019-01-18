import delegate from 'delegate'

/**
 * Initializes hash navigation tracking
 */
export const initializeHashNavigationTracking = (system, rootElement) => {
	delegate(rootElement, 'a', 'click', e => {
		const targetUrl = e.delegateTarget.getAttribute('href')
		const handled = system.navHandleNavigation(targetUrl)

		if (handled) {
			e.preventDefault()
			system.navHistoryPushState(targetUrl)
		}
	})

	window.addEventListener('popstate', () => {
		system.navHandleNavigation(window.location.href)
	})

	system.navHandleNavigation(window.location.href)
}
