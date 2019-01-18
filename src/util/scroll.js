import _animateScrollTo from 'animated-scroll-to'

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
 */
// const SUPPORT_PAGE_OFFSET = window.pageXOffset !== undefined
const IS_CSS1_COMPAT = ((document.compatMode || '') === 'CSS1Compat')
export const getElementScrollX = (element = document.documentElement) => {
	return IS_CSS1_COMPAT ?
		document.documentElement.scrollLeft :
		document.body.scrollLeft
}

export const getElementScrollY = (element = document.documentElement) => {
	return IS_CSS1_COMPAT ?
		document.documentElement.scrollTop :
		document.body.scrollTop
}

export const getElementOffsetTop = element => {
	return element.offsetTop
}

export const getElementOffsetLeft = element => {
	return element.offsetLeft
}

export const animateScrollTo = _animateScrollTo
