import PropTypes from 'prop-types'

import defaults from 'lodash.defaults'

import {
	getElementsArray,
	animateScrollTo,
	getAnchorSelector,
} from '../../src/util'

const noop = () => {}

const computeRelatedElementsSelector = (baseSelector, id) => {
	if (baseSelector && id) {
		return `${baseSelector}, ${getAnchorSelector(id)}`
	} else if (baseSelector) {
		return baseSelector
	} else if (id) {
		return getAnchorSelector(id)
	} else {
		return null
	}
}

const DEFAULTS = {
	onProgress: noop,
	onEnter: noop,
	onLeave: noop,
	computeStyles: [],

	activeClass: 'active',
	enterClass: 'enter',
	focusClass: 'focus',
	leaveClass: 'leave',
	topBoundary: 0.2,
	bottomBoundary: 0.2,
	focusPosition: 0.2,
	preventLeave: false,

	related: null,
	relatedFocusClass: 'focus',
}

/**
 * Creates an instance
 */
export const createInstance = (options, system, componentRoot, props) => {
	const {
		onProgress,
		onEnter,
		onLeave,

		activeClass,
		enterClass,
		focusClass,
		leaveClass,
		topBoundary,
		bottomBoundary,
		focusPosition,
		preventLeave,

		related,
		relatedFocusClass,

		navigatable = false,
	} = defaults(props, options, DEFAULTS)

	const instance = {
		isActive: false,
		isFocused: false,
		progress: 0,
		previousProgress: -1,
	}

	const componentIdAttribute = componentRoot.getAttribute('id')
	const relatedElementsSelector = computeRelatedElementsSelector(
		related,
		componentIdAttribute
	)
	const relatedElements = relatedElementsSelector ?
		getElementsArray(relatedElementsSelector, system.rootElement) :
		[]

	/**
	 * Element enters the page
	 */
	const enter = () => {
		if (!instance.isActive) {
			instance.isActive = true

			componentRoot.classList.remove(leaveClass)
			componentRoot.classList.add(activeClass)
			componentRoot.classList.add(enterClass)

			onEnter(
				instance,
				instance.progress > instance.previousProgress ? 1 : -1
			)
		}
	}

	/**
	 * Element leaves the page
	 */
	const leave = () => {
		if (instance.isActive) {
			instance.isActive = false

			componentRoot.classList.remove(activeClass)
			componentRoot.classList.remove(enterClass)
			componentRoot.classList.add(leaveClass)

			onLeave(
				instance,
				instance.progress > instance.previousProgress ? 1 : -1
			)
		}
	}

	const handleProgress = progress => {
		if (progress !== instance.progress) {
			instance.previousProgress = instance.progress
			instance.progress = progress

			onProgress(
				instance,
				instance.progress,
				instance.progress > instance.previousProgress ? 1 : -1,
				instance.previousProgress
			)
		}
	}

	/**
	 * Element enters the page focus
	 */
	const activateFocus = () => {
		if (!instance.isFocused) {
			componentRoot.classList.add(focusClass)

			relatedElements.forEach(relatedElement => {
				relatedElement.classList.add(relatedFocusClass)
			})

			if (navigatable &&
					componentIdAttribute &&
					componentIdAttribute !== system.navHistoryGetCurrentHash()) {
				system.navHistoryReplaceState(`#${componentIdAttribute}`)
			}

			instance.isFocused = true
		}
	}

	/**
	 * Element leaves the page focus
	 */
	const deactivateFocus = () => {
		if (instance.isFocused) {
			componentRoot.classList.remove(focusClass)

			relatedElements.forEach(relatedElement => {
				relatedElement.classList.remove(relatedFocusClass)
			})

			instance.isFocused = false
		}
	}

	const scrollIntoFocus = () => {
		animateScrollTo(componentRoot, {
			offset: -1 * focusPosition * window.innerHeight + 20
		})
	}

	const defaultAction = () => {
		scrollIntoFocus()
	}

	return Object.assign(instance, {
		element: componentRoot,
		activeClass,
		topBoundary,
		bottomBoundary,
		preventLeave,
		focusPosition,

		related,
		enter,
		leave,
		handleProgress,
		activateFocus,
		deactivateFocus,

		scrollIntoFocus,
		defaultAction
	})
}

export const instancePropTypes = {
	activeClass: PropTypes.string,
	topBoundary: PropTypes.number,
	bottomBoundary: PropTypes.number,

	focusPosition: PropTypes.number,

	preventLeave: PropTypes.bool,

	related: PropTypes.string,
	relatedFocusClass: PropTypes.string,
}
