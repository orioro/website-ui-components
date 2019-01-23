import delegate from 'delegate'
import PropTypes from 'prop-types'
import createFocusTrap from 'focus-trap'

const DIALOG_COMPONENT_NAME = 'dialog'

const createInstance = (system, componentRoot, {
	activeClass = 'active',
	navigatable = false,
	preventMovingToBody = false
} = {}) => {
	const state = {
		active: false
	}

	if (!preventMovingToBody) {
		componentRoot.remove()
		document.querySelector('body').appendChild(componentRoot)
	}

	const focusTrap = createFocusTrap(componentRoot)

	const open = () => {
		if (!state.active) {
			system.getComponentInstances(DIALOG_COMPONENT_NAME).forEach(instance => {
				instance.close()
			})

			componentRoot.classList.add(activeClass)

			focusTrap.activate('[autofocus]')
			state.active = true
		}
	}

	const close = () => {
		if (state.active) {
			if (navigatable) {
				system.navHistoryReplaceState('#')
			}
			
			focusTrap.deactivate()
			componentRoot.classList.remove(activeClass)
			state.active = false
		}
	}

	const dismiss = () => {
		close()
	}

	componentRoot.addEventListener('click', e => {
		if (e.target === componentRoot) {
			dismiss()
		}
	})

	document.addEventListener('keyup', e => {
		if (state.active && e.keyCode === 27) {
			dismiss()
		}
	})

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
			preventMovingToBody: PropTypes.bool,
		},
		createInstance,
	}
}
