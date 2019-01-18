import delegate from 'delegate'
import PropTypes from 'prop-types'

const DIALOG_COMPONENT_NAME = 'dialog'

const createInstance = (system, componentRoot, {
	activeClass = 'active',
	navigatable = false
} = {}) => {
	const state = {
		active: false
	}

	const open = () => {
		if (!state.active) {
			system.getComponentInstances(DIALOG_COMPONENT_NAME).forEach(instance => {
				instance.close()
			})

			componentRoot.classList.add(activeClass)
			state.active = true
		}
	}

	const close = () => {
		if (state.active) {
			if (navigatable) {
				system.navHistoryReplaceState('#')
			}
			
			componentRoot.classList.remove(activeClass)
			state.active = false
		}
	}

	const dismiss = () => {
		close()
	}

	return {
		state,
		open,
		close,
		dismiss,
		defaultAction: open,
	}
}

export default () => {
	return {
		componentName: DIALOG_COMPONENT_NAME,
		instancePropTypes: {
			activeClass: PropTypes.string,
			navigatable: PropTypes.bool,
		},
		createInstance,
	}
}
