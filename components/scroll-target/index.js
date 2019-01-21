import {
	getElementScrollY,
} from '../../src/util'

import { createInstance, instancePropTypes } from './instance'

export const SCROLL_TARGET_COMPONENT_NAME = 'scroll-target'

/**
 * Initializes
 */
const initialize = ({
	onProgress = noop,
	onEnter = noop,
	onLeave = noop,
}, system) => {
	let WINDOW_INNER_HEIGHT

	const updateWindowMeasures = () => {
		WINDOW_INNER_HEIGHT = window.innerHeight
	}

	const updateScrollData = () => {
		system.getComponentInstances(SCROLL_TARGET_COMPONENT_NAME).forEach((instance, index) => {
			const {
				element,
				activeClass,
				topBoundary,
				bottomBoundary,
				focusPosition,

				preventLeave,

				enter,
				leave,
				handleProgress,
				activateFocus,
				deactivateFocus,
			} = instance

			let { top, bottom } = element.getBoundingClientRect()
			top = Math.floor(top)
			bottom = Math.floor(bottom)

			const _topBoundary = WINDOW_INNER_HEIGHT - (topBoundary * WINDOW_INNER_HEIGHT)
			const _bottomBoundary = 0 + (bottomBoundary * WINDOW_INNER_HEIGHT)
			const _focusPosition = focusPosition * WINDOW_INNER_HEIGHT

			const _coveredDistance = Math.max(_topBoundary - top, 0)
			const _totalDistance = bottom - top + (_topBoundary - _bottomBoundary)
			const _progress = Math.min(_coveredDistance / _totalDistance, 1)

			handleProgress(_progress)

			if (top < _topBoundary && bottom > _bottomBoundary) {
				enter()
			} else {
				if (!preventLeave) {
					leave()
				}
			}

			if (top <= _focusPosition && bottom > _focusPosition) {
				activateFocus()
			} else {
				deactivateFocus()
			}
		})
	}

	window.addEventListener('resize', updateWindowMeasures)
	window.addEventListener('scroll', updateScrollData)

	system.on('ready', updateWindowMeasures)
	system.on('ready', updateScrollData)
}

export default (options = {}) => {
	return {
		componentName: options.componentName || SCROLL_TARGET_COMPONENT_NAME,
		initialize: initialize.bind(null, options),
		createInstance: createInstance.bind(null, options),
		instancePropTypes,
	}
}
