import delegate from 'delegate'
import PropTypes from 'prop-types'

const TRIGGER_COMPONENT_NAME = 'trigger'

const createInstance = (system, componentRoot, {
	target = null,
	component,
	action,
	actionArgs = [],
}) => {

	const activateTarget = () => {
		/**
		 * If no specific target is defined, assume the trigger is within a component.
		 * Use the parent element as the target, so that the closest component
		 * to the trigger will be activated
		 */
		const targetElement = target ?
			system.rootElement.querySelector(target) :
			componentRoot.parentElement

		if (targetElement) {
			system.invoke(targetElement, component, action, actionArgs)
		} else {
			console.warn(`Missing target ${target}`)
		}
	}

	componentRoot.addEventListener('click', activateTarget)

	return {
		defaultAction: activateTarget
	}
}

export default () => {
	return {
		componentName: TRIGGER_COMPONENT_NAME,
		instancePropTypes: {
			target: PropTypes.string,
			component: PropTypes.string,
			action: PropTypes.string,
			actionArgs: PropTypes.array,
		},
		createInstance
	}
}
