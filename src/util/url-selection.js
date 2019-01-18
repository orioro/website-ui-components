const PURE_HASH_URL_RE = /^#/
const HASH_CAPTURE_RE = /#([^#]+)$/
const TRAILING_SLASH_RE = /\/$/

export const getBaseUrl = () => {
	return window.location.origin + window.location.pathname + window.location.search
}

export const getAnchorSelector = targetId => {
	const hash = `#${targetId}`

	return `a[href="${hash}"], a[href="${getBaseUrl()}${hash}"]`
}

export const getUrlHash = url => {
	const match = url.match(HASH_CAPTURE_RE)

	return match ? match[1] : null
}

export const isPureHashUrl = url => {
	return PURE_HASH_URL_RE.test(url)
}

export const getTargetElementGivenUrl = (targetUrl, baseUrl = getBaseUrl()) => {
	if (!targetUrl) {
		throw new Error('targetUrl is required')
	}

	if (!isPureHashUrl(targetUrl) &&
			!targetUrl.startsWith(baseUrl.replace(TRAILING_SLASH_RE, ''))) {
		return null
	}

	const targetId = getUrlHash(targetUrl)

	return targetId ? document.getElementById(targetId) : null
}
